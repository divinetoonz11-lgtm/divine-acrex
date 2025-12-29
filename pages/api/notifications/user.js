// pages/api/notifications/user.js
import clientPromise from "../../../lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

/*
USER / DEALER NOTIFICATIONS FEED
✔ Logged-in only
✔ Target-based
✔ Pagination
✔ 10L+ safe
*/

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.email) {
    return res.status(401).json({ ok: false });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ ok: false });
  }

  const client = await clientPromise;
  const db = client.db();

  const page = Math.max(parseInt(req.query.page || "1"), 1);
  const limit = Math.min(parseInt(req.query.limit || "20"), 50);
  const skip = (page - 1) * limit;

  // target mapping
  const target =
    session.user.role === "dealer" ? "dealer" : "user";

  const [items, total] = await Promise.all([
    db
      .collection("notifications")
      .find({ $or: [{ target }, { target: "all" }] })
      .project({
        title: 1,
        message: 1,
        createdAt: 1,
        read: 1,
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),

    db
      .collection("notifications")
      .countDocuments({ $or: [{ target }, { target: "all" }] }),
  ]);

  return res.json({
    ok: true,
    items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
}
