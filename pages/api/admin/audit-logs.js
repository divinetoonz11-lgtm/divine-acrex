import clientPromise from "../../../lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const ADMIN_EMAILS = [
  "inder.ambalika@gmail.com",
  "divinetoonz11@gmail.com",
];

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !ADMIN_EMAILS.includes(session.user?.email)) {
    return res.status(403).json({ ok: false });
  }

  const client = await clientPromise;
  const db = client.db("divine_db");

  const logs = await db
    .collection("audit_logs")
    .find({})
    .sort({ createdAt: -1 })
    .limit(200)
    .toArray();

  res.status(200).json({ ok: true, logs });
}
