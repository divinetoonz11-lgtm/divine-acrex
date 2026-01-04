import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { propertyId, userId } = req.body;
  if (!propertyId || !userId) return res.status(400).end();

  const listing = await prisma.listing.findFirst({
    where: {
      id: propertyId,
      ownerId: userId,
      ownerRole: "USER",
      isDeleted: false,
    },
  });

  if (!listing) return res.status(404).json({ ok: false });

  // 🔑 AUTO VERIFICATION RULE (Magicbricks-like)
  const autoVerified =
    listing.photosCount >= 3 && !!listing.videoUrl;

  const updated = await prisma.listing.update({
    where: { id: propertyId },
    data: {
      status: "LIVE",
      verified: autoVerified,
      verificationMode: autoVerified ? "AUTO" : "USER",
    },
  });

  res.json({
    ok: true,
    verified: updated.verified,
    status: updated.status,
  });
}
