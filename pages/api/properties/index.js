// pages/api/properties/index.js
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.email || !session?.user?.id) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    const b = req.body || {};

    const listing = await prisma.listing.create({
      data: {
        // 🔐 REQUIRED SAFE FIELDS
        title: b.propertyType || "Property",
        category: b.category || "residential",
        propertyType: b.propertyType || "Property",

        price: Number(b.price || 0),
        area: Number(b.area || 0),

        state: b.state || "",
        city: b.city || "",
        locality: b.locality || "",
        society: b.society || "",

        description: b.description || "",
        mobile: b.mobile || "",

        // ⚠️ IMPORTANT FIX
        amenities: JSON.stringify(b.amenities || []),

        // 🔑 OWNER (SAFE)
        ownerId: String(session.user.id),
        ownerRole: session.user.role === "dealer" ? "DEALER" : "USER",

        // 🔥 LIVE BUT UNVERIFIED
        status: "APPROVED",
        verificationStatus: "UNVERIFIED",
        verifiedSource: null,
      },
    });

    return res.status(200).json({
      ok: true,
      message: "Property posted (Live + Unverified)",
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
