import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "dealer") {
    return res.status(401).json({ ok: false });
  }

  const { leadId, status } = req.body;

  if (!leadId || !status) {
    return res.json({ ok: false, message: "Missing data" });
  }

  const client = await clientPromise;
  const db = client.db();

  await db.collection("leads").updateOne(
    {
      _id: new ObjectId(leadId),
      dealerEmail: session.user.email,
    },
    {
      $set: { status },
    }
  );

  return res.json({ ok: true });
}
