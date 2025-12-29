import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  console.log("API HIT: /api/set-dealer");

  if (req.method !== "POST") {
    console.log("WRONG METHOD", req.method);
    return res.status(405).end();
  }

  const session = await getServerSession(req, res, authOptions);
  console.log("SESSION:", session);

  if (!session?.user?.email) {
    console.log("NO SESSION EMAIL");
    return res.status(401).json({ ok: false });
  }

  const client = await clientPromise;
  const db = client.db();
  const users = db.collection("users");

  const email = session.user.email.toLowerCase();

  await users.updateOne(
    { email },
    {
      $set: { role: "dealer", updatedAt: new Date() },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true }
  );

  console.log("DEALER SET FOR:", email);

  return res.json({ ok: true });
}
