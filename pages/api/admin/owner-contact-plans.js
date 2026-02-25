import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MONGODB_URI to .env.local");
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("divineacres");
  const collection = db.collection("ownercontactplans");

  /* ================= GET ================= */
  if (req.method === "GET") {
    try {
      const plans = await collection
        .find({})
        .sort({ price: 1 })
        .toArray();

      return res.status(200).json({
        ok: true,
        plans,
      });
    } catch (error) {
      return res.status(500).json({ ok: false });
    }
  }

  /* ================= POST ================= */
  if (req.method === "POST") {
    try {
      const { name, contacts, price, validityMonths, active } = req.body;

      if (!name || !contacts || !price || !validityMonths) {
        return res.status(400).json({
          ok: false,
          message: "All fields required",
        });
      }

      const newPlan = {
        name,
        contacts: Number(contacts),
        price: Number(price),
        validityMonths: Number(validityMonths),
        active: active ?? true,
        createdAt: new Date(),
      };

      await collection.insertOne(newPlan);

      return res.status(200).json({ ok: true });
    } catch (error) {
      return res.status(500).json({ ok: false });
    }
  }

  /* ================= PUT ================= */
  if (req.method === "PUT") {
    try {
      const { id, name, contacts, price, validityMonths, active } = req.body;

      if (!id) {
        return res.status(400).json({ ok: false });
      }

      await collection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            name,
            contacts: Number(contacts),
            price: Number(price),
            validityMonths: Number(validityMonths),
            active,
            updatedAt: new Date(),
          },
        }
      );

      return res.status(200).json({ ok: true });
    } catch (error) {
      return res.status(500).json({ ok: false });
    }
  }

  /* ================= DELETE ================= */
  if (req.method === "DELETE") {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ ok: false });
      }

      await collection.deleteOne({
        _id: new ObjectId(id),
      });

      return res.status(200).json({ ok: true });
    } catch (error) {
      return res.status(500).json({ ok: false });
    }
  }

  return res.status(405).json({ ok: false });
}
