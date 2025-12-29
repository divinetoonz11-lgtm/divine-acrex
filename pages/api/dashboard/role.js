import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).end();

  const client = await clientPromise;
  const db = client.db();

  const user = await db
    .collection("users")
    .findOne({ email: session.user.email });

  res.json({ role: user?.role || "user" });
}
