import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { dealerId } = req.query;
  if (!dealerId) return res.status(401).end();

  const listings = await prisma.listing.findMany({
    where: { ownerId: dealerId, ownerRole: "DEALER", isDeleted: false },
    orderBy: { createdAt: "desc" },
  });

  res.json({ ok: true, listings });
}
