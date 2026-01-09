import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    /* ================= AUTH ================= */
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    /* ================= USER FROM DB ================= */
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        role: true,        // USER | DEALER
        name: true,
        mobile: true,
        email: true,
        companyName: true, // dealer case
      },
    });

    if (!user) {
      return res.status(401).json({ ok: false, message: "User not found" });
    }

    const role = user.role; // 🔥 FINAL ROLE (DB truth)

    /* ================= PAYLOAD ================= */
    const {
      title,
      propertyType,
      purpose,
      price,
      location,
      images,
    } = req.body;

    if (!title || !propertyType || !price || !location) {
      return res.status(400).json({
        ok: false,
        message: "Missing required fields",
      });
    }

    /* ================= USER FREE LIMIT ================= */
    if (role === "USER") {
      const count = await prisma.listing.count({
        where: {
          ownerId: user.id,
          ownerRole: "USER",
          isDeleted: false,
        },
      });

      if (count >= 2) {
        return res.json({
          ok: false,
          message: "Free owner listing limit reached (2)",
        });
      }
    }

    /* ================= CREATE LISTING ================= */
    const listing = await prisma.listing.create({
      data: {
        ownerId: user.id,
        ownerRole: role,                 // USER | DEALER
        title,
        propertyType,
        purpose,
        price: Number(price),
        location,
        images: images || "",

        status: "PENDING",               // admin approval
        adminApproved: role === "DEALER",// dealer auto-live (configurable)
        verifiedStatus: "UNVERIFIED",

        contactLocked: role === "USER",  // owner contact locked

        // snapshot (future safety)
        ownerName: user.name,
        ownerEmail: user.email,
        ownerMobile: user.mobile,
        dealerCompany: role === "DEALER" ? user.companyName : null,
      },
    });

    return res.json({ ok: true, listing });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
}
