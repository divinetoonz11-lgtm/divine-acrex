// pages/api/admin/properties/index.js
import clientPromise from "../../../../lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

const ADMIN_EMAILS = [
  "inder.ambalika@gmail.com",
  "divinetoonz11@gmail.com",
];

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !ADMIN_EMAILS.includes(session.user.email)) {
    return res.status(401).json({ ok: false });
  }

  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const client = await clientPromise;
  const db = client.db();

  const page = parseInt(req.query.page || "1");
  const limit = parseInt(req.query.limit || "20");
  const skip = (page - 1) * limit;

  const status = req.query.status;
  const query = {};

  if (status && status !== "all") {
    if (status === "featured") {
      query.featured = true;
    } else {
      query.status = status.toLowerCase(); // 🔒 LOCKED
    }
  }

  const [properties, total] = await Promise.all([
    db.collection("properties")
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),

    db.collection("properties").countDocuments(query),
  ]);

  return res.json({
    ok: true,
    page,
    limit,
    total,
    properties,
  });
}
