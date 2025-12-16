import clientPromise from "../../../lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const ADMIN_EMAILS = [
  "inder.ambalika@gmail.com",
  "divinetoonz11@gmail.com",
];

export default async function handler(req, res) {
  // 🔐 ADMIN GUARD
  const session = await getServerSession(req, res, authOptions);
  if (!session || !ADMIN_EMAILS.includes(session.user?.email)) {
    return res.status(403).json({ ok: false, message: "Forbidden" });
  }

  const client = await clientPromise;
  const db = client.db("divine_db");

  if (req.method === "GET") {
    const users = await db.collection("users").find({}).toArray();
    return res.status(200).json({ ok: true, users });
  }

  return res.status(405).json({ ok: false, message: "Method not allowed" });
}
