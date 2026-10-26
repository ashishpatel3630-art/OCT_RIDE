
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Pool, type PoolClient, type QueryResultRow } from "pg";

export const DATABASE_COLLECTIONS = [
  "profiles",
  "routes",
  "stops",
  "route_stops",
  "buses",
  "allocation_requests",
  "allocations",
  "saved_routes",
  "trips",
  "tracking_devices",
  "tracking_credentials",
  "bus_locations",
  "announcements",
  "notifications",
  "support_tickets",
  "audit_logs",
  "academic_years",
] as const;

type CollectionName = (typeof DATABASE_COLLECTIONS)[number];
type Document = Record<string, unknown>;
type Filter = Record<string, unknown>;
type QuerySession = SqlSession | undefined;

const schema = `
  CREATE TABLE IF NOT EXISTS app_documents (
    collection text NOT NULL,
    id text NOT NULL,
    document jsonb NOT NULL,
    PRIMARY KEY (collection, id)
  );

  CREATE INDEX IF NOT EXISTS app_documents_collection_idx
    ON app_documents (collection);

  CREATE UNIQUE INDEX IF NOT EXISTS profiles_id_uq
    ON app_documents ((document->>'id'))
    WHERE collection = 'profiles';

  CREATE UNIQUE INDEX IF NOT EXISTS profiles_email_uq
    ON app_documents ((document->>'email'))
    WHERE collection = 'profiles';

  CREATE UNIQUE INDEX IF NOT EXISTS profiles_student_number_uq
    ON app_documents ((document->>'student_number_key'))
    WHERE collection = 'profiles'
      AND jsonb_typeof(document->'student_number_key') = 'string';

  CREATE UNIQUE INDEX IF NOT EXISTS routes_id_uq
    ON app_documents ((document->>'id'))
    WHERE collection = 'routes';

  CREATE UNIQUE INDEX IF NOT EXISTS routes_name_uq
    ON app_documents ((document->>'name'))
    WHERE collection = 'routes';

  CREATE UNIQUE INDEX IF NOT EXISTS stops_id_uq
    ON app_documents ((document->>'id'))
    WHERE collection = 'stops';

  CREATE UNIQUE INDEX IF NOT EXISTS route_stops_route_stop_uq
    ON app_documents ((document->>'route_id'), (document->>'stop_id'))
    WHERE collection = 'route_stops';

  CREATE UNIQUE INDEX IF NOT EXISTS route_stops_order_uq
    ON app_documents ((document->>'route_id'), (document->>'stop_order'))
    WHERE collection = 'route_stops';

  CREATE UNIQUE INDEX IF NOT EXISTS buses_id_uq
    ON app_documents ((document->>'id'))
    WHERE collection = 'buses';

  CREATE UNIQUE INDEX IF NOT EXISTS buses_number_uq
    ON app_documents ((document->>'bus_number'))
    WHERE collection = 'buses';

  CREATE UNIQUE INDEX IF NOT EXISTS buses_registration_uq
    ON app_documents ((document->>'registration_number'))
    WHERE collection = 'buses';

  CREATE UNIQUE INDEX IF NOT EXISTS allocation_requests_id_uq
    ON app_documents ((document->>'id'))
    WHERE collection = 'allocation_requests';

  CREATE UNIQUE INDEX IF NOT EXISTS allocation_requests_pending_student_uq
    ON app_documents ((document->>'student_id'))
    WHERE collection = 'allocation_requests'
      AND document->>'status' = 'pending';

  CREATE UNIQUE INDEX IF NOT EXISTS allocations_id_uq
    ON app_documents ((document->>'id'))
    WHERE collection = 'allocations';

  CREATE UNIQUE INDEX IF NOT EXISTS allocations_active_student_uq
    ON app_documents ((document->>'student_id'))
    WHERE collection = 'allocations'
      AND document->>'active' = 'true';

  CREATE INDEX IF NOT EXISTS allocations_bus_active_idx
    ON app_documents ((document->>'bus_id'), (document->>'active'))
    WHERE collection = 'allocations';

  CREATE UNIQUE INDEX IF NOT EXISTS saved_routes_user_route_uq
    ON app_documents ((document->>'user_id'), (document->>'route_id'))
    WHERE collection = 'saved_routes';

  CREATE UNIQUE INDEX IF NOT EXISTS trips_id_uq
    ON app_documents ((document->>'id'))
    WHERE collection = 'trips';

  CREATE UNIQUE INDEX IF NOT EXISTS trips_active_bus_uq
    ON app_documents ((document->>'bus_id'))
    WHERE collection = 'trips'
      AND document->>'status' = 'active';

  CREATE INDEX IF NOT EXISTS trips_bus_started_idx
    ON app_documents ((document->>'bus_id'), (document->>'started_at'))
    WHERE collection = 'trips';

  CREATE UNIQUE INDEX IF NOT EXISTS tracking_devices_id_uq
    ON app_documents ((document->>'id'))
    WHERE collection = 'tracking_devices';

  CREATE UNIQUE INDEX IF NOT EXISTS tracking_credentials_device_uq
    ON app_documents ((document->>'device_id'))
    WHERE collection = 'tracking_credentials';

  CREATE UNIQUE INDEX IF NOT EXISTS tracking_credentials_token_uq
    ON app_documents ((document->>'token_hash'))
    WHERE collection = 'tracking_credentials';

  CREATE UNIQUE INDEX IF NOT EXISTS bus_locations_id_uq
    ON app_documents ((document->>'id'))
    WHERE collection = 'bus_locations';

  CREATE UNIQUE INDEX IF NOT EXISTS bus_locations_device_recorded_uq
    ON app_documents ((document->>'device_id'), (document->>'recorded_at'))
    WHERE collection = 'bus_locations';

  CREATE INDEX IF NOT EXISTS bus_locations_trip_recorded_idx
    ON app_documents ((document->>'trip_id'), (document->>'recorded_at'))
    WHERE collection = 'bus_locations';

  CREATE UNIQUE INDEX IF NOT EXISTS announcements_id_uq
    ON app_documents ((document->>'id'))
    WHERE collection = 'announcements';

  CREATE UNIQUE INDEX IF NOT EXISTS notifications_id_uq
    ON app_documents ((document->>'id'))
    WHERE collection = 'notifications';

  CREATE INDEX IF NOT EXISTS notifications_user_created_idx
    ON app_documents ((document->>'user_id'), (document->>'created_at'))
    WHERE collection = 'notifications';

  CREATE UNIQUE INDEX IF NOT EXISTS support_tickets_id_uq
    ON app_documents ((document->>'id'))
    WHERE collection = 'support_tickets';

  CREATE UNIQUE INDEX IF NOT EXISTS audit_logs_id_uq
    ON app_documents ((document->>'id'))
    WHERE collection = 'audit_logs';

  CREATE UNIQUE INDEX IF NOT EXISTS academic_years_year_uq
    ON app_documents ((document->>'year'))
    WHERE collection = 'academic_years';
`;

const globalForPostgres = globalThis as typeof globalThis & {
  postgresPool?: Pool;
  postgresSchemaPromise?: Promise<void>;
};

function getPool(): Pool {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString || !isDatabaseConfigured()) {
    throw new Error(
      "PostgreSQL is not configured. Set a valid Supabase PostgreSQL connection string in DATABASE_URL."
    );
  }

  globalForPostgres.postgresPool ??= new Pool({
    connectionString,
    ssl: {
      ca: readFileSync(
        join(process.cwd(), "supabase-ca.crt"),
        "utf8"
      ),
      rejectUnauthorized: true,
    },
  });

  return globalForPostgres.postgresPool;
}

function databaseError(cause: unknown): never {
  if (
    cause &&
    typeof cause === "object" &&
    "code" in cause &&
    cause.code === "23505"
  ) {
    throw Object.assign(
      new Error("A record with the same unique value already exists."),
      { code: 11000 }
    );
  }

  throw cause;
}

async function query<Row extends QueryResultRow = QueryResultRow>(
  sql: string,
  values: unknown[] = [],
  session?: QuerySession
) {
  try {
    const executor = session?.client ?? getPool();
    return await executor.query<Row>(sql, values);
  } catch (cause) {
    return databaseError(cause);
  }
}

function pathSql(path: string): string {
  const parts = path.split(".");

  if (
    parts.some(
      (part) => !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(part)
    )
  ) {
    throw new Error("Invalid database field path.");
  }

  return `document #> '{${parts.join(",")}}'`;
}

function compileFilter(
  filter: Filter,
  values: unknown[]
): string {
  const clauses: string[] = [];

  for (const [field, condition] of Object.entries(filter)) {
    if (field === "$or" || field === "$and") {
      if (
        !Array.isArray(condition) ||
        !condition.every(
          (item) => item && typeof item === "object"
        )
      ) {
        throw new Error(`Invalid ${field} database filter.`);
      }

      const joiner = field === "$or" ? " OR " : " AND ";
      const nested = condition.map(
        (item) => `(${compileFilter(item as Filter, values)})`
      );

      clauses.push(
        nested.length
          ? nested.join(joiner)
          : field === "$or"
            ? "FALSE"
            : "TRUE"
      );

      continue;
    }

    const path = pathSql(field);

    if (
      condition &&
      typeof condition === "object" &&
      !Array.isArray(condition) &&
      !(condition instanceof Date)
    ) {
      const operators = condition as Record<string, unknown>;

      for (const [operator, operand] of Object.entries(operators)) {
        if (operator === "$in") {
          if (!Array.isArray(operand)) {
            throw new Error("Invalid $in database filter.");
          }

          if (!operand.length) {
            clauses.push("FALSE");
          } else {
            const placeholders = operand.map((value) => {
              values.push(JSON.stringify(value));
              return `$${values.length}::jsonb`;
            });

            clauses.push(
              `${path} IN (${placeholders.join(", ")})`
            );
          }
        } else if (operator === "$ne") {
          values.push(JSON.stringify(operand));
          clauses.push(
            `${path} IS DISTINCT FROM $${values.length}::jsonb`
          );
        } else if (operator === "$exists") {
          clauses.push(
            operand ? `${path} IS NOT NULL` : `${path} IS NULL`
          );
        } else if (operator === "$type" && operand === "string") {
          clauses.push(`jsonb_typeof(${path}) = 'string'`);
        } else {
          throw new Error(
            `Unsupported database filter operator: ${operator}`
          );
        }
      }
    } else if (condition === null) {
      clauses.push(
        `(${path} IS NULL OR ${path} = 'null'::jsonb)`
      );
    } else {
      values.push(
        JSON.stringify(
          condition instanceof Date
            ? condition.toISOString()
            : condition
        )
      );

      clauses.push(`${path} = $${values.length}::jsonb`);
    }
  }

  return clauses.length ? clauses.join(" AND ") : "TRUE";
}

function recordId(
  collection: CollectionName,
  document: Document
): string {
  if (
    typeof document.id === "string" ||
    typeof document.id === "number"
  ) {
    return String(document.id);
  }

  if (
    collection === "academic_years" &&
    document.year !== undefined
  ) {
    return String(document.year);
  }

  if (collection === "route_stops") {
    return `${document.route_id}:${document.stop_id}`;
  }

  if (collection === "saved_routes") {
    return `${document.user_id}:${document.route_id}`;
  }

  if (
    collection === "tracking_credentials" &&
    typeof document.device_id === "string"
  ) {
    return document.device_id;
  }

  return randomUUID();
}

export class SqlSession {
  constructor(readonly client: PoolClient) {}

  async withTransaction<T>(
    callback: () => Promise<T>
  ): Promise<T> {
    await this.client.query("BEGIN");

    try {
      const result = await callback();
      await this.client.query("COMMIT");
      return result;
    } catch (cause) {
      await this.client.query("ROLLBACK");
      throw cause;
    }
  }

  async endSession(): Promise<void> {
    this.client.release();
  }
}

export class SqlClient {
  async startSession(): Promise<SqlSession> {
    const client = await getPool().connect();
    return new SqlSession(client);
  }
}

export class SqlCursor<T extends Document> {
  private sortFields: Record<string, 1 | -1> = {};
  private rowLimit?: number;

  constructor(
    private readonly collection: CollectionName,
    private readonly filter: Filter,
    private readonly session?: QuerySession
  ) {}

  sort(fields: Record<string, 1 | -1>): this {
    this.sortFields = fields;
    return this;
  }

  limit(count: number): this {
    this.rowLimit = count;
    return this;
  }

  async toArray(): Promise<T[]> {
    const values: unknown[] = [this.collection];
    const where = compileFilter(this.filter, values);

    const order = Object.entries(this.sortFields).map(
      ([field, direction]) =>
        `${pathSql(field)} ${direction === 1 ? "ASC" : "DESC"} NULLS LAST`
    );

    let sql =
      `SELECT document FROM app_documents ` +
      `WHERE collection = $1 AND ${where}`;

    if (order.length) {
      sql += ` ORDER BY ${order.join(", ")}`;
    }

    if (this.rowLimit !== undefined) {
      values.push(this.rowLimit);
      sql += ` LIMIT $${values.length}`;
    }

    const result = await query<{ document: T }>(
      sql,
      values,
      this.session
    );

    return result.rows.map((row) => row.document);
  }

  async next(): Promise<T | null> {
    this.limit(1);
    return (await this.toArray())[0] ?? null;
  }
}

export class SqlCollection<T extends Document = Document> {
  constructor(private readonly name: CollectionName) {}

  find(
    filter: Filter = {},
    options?: { session?: QuerySession }
  ) {
    return new SqlCursor<T>(
      this.name,
      filter,
      options?.session
    );
  }

  async findOne(
    filter: Filter,
    options?: { session?: QuerySession }
  ): Promise<T | null> {
    return new SqlCursor<T>(
      this.name,
      filter,
      options?.session
    ).limit(1).next();
  }

  async insertOne(
    document: T,
    options?: { session?: QuerySession }
  ) {
    const id = recordId(this.name, document);

    await query(
      `INSERT INTO app_documents (collection, id, document)
       VALUES ($1, $2, $3::jsonb)`,
      [this.name, id, JSON.stringify(document)],
      options?.session
    );

    return { acknowledged: true, insertedId: id };
  }

  async updateOne(
    filter: Filter,
    update: Document,
    options?: {
      session?: QuerySession;
      upsert?: boolean;
    }
  ) {
    const values: unknown[] = [this.name];
    const where = compileFilter(filter, values);

    const updateFields =
      update.$set && typeof update.$set === "object"
        ? (update.$set as Document)
        : {};

    const insertFields =
      update.$setOnInsert &&
      typeof update.$setOnInsert === "object"
        ? (update.$setOnInsert as Document)
        : {};

    let expression = "document || $";

    values.push(JSON.stringify(updateFields));
    expression += `${values.length}::jsonb`;

    if (update.$inc && typeof update.$inc === "object") {
      for (const [field, rawAmount] of Object.entries(
        update.$inc as Document
      )) {
        const amount = Number(rawAmount);

        if (!Number.isFinite(amount)) {
          throw new Error("Invalid numeric database increment.");
        }

        values.push(field, amount);

        expression =
          `jsonb_set(${expression}, ` +
          `ARRAY[$${values.length - 1}], ` +
          `to_jsonb(COALESCE((document->>$${values.length - 1})::numeric, 0) ` +
          `+ $${values.length}::numeric), true)`;
      }
    }

    const result = await query(
      `UPDATE app_documents
       SET document = ${expression}
       WHERE collection = $1 AND ${where}
       RETURNING id`,
      values,
      options?.session
    );

    if (result.rowCount) {
      return {
        acknowledged: true,
        matchedCount: result.rowCount,
        modifiedCount: result.rowCount,
      };
    }

    if (options?.upsert) {
      const base: Document = {
        ...insertFields,
        ...updateFields,
      };

      for (const [field, value] of Object.entries(filter)) {
        if (
          field.startsWith("$") ||
          (value &&
            typeof value === "object" &&
            !(value instanceof Date))
        ) {
          continue;
        }

        base[field] = value;
      }

      const inserted = await this.insertOne(
        base as T,
        options
      );

      return {
        acknowledged: true,
        matchedCount: 0,
        modifiedCount: 0,
        upsertedId: inserted.insertedId,
      };
    }

    return {
      acknowledged: true,
      matchedCount: 0,
      modifiedCount: 0,
    };
  }

  async updateMany(
    filter: Filter,
    update: Document,
    options?: { session?: QuerySession }
  ) {
    const matches = await new SqlCursor<T>(
      this.name,
      filter,
      options?.session
    ).toArray();

    for (const document of matches) {
      const key = recordId(this.name, document);

      const updateFields =
        update.$set && typeof update.$set === "object"
          ? (update.$set as Document)
          : {};

      const next: Document = {
        ...document,
        ...updateFields,
      };

      if (update.$inc && typeof update.$inc === "object") {
        for (const [field, amount] of Object.entries(
          update.$inc as Document
        )) {
          next[field] =
            Number(document[field] ?? 0) + Number(amount);
        }
      }

      await query(
        `UPDATE app_documents
         SET document = $3::jsonb
         WHERE collection = $1 AND id = $2`,
        [this.name, key, JSON.stringify(next)],
        options?.session
      );
    }

    return {
      acknowledged: true,
      matchedCount: matches.length,
      modifiedCount: matches.length,
    };
  }

  async deleteOne(
    filter: Filter,
    options?: { session?: QuerySession }
  ) {
    const values: unknown[] = [this.name];
    const where = compileFilter(filter, values);

    const result = await query(
      `WITH target AS (
         SELECT id
         FROM app_documents
         WHERE collection = $1 AND ${where}
         LIMIT 1
       )
       DELETE FROM app_documents
       WHERE collection = $1
         AND id IN (SELECT id FROM target)`,
      values,
      options?.session
    );

    return {
      acknowledged: true,
      deletedCount: result.rowCount ?? 0,
    };
  }

  async deleteMany(
    filter: Filter,
    options?: { session?: QuerySession }
  ) {
    const values: unknown[] = [this.name];
    const where = compileFilter(filter, values);

    const result = await query(
      `DELETE FROM app_documents
       WHERE collection = $1 AND ${where}`,
      values,
      options?.session
    );

    return {
      acknowledged: true,
      deletedCount: result.rowCount ?? 0,
    };
  }

  async countDocuments(
    filter: Filter = {},
    options?: { session?: QuerySession }
  ): Promise<number> {
    const values: unknown[] = [this.name];
    const where = compileFilter(filter, values);

    const result = await query<{ count: string }>(
      `SELECT count(*)::text AS count
       FROM app_documents
       WHERE collection = $1 AND ${where}`,
      values,
      options?.session
    );

    return Number(result.rows[0]?.count ?? 0);
  }
}

export class SqlDatabase {
  collection<T extends Document = Document>(
    name: string
  ): SqlCollection<T> {
    if (
      !DATABASE_COLLECTIONS.includes(name as CollectionName)
    ) {
      throw new Error("Unknown database collection.");
    }

    return new SqlCollection<T>(name as CollectionName);
  }
}

export function isDatabaseConfigured(): boolean {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    return false;
  }

  try {
    const url = new URL(connectionString);

    return (
      (url.protocol === "postgres:" ||
        url.protocol === "postgresql:") &&
      Boolean(url.hostname) &&
      Boolean(url.username) &&
      Boolean(url.password) &&
      url.pathname.length > 1 &&
      !/^(host|your[-_].*|<.*>)$/i.test(url.hostname)
    );
  } catch {
    return false;
  }
}

export async function getDatabaseClient(): Promise<SqlClient> {
  return new SqlClient();
}

export async function getDatabase(): Promise<SqlDatabase> {
  const pool = getPool();

  if (!globalForPostgres.postgresSchemaPromise) {
    const schemaPromise = pool
      .query(schema)
      .then(async () => {
        await pool.query(
          `INSERT INTO app_documents (collection, id, document)
           SELECT
             'academic_years',
             year::text,
             jsonb_build_object(
               'year', year,
               'label', label,
               'enrollment_open', true,
               'updated_at', now()
             )
           FROM (
             VALUES
               (1, 'First year'),
               (2, 'Second year'),
               (3, 'Third year'),
               (4, 'Fourth year')
           ) AS years(year, label)
           ON CONFLICT (collection, id) DO NOTHING`
        );
      });

    globalForPostgres.postgresSchemaPromise = schemaPromise;

    try {
      await schemaPromise;
    } catch (error) {
      if (
        globalForPostgres.postgresSchemaPromise === schemaPromise
      ) {
        globalForPostgres.postgresSchemaPromise = undefined;
      }

      throw error;
    }
  } else {
    await globalForPostgres.postgresSchemaPromise;
  }

  return new SqlDatabase();
}

export async function closeDatabase(): Promise<void> {
  await globalForPostgres.postgresPool?.end();

  globalForPostgres.postgresPool = undefined;
  globalForPostgres.postgresSchemaPromise = undefined;
}
