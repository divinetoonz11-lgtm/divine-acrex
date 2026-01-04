// pages/api/properties/index.js
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    /* ================= CREATE PROPERTY ================= */
    if (req.method === "POST") {
      const session = await getServerSession(req, res, authOptions);

      if (!session?.user?.email) {
        return res.status(401).json({ ok: false, message: "Unauthorized" });
      }

      const body = req.body || {};

      // 🔒 FORCE SAFE DATA (no trust on frontend)
      const data = {
        title: body.propertyType || "Property",
        category: body.category,
        propertyType: body.propertyType,
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

        // 🔑 OWNER AUTO
        ownerId: session.user.id,
        ownerRole: session.user.role, // USER / DEALER

        // 🔥 DEFAULT FLOW
        status: "APPROVED",                 // live
        verificationStatus: "UNVERIFIED",   // not verified
        verifiedSource: null,
      };

      const listing = await prisma.listing.create({ data });

      return res.status(200).json({
        ok: true,
        message: "Property posted successfully",
        listingId: listing.id,
      });
    }

    return res.status(405).json({ ok: false });
  } catch (error) {
    console.error("PROPERTY CREATE ERROR:", error);
    return res.status(500).json({
      ok: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
