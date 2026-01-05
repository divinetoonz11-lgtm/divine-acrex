import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  /* ================= ONLY POST ================= */
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    /* ================= AUTH ================= */
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.email || !session?.user?.id) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    const b = req.body || {};

    /* ================= SAFE DATA ================= */
    const listing = await prisma.listing.create({
      data: {
        /* BASIC */
        title: b.propertyType || "Property",
        category: b.category || "residential",
        propertyType: b.propertyType || "Property",
        furnishing: b.furnishing || null,

        /* PRICE / AREA */
        price: Number(b.price || 0),
        area: Number(b.area || 0),

        /* LOCATION (🔥 MAIN FIX) */
        state: b.stateName || b.state || "",
        city: b.city || "",
        locality: b.locality || "",
        society: b.society || "",

        /* EXTRA */
        floor: b.floor || "",
        vastu: b.vastu || "",
        description: b.description || "",
        mobile: b.mobile || "",

        /* AMENITIES (SAFE FOR ANY SCHEMA) */
        amenities: Array.isArray(b.amenities)
          ? b.amenities.join(",")
          : "",

        /* OWNER (AUTO) */
        ownerId: String(session.user.id),
        ownerRole:
          session.user.role === "dealer" ||
          session.user.role === "DEALER"
            ? "DEALER"
            : "USER",

        /* 🔥 DEFAULT FLOW */
        status: "APPROVED",               // LIVE
        verificationStatus: "UNVERIFIED", // NOT VERIFIED
        verifiedSource: null,             // later: LIVE_PHOTO / VIDEO
      },
    });

    return res.status(200).json({
      ok: true,
      message: "Property posted successfully (Live + Unverified)",
      listingId: listing.id,
    });
  } catch (error) {
    console.error("PROPERTY CREATE ERROR:", error);

    return res.status(500).json({
      ok: false,
      message: "Property save failed",
      error: error.message,
    });
  }
}
