import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  try {
    const { id, action } = req.body;
    if (!id || !action) {
      return res.status(400).json({ ok: false, message: "Missing data" });
    }

    const client = await clientPromise;
    const db = client.db();

    let update = {};

    // 🔒 FINAL RULE: ADMIN ACTIONS (SINGLE SOURCE)
    if (action === "approve") {
      update = { status: "live" };
    }
    else if (action === "block") {
      update = { status: "blocked" };
    }
    else if (action === "spam") {
      update = { spam: true };
    }
    else {
      return res.status(400).json({ ok: false, message: "Invalid action" });
    }

    await db.collection("properties").updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    return res.json({ ok: true });
  } catch (e) {
    console.error("ADMIN PROPERTY ACTION ERROR:", e);
    return res.status(500).json({ ok: false });
  }
}
