import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { userId, title, propertyType, purpose, price, location, images } = req.body;

  if (!userId) return res.status(401).json({ ok: false });

  const count = await prisma.listing.count({
    where: { ownerId: userId, ownerRole: "USER", isDeleted: false },
  });

  if (count >= 2) {
    return res.json({ ok: false, message: "Free owner listing limit reached (2)" });
  }

  const listing = await prisma.listing.create({
    data: {
      ownerId: userId,
      ownerRole: "USER",
      title,
      propertyType,
      purpose,
      price: Number(price),
      location,
      images: images || "",
      status: "PENDING",
    },
  });

  res.json({ ok: true, listing });
}
