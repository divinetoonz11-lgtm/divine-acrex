// pages/api/dealer/dashboard.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const { dealerId } = req.query;
    if (!dealerId) return res.status(401).json({ ok: false });

    const profile = await prisma.profile.findUnique({
      where: { userId: dealerId },
    });

    const listings = await prisma.listing.findMany({
      where: {
        ownerId: dealerId,
        isDeleted: false,
      },
      orderBy: { createdAt: "desc" },
    });

    const pending = listings.filter(l => l.status === "PENDING").length;
    const approved = listings.filter(l => l.status === "APPROVED").length;
    const rejected = listings.filter(l => l.status === "REJECTED").length;

    return res.status(200).json({
      ok: true,
      profileCompleted: profile?.profileCompleted || false,
      totalListings: listings.length,
      pending,
      approved,
      rejected,
      listings,
    });
  } catch (e) {
    return res.status(500).json({ ok: false });
  }
}
