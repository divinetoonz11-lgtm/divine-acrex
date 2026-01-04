import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { userId } = req.query;
  if (!userId) return res.status(401).end();

  const listings = await prisma.listing.findMany({
    where: {
      ownerId: userId,
      ownerRole: "USER",
      isDeleted: false,
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      city: true,
      price: true,
      status: true,
      verified: true,
      verificationMode: true,
      photosCount: true,
      videoUrl: true,
      createdAt: true,
    },
  });

  res.json({ ok: true, listings });
}
