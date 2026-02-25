import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { id } = req.body;

    const client = await clientPromise;
    const db = client.db();

    await db.collection("properties").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          isHidden: true,
          updatedAt: new Date(),
        },
      }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
