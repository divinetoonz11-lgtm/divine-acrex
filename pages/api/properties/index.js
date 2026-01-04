// pages/api/properties/index.js
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    /* ======================================================
       CREATE PROPERTY (USER / DEALER)
    ====================================================== */
    if (req.method === "POST") {
      const session = await getServerSession(req, res, authOptions);

      if (!session?.user?.email) {
        return res.status(401).json({ ok: false, message: "Unauthorized" });
      }

      const body = req.body || {};

      const listing = await prisma.listing.create({
        data: {
          ...body,

          /* 🔐 OWNER INFO */
          ownerId: session.user.id,
          ownerRole: session.user.role || "USER", // USER / DEALER

          /* 🔴 MAGICBRICKS STYLE DEFAULTS */
          status: "APPROVED",                 // LIVE
          verificationStatus: "UNVERIFIED",   // ❌ not verified
          verifiedSource: null,               // later: LIVE_PHOTO / ADMIN
          isLive: true,

          /* 🕒 TIMESTAMPS */
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return res.status(200).json({
        ok: true,
        message: "Property posted successfully (Unverified)",
        listingId: listing.id,
      });
    }

    /* ======================================================
       GET PROPERTIES
    ====================================================== */
    if (req.method === "GET") {
      const { userId, role } = req.query;

      /* 🌐 PUBLIC WEBSITE */
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

      /* 👤 USER / DEALER DASHBOARD */
      if (!userId) {
        return res.status(401).json([]);
      }

      const data = await prisma.listing.findMany({
        where: {
          ownerId: userId,
          isDeleted: false,
        },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json(data);
    }

    return res.status(405).json({ ok: false, message: "Method not allowed" });
  } catch (e) {
    console.error("PROPERTY API ERROR:", e);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}
