import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("divineacres");

  const logsCollection = db.collection("owner_contact_usage_logs");

  /* ================= GET LOGS ================= */
  if (req.method === "GET") {
    try {
      const logs = await logsCollection
        .find({})
        .sort({ createdAt: -1 })
        .limit(500)
        .toArray();

      return res.status(200).json({
        ok: true,
        logs,
      });
    } catch (error) {
      return res.status(500).json({ ok: false });
    }
  }

  /* ================= CREATE LOG ================= */
  if (req.method === "POST") {
    try {
      const {
        userId,
        propertyId,
        plan,
        usedCredits,
        remainingCredits,
      } = req.body;

      const log = {
        userId,
        propertyId,
        plan,
        usedCredits,
        remainingCredits,
        createdAt: new Date(),
      };

      await logsCollection.insertOne(log);

      return res.status(200).json({ ok: true });
    } catch (error) {
      return res.status(500).json({ ok: false });
    }
  }

  return res.status(405).json({ ok: false });
}
