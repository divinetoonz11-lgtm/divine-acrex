import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  try {
    // 🔐 AUTH CHECK
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    const { propertyId } = req.body;
    if (!propertyId) {
      return res.status(400).json({ ok: false, message: "Property id missing" });
    }

    // 🔒 OWNERSHIP CHECK
    const listing = await prisma.listing.findFirst({
      where: {
        id: propertyId,
        ownerEmail: session.user.email,
        isDeleted: false,
      },
    });

    if (!listing) {
      return res.status(404).json({
        ok: false,
        message: "Property not found or not allowed",
      });
    }

    // ✅ LIVE PHOTO BASED VERIFY
    await prisma.listing.update({
      where: { id: propertyId },
      data: {
        verificationStatus: "VERIFIED_LIVE",
        verifiedSource: "LIVE_PHOTO",
        verifiedAt: new Date(),
        status: "LIVE",
      },
    });

    return res.json({
      ok: true,
      message: "✅ Property verified via live photo",
    });
  } catch (e) {
    console.error("LIVE VERIFY ERROR:", e);
    return res.status(500).json({ ok: false });
  }
}
