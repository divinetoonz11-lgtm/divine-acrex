// pages/api/admin/dealers/[id].js
import clientPromise from "../../../../lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { ObjectId } from "mongodb";

const ADMIN_EMAILS = [
  "inder.ambalika@gmail.com",
  "divinetoonz11@gmail.com",
];

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !ADMIN_EMAILS.includes(session.user.email)) {
    return res.status(401).json({ ok: false });
  }

  const { id } = req.query;
  const client = await clientPromise;
  const db = client.db();

  // UPDATE (Edit / Activate / Deactivate)
  if (req.method === "PUT") {
    const { name, email, phone, status, verified } = req.body;

    const update = {};
    if (name) update.name = name;
    if (email) update.email = email;
    if (phone) update.phone = phone;
    if (typeof status !== "undefined") update.status = status;
    if (typeof verified !== "undefined") update.verified = verified;

    await db.collection("dealers").updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    return res.json({ ok: true });
  }

  // DELETE
  if (req.method === "DELETE") {
    await db.collection("dealers").deleteOne({
      _id: new ObjectId(id),
    });
    return res.json({ ok: true });
  }

  return res.status(405).end();
}
