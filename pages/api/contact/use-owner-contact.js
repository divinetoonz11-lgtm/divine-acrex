import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  try {
    const { userId, propertyId } = req.body;

    if (!userId || !propertyId) {
      return res.status(400).json({
        ok: false,
        message: "Missing required fields",
      });
    }

    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection("users").findOne({
      _id: new ObjectId(userId),
    });

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "User not found",
      });
    }

    /* ================= FREE CONTACT LOGIC ================= */

    // First time free contact
    if (!user.ownerContactUsed) {
      await db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            ownerContactUsed: true,
            ownerContactUsedAt: new Date(),
          },
        }
      );

      return res.status(200).json({
        ok: true,
        freeUsed: true,
        message: "Free owner contact used successfully",
      });
    }

    /* ================= WALLET CHECK ================= */

    const credits = user.ownerContactCredits || 0;

    if (credits <= 0) {
      return res.status(403).json({
        ok: false,
        message: "No credits available. Please purchase plan.",
      });
    }

    /* ================= DEDUCT CREDIT ================= */

    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      {
        $inc: { ownerContactCredits: -1 },
        $push: {
          ownerContactLogs: {
            propertyId,
            usedAt: new Date(),
          },
        },
      }
    );

    return res.status(200).json({
      ok: true,
      freeUsed: false,
      message: "Owner contact unlocked successfully",
    });
  } catch (error) {
    console.error("OWNER CONTACT USE ERROR:", error);

    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
}
