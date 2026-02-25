import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ allowed: false });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    // TEMP: allow if user not identified (frontend unblock)
    const userId =
      req.headers["x-user-id"] ||
      req.query.userId ||
      null;

    if (!userId) {
      return res.json({ allowed: true });
    }

    const user = await db.collection("users").findOne({
      _id: new ObjectId(userId),
    });

    if (!user) {
      return res.json({ allowed: true });
    }

    // PAID USER → UNLIMITED
    if (user.subscription?.active === true) {
      return res.json({ allowed: true });
    }

    // FREE USER → 3 PER MONTH
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const used = await db.collection("leads").countDocuments({
      userId: new ObjectId(userId),
      type: "OWNER_CONTACT",
      createdAt: { $gte: monthStart },
    });

    if (used >= 3) {
      return res.json({ allowed: false });
    }

    return res.json({ allowed: true });
  } catch {
    return res.json({ allowed: true });
  }
}
