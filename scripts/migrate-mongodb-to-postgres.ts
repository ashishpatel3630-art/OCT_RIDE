import { MongoClient } from "mongodb";
import { loadEnvConfig } from "@next/env";
import { closeDatabase, DATABASE_COLLECTIONS, getDatabase, getDatabaseClient } from "../lib/postgres-core";

async function migrate() {
  loadEnvConfig(process.cwd(), true);
  const sourceUri = process.env.MONGODB_URI;
  const destinationUri = process.env.DATABASE_URL;
  if (!sourceUri || !destinationUri) {
    throw new Error("Set both MONGODB_URI and DATABASE_URL before running the migration.");
  }

  const sourceClient = new MongoClient(sourceUri);
  try {
    await sourceClient.connect();
    const source = sourceClient.db(process.env.MONGODB_DB || "ogi_ride");
    const destination = await getDatabase();
    const counts = await Promise.all(
      DATABASE_COLLECTIONS.filter((name) => name !== "academic_years").map(async (name) => ({
        name,
        count: await destination.collection(name).countDocuments(),
      })),
    );
    const occupied = counts.filter(({ count }) => count > 0);
    if (occupied.length) {
      throw new Error(
        `Refusing to merge into a non-empty PostgreSQL database: ${occupied.map(({ name }) => name).join(", ")}.`,
      );
    }

    const session = await (await getDatabaseClient()).startSession();
    try {
      await session.withTransaction(async () => {
        for (const name of DATABASE_COLLECTIONS) {
          const cursor = source.collection(name).find();
          for await (const sourceDocument of cursor) {
            const { _id, ...document } = sourceDocument;
            void _id;
            const target = destination.collection(name);
            if (name === "academic_years") {
              await target.updateOne(
                { year: document.year },
                { $set: document },
                { upsert: true, session },
              );
            } else {
              await target.insertOne(document, { session });
            }
          }
        }
      });
    } finally {
      await session.endSession();
    }
    console.log("MongoDB records were migrated to PostgreSQL successfully.");
  } finally {
    await sourceClient.close();
    await closeDatabase();
  }
}

migrate().catch((error: unknown) => {
  console.error("MongoDB to PostgreSQL migration failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
