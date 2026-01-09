import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    /* ================= AUTH ================= */
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    const { propertyId } = req.body;
    if (!propertyId) {
      return res.status(400).json({ ok: false, message: "Property id missing" });
    }

    /* ================= FIND OWNER ================= */
    const owner = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true },
    });

    if (!owner) {
      return res.status(403).json({ ok: false, message: "Invalid user" });
    }

    /* ================= FIND LISTING ================= */
    const listing = await prisma.listing.findFirst({
      where: {
        id: propertyId,
        ownerId: owner.id,
        ownerRole: owner.role, // USER / DEALER
        isDeleted: false,
      },
    });

    if (!listing) {
      return res.status(404).json({
        ok: false,
        message: "Property not found or not allowed",
      });
    }

    if (listing.status === "LIVE") {
      return res.json({
        ok: true,
        status: "LIVE",
        verified: listing.verified,
        message: "Property already live",
      });
    }

    /* ================= AUTO VERIFICATION LOGIC =================
       Magicbricks style:
       ✔ 3+ photos OR
       ✔ 1 live video
    ============================================================ */
    const autoVerified =
      Number(listing.photosCount || 0) >= 3 || !!listing.videoUrl;

    const updated = await prisma.listing.update({
      where: { id: propertyId },
      data: {
        status: "LIVE",
        verified: autoVerified,
        verificationMode: autoVerified ? "AUTO" : "MANUAL",
        updatedAt: new Date(),
      },
    });

    return res.json({
      ok: true,
      status: updated.status,
      verified: updated.verified,
      verificationMode: updated.verificationMode,
    });
  } catch (error) {
    console.error("GO LIVE ERROR:", error);
    return res.status(500).json({
      ok: false,
      message: "Failed to go live",
    });
  }
}
