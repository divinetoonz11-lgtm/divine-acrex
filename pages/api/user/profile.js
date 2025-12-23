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

    const user = await db.collection("users").findOne({
      email: session.user.email,
      role: "user",
    });

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      ok: true,
      profile: {
        name: user.name || "",
        email: user.email,
        phone: user.phone || "",
      },
    });
  } catch (err) {
    console.error("USER PROFILE ERROR:", err);
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
}
