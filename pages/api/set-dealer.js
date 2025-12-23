import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    return res.status(401).json({ ok: false, reason: "no session" });
  }

  const client = await clientPromise;
  const db = client.db();
  const users = db.collection("users");

  const email = session.user.email.toLowerCase();

  // 🔥 EXACT USER JAISA CREATE / UPDATE
  await users.updateOne(
    { email },
    {
      $set: {
        email,
        role: "dealer",
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );

  return res.json({ ok: true, role: "dealer" });
}
