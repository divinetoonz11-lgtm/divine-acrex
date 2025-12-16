import clientPromise from "../../../lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const ADMIN_EMAILS = [
  "inder.ambalika@gmail.com",
  "divinetoonz11@gmail.com",
];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  // 🔐 ADMIN GUARD
  const session = await getServerSession(req, res, authOptions);
  if (!session || !ADMIN_EMAILS.includes(session.user?.email)) {
    return res.status(403).json({ ok: false, message: "Forbidden" });
  }

  const { userId, update } = req.body;
  if (!userId || !update) {
    return res.status(400).json({ ok: false, message: "Invalid request" });
  }

  const client = await clientPromise;
  const db = client.db("divine_db");

  await db.collection("users").updateOne(
    { _id: userId },
    { $set: update }
  );

  return res.status(200).json({ ok: true });
}
