// pages/api/admin/sub-admins/[id].js
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

  /* ================= UPDATE (EDIT / STATUS) ================= */
  if (req.method === "PUT") {
    const {
      name,
      email,
      regions,
      permissions,
      status,
    } = req.body;

    const update = {};
    if (name) update.name = name;
    if (email) update.email = email;
    if (regions) update.regions = regions;
    if (permissions) update.permissions = permissions;
    if (status) update.status = status;

    await db.collection("users").updateOne(
      { _id: new ObjectId(id), role: "sub-admin" },
      { $set: update }
    );

    return res.json({ ok: true });
  }

  /* ================= DELETE ================= */
  if (req.method === "DELETE") {
    await db.collection("users").deleteOne({
      _id: new ObjectId(id),
      role: "sub-admin",
    });
    return res.json({ ok: true });
  }

  return res.status(405).end();
}
