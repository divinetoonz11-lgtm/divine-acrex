// pages/api/user/dashboard.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(401).json({ ok: false });

    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    const listings = await prisma.listing.findMany({
      where: { ownerId: userId, isDeleted: false },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      ok: true,
      profileCompleted: profile?.profileCompleted || false,
      listings,
    });
  } catch {
    return res.status(500).json({ ok: false });
  }
}
