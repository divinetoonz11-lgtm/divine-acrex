import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || session.user?.role !== "dealer") {
      return res.status(401).json({ ok: false });
    }

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    const email = session.user.email.toLowerCase();
    const user = await users.findOne({ email });

    if (!user) {
      return res.status(404).json({ ok: false });
    }

    if (req.method === "GET") {
      return res.json({
        ok: true,
        profile: {
          name: user.name || "",
          email: user.email || "",
          mobile: user.mobile || "",
          company: user.company || "",
          address: user.address || "",
          panNumber: user.panNumber || "",
          gstNumber: user.gstNumber || "",
          reraNumber: user.reraNumber || "",
        },
      });
    }

    return res.status(405).json({ ok: false });

  } catch (err) {
    console.error("PROFILE ERROR:", err);
    return res.status(500).json({ ok: false });
  }
}