import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import clientPromise from "../../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email || session.user.role !== "admin") {
    return res.status(401).json({ ok: false });
  }

  const { email, reason } = req.body;

  const client = await clientPromise;
  const db = client.db();

  await db.collection("dealer_requests").updateOne(
    { email, status: "pending" },
    {
      $set: {
        status: "rejected",
        rejectedAt: new Date(),
        reason: reason || "Not specified",
      },
    }
  );

  return res.json({ ok: true });
}
