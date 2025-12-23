import { getServerSession } from "next-auth/next";
import { authOptions } from "./[...nextauth]";
import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ ok: false });
  }

  const { role } = req.body;
  if (!["user", "dealer"].includes(role)) {
    return res.status(400).json({ ok: false });
  }

  const client = await clientPromise;
  const db = client.db();
  const users = db.collection("users");

  const user = await users.findOne({ email: session.user.email });

  // 🔒 ROLE ALREADY FIXED → DO NOTHING
  if (user?.role) {
    return res.json({ ok: true, role: user.role });
  }

  // 🆕 FIRST LOGIN → SET ROLE
  await users.updateOne(
    { email: session.user.email },
    { $set: { role } }
  );

  return res.json({ ok: true, role });
}
