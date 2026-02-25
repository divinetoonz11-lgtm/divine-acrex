import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false });
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        ok: false,
        message: "Property ID missing",
      });
    }

    const client = await clientPromise;
    const db = client.db();

    // 🔥 Replace with real logged-in user logic later
    const user = await db.collection("users").findOne({
      email: "turtlehotel101@gmail.com",
    });

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "User not found",
      });
    }

    const credits = user.ownerContactCredits || 0;

    if (credits > 0) {
      return res.status(200).json({
        active: true,
        remaining: credits,
      });
    }

    return res.status(200).json({
      active: false,
      remaining: 0,
    });
  } catch (err) {
    console.error("CHECK OWNER CONTACT ERROR:", err);
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
}
