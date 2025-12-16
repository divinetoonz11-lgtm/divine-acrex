// pages/api/dealer/profile.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  // ✅ ONLY LOGIN REQUIRED (ROLE CHECK LATER)
  if (!session || !session.user?.email) {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }

  const email = session.user.email;

  // ---------- GET DEALER PROFILE ----------
  if (req.method === "GET") {
    let user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    // AUTO CREATE DEALER ON FIRST ACCESS
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          role: "DEALER",
          profile: {
            create: {
              fullName: session.user.name || "",
            },
          },
        },
        include: { profile: true },
      });
    }

    return res.json({
      ok: true,
      profile: {
        name: user.profile?.fullName || "",
        email: user.email,
        phone: user.profile?.phone || "",
        plan: user.plan || "FREE",
      },
    });
  }

  // ---------- UPDATE DEALER PROFILE ----------
  if (req.method === "PUT") {
    const { name, phone } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    await prisma.profile.update({
      where: { userId: user.id },
      data: {
        fullName: name,
        phone,
      },
    });

    return res.json({ ok: true });
  }

  res.status(405).json({ ok: false });
}
