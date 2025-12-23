// pages/api/dealer/listings.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.email) {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }

  const email = session.user.email;

  // ===== FIND DEALER =====
  const dealer = await prisma.user.findUnique({
    where: { email },
  });

  if (!dealer) {
    return res.status(200).json({ ok: true, data: [] });
  }

  /* =====================================================
     GET → My Properties (LIST)
  ===================================================== */
  if (req.method === "GET") {
    const listings = await prisma.listing.findMany({
      where: {
        ownerId: dealer.id,
        isDeleted: false,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      ok: true,
      data: listings, // ✅ My Properties page yahi expect karta hai
    });
  }

  /* =====================================================
     DELETE → Delete Property
     /api/dealer/listings?id=PROPERTY_ID
  ===================================================== */
  if (req.method === "DELETE") {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ ok: false, message: "Property id required" });
    }

    // Ownership check
    const listing = await prisma.listing.findFirst({
      where: {
        id,
        ownerId: dealer.id,
      },
    });

    if (!listing) {
      return res.status(404).json({ ok: false, message: "Property not found" });
    }

    await prisma.listing.update({
      where: { id },
      data: { isDeleted: true },
    });

    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ ok: false });
}
