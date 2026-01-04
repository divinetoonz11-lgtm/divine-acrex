// pages/api/properties/index.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    /* ================== CREATE PROPERTY ================== */
    if (req.method === "POST") {
      const body = req.body;

      const listing = await prisma.listing.create({
        data: {
          ...body,

          // 🔐 DEFAULT STATUS
          status: "APPROVED",                 // live
          verificationStatus: "UNVERIFIED",   // ❌ not verified yet
          verifiedSource: null,               // later: LIVE_PHOTO
        },
      });

      return res.status(200).json({
        ok: true,
        message: "Property posted (Unverified)",
        listingId: listing.id,
      });
    }

    /* ================== GET ================== */
    if (req.method === "GET") {
      const { userId, role } = req.query;

      if (role === "PUBLIC") {
        const data = await prisma.listing.findMany({
          where: {
            status: "APPROVED",
            isDeleted: false,
          },
          orderBy: { createdAt: "desc" },
        });
        return res.status(200).json(data);
      }

      if (!userId) return res.status(401).json([]);

      const data = await prisma.listing.findMany({
        where: { ownerId: userId, isDeleted: false },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json(data);
    }

    return res.status(405).json({});
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
}
