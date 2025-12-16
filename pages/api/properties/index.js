// pages/api/properties/index.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;

  try {
    const { userId, role } = req.query || req.body || {};

    // GET
    if (method === "GET") {
      // Public site → only approved
      if (role === "PUBLIC") {
        const data = await prisma.listing.findMany({
          where: { status: "APPROVED", isDeleted: false },
          orderBy: { createdAt: "desc" },
        });
        return res.status(200).json(data);
      }

      // User / Dealer dashboard → own properties
      if (!userId) return res.status(401).json([]);

      const data = await prisma.listing.findMany({
        where: { ownerId: userId, isDeleted: false },
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json(data);
    }

    return res.status(405).json([]);
  } catch (e) {
    console.error(e);
    return res.status(500).json([]);
  }
}
