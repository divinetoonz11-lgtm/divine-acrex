import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({});

  try {
    const { propertyId, photoUploaded } = req.body;

    if (!propertyId || !photoUploaded) {
      return res.status(400).json({ ok: false });
    }

    // ✅ AUTO VERIFY
    await prisma.listing.update({
      where: { id: propertyId },
      data: {
        verificationStatus: "VERIFIED_LIVE",
        verifiedSource: "LIVE_PHOTO",
        verifiedAt: new Date(),
      },
    });

    return res.json({
      ok: true,
      message: "✅ Verified via Live Photo",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false });
  }
}
