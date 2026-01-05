import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false });
    }

    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.email) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    const body = req.body || {};

    // ✅ SAFE CREATE (NO FRONTEND TRUST)
    const listing = await prisma.listing.create({
      data: {
        title: body.propertyType || "Property",
        category: body.category || "residential",
        propertyType: body.propertyType || "",
        furnishing: body.furnishing || null,

        price: Number(body.price || 0),
        area: Number(body.area || 0),

        state: body.state || "",
        city: body.city || "",
        locality: body.locality || "",
        society: body.society || "",

        floor: body.floor || "",
        vastu: body.vastu || "",
        description: body.description || "",
        mobile: body.mobile || "",

        amenities: body.amenities || [],

        // 🔑 IMPORTANT FIX
        ownerEmail: session.user.email,
        ownerRole: session.user.role || "USER",

        // 🔥 MAGICBRICKS STYLE FLOW
        status: "APPROVED",               // LIVE
        verificationStatus: "UNVERIFIED", // NOT VERIFIED
        verifiedSource: null,
      },
    });

    return res.status(200).json({
      ok: true,
      message: "Property posted successfully (Unverified)",
      listingId: listing.id,
    });
  } catch (error) {
    console.error("PROPERTY CREATE ERROR:", error);
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
}
