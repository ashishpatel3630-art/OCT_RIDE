export function databaseConnectionErrorMessage(cause: unknown) {
  if (cause && typeof cause === "object" && "code" in cause && cause.code === "23505") {
    return "A record with the same unique value already exists.";
  }
  if (cause && typeof cause === "object" && "code" in cause && cause.code === "28P01") {
    return "PostgreSQL rejected the database credentials. Check the username and password in DATABASE_URL.";
  }
  if (cause && typeof cause === "object" && "message" in cause && typeof cause.message === "string") {
    if (/ECONNREFUSED|ENOTFOUND|ETIMEDOUT|ECONNRESET/i.test(cause.message)) {
      return "Could not reach PostgreSQL. Check that the database is running and that its network access rules allow this app.";
    }
  }
  return "Could not connect to PostgreSQL. Check the database configuration.";
}
