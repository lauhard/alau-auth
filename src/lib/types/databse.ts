// generate base db type from both implementations for better type safety in services
type DbMode = "sync" | "async";
type DbDriverResult = unknown;
