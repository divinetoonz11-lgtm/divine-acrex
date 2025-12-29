// pages/api/user/profile.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.email) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    const email = session.user.email;

    // 🔍 USER (role check intentionally removed – dashboard needs flexibility)
    const user = await users.findOne({ email });

    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    /* ===================== GET ===================== */
    if (req.method === "GET") {
      return res.status(200).json({
        ok: true,
        name: user.name || "",
        email: user.email,
        phone: user.phone || "",
        photo: user.photo || "",
        profileCompleted: !!user.profileCompleted,
      });
    }

    /* ===================== PUT ===================== */
    if (req.method === "PUT") {
      const {
        name,
        phone,
        photo,
        profileCompleted,
      } = req.body || {};

      const update = {};

      if (name !== undefined) update.name = name;
      if (phone !== undefined) update.phone = phone;
      if (photo !== undefined) update.photo = photo;
      if (profileCompleted !== undefined)
        update.profileCompleted = profileCompleted;

      await users.updateOne(
        { email },
        { $set: update }
      );

      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ ok: false, message: "Method not allowed" });

  } catch (err) {
    console.error("USER PROFILE ERROR:", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}
