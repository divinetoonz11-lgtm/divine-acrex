import { getServerSession } from "next-auth/next";
import { authOptions } from "./[...nextauth]";
import clientPromise from "../../../lib/mongodb";

/*
ROLE SYNC CHECK API
-------------------
✔ Checks DB role vs session role
✔ If mismatch → forceLogout = true
*/

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    return res.json({ ok: false });
  }

  const client = await clientPromise;
  const db = client.db();

  const user = await db.collection("users").findOne({
    email: session.user.email,
  });

  if (!user || !user.role) {
    return res.json({ ok: false });
  }

  // 🔥 ROLE MISMATCH DETECTED
  if (user.role !== session.user.role) {
    return res.json({
      ok: true,
      forceLogout: true,
      newRole: user.role,
    });
  }

  return res.json({ ok: true, forceLogout: false });
}
