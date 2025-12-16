// pages/api/user/profile.js
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.email) {
      return res.status(401).json({ ok: false, msg: "Not logged in" });
    }

    const email = session.user.email;
    const name = session.user.name || "";

    // ---------------- ENSURE USER ----------------
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, role: "USER" },
    });

    // ---------------- GET PROFILE ----------------
    if (req.method === "GET") {
      const profile = await prisma.profile.upsert({
        where: { userId: user.id },
        update: {
          fullName: name,
        },
        create: {
          userId: user.id,
          fullName: name,
          profileCompleted: false,
        },
      });

      return res.json({
        name: profile.fullName || "",
        email, // email USER table se
        phone: profile.phone || "",
        dob: profile.dob || "",
      });
    }

    // ---------------- UPDATE PROFILE ----------------
    if (req.method === "PUT") {
      const { phone = "", dob = "" } = req.body || {};

      await prisma.profile.update({
        where: { userId: user.id },
        data: {
          phone,
          dob,
          profileCompleted: true,
          updatedAt: new Date(),
        },
      });

      return res.json({ ok: true });
    }

    res.status(405).end();
  } catch (e) {
    console.error("PROFILE API ERROR:", e);
    return res.status(500).json({ ok: false, error: "Profile save failed" });
  }
}
