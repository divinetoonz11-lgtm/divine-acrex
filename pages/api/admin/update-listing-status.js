import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { listingId, status } = req.body;
  if (!listingId || !status) return res.status(400).end();

  const updated = await prisma.listing.update({
    where: { id: listingId },
    data: { status },
  });

  res.json({ ok: true, updated });
}
