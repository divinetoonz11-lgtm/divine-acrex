import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const listings = await prisma.listing.findMany({
    where: { status: "PENDING", isDeleted: false },
    orderBy: { createdAt: "desc" },
  });

  res.json({ ok: true, listings });
}
