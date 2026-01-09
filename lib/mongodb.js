import { MongoClient } from "mongodb";

let client;

/**
 * Get MongoDB client (shared in dev, fresh in prod)
 */
export function getMongoClient() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI missing");
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  }

  const client = new MongoClient(uri);
  return client.connect();
}

/**
 * Default export for backward compatibility
 * (NextAuth + old imports expect default)
 */
const clientPromise = getMongoClient();
export default clientPromise;
