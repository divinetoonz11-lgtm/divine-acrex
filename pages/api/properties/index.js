// pages/api/properties/index.js
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    /* ================== CREATE PROPERTY ================== */
    if (req.method === "POST") {
      const session = await getServerSession(req, res, authOptions);
      if (!session?.user?.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const body = req.body || {};

      const listing = await prisma.listing.create({
        data: {
          /* ===== OWNER ===== */
          ownerId: session.user.id,
          ownerRole: session.user.role === "dealer" ? "DEALER" : "USER",

          /* ===== BASIC ===== */
          title: body.title || "Property",
          category: body.category || "residential",
          propertyType: body.propertyType || null,
          furnishing: body.furnishing || null,

          /* ===== NUMBERS (SAFE) ===== */
          price: Number(body.price) || 0,
          area: Number(body.area) || 0,
          bhk: body.bhk || null,

          /* ===== LOCATION ===== */
          state: body.state || null,
          city: body.city || null,
          locality: body.locality || null,
          society: body.society || null,

          /* ===== CONTACT ===== */
          mobile: body.mobile || null,
          description: body.description || null,

          /* ===== ARRAYS ===== */
          amenities: Array.isArray(body.amenities) ? body.amenities : [],

          /* ===== COMMERCIAL / HOTEL ===== */
          commercial: body.commercial || null,
          hotel: body.hotel || null,

          /* ===== MEDIA META ===== */
          photosCount: Number(body.photosCount) || 0,
          videoName: body.videoName || null,

          /* ===== STATUS ===== */
          status: "APPROVED",                 // LIVE
          verificationStatus: "UNVERIFIED",   // Not verified yet
          verifiedSource: null,
          isDeleted: false,
        },
      });

      return res.status(200).json({
        ok: true,
        message: "Property posted successfully (Live + Unverified)",
        listingId: listing.id,
      });
    }

    /* ================== GET ================== */
    if (req.method === "GET") {
      const { userId, role } = req.query;

      if (role === "PUBLIC") {
        const data = await prisma.listing.findMany({
          where: {
            status: "APPROVED",
            isDeleted: false,
          },
          orderBy: { createdAt: "desc" },
        });
        return res.status(200).json(data);
      }

      if (!userId) return res.status(401).json([]);

      const data = await prisma.listing.findMany({
        where: { ownerId: userId, isDeleted: false },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json(data);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    console.error("PROPERTY CREATE ERROR:", e);
    return res.status(500).json({ error: "Server error" });
  }
}
