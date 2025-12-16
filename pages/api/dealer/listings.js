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

  // FIND DEALER
  const dealer = await prisma.user.findUnique({
    where: { email },
  });

  if (!dealer) {
    return res.json({ ok: true, listings: [] });
  }

  // -------- GET DEALER LISTINGS --------
  if (req.method === "GET") {
    const listings = await prisma.listing.findMany({
      where: {
        ownerId: dealer.id,
        isDeleted: false,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      ok: true,
      total: listings.length,
      pending: listings.filter(l => l.status === "PENDING").length,
      approved: listings.filter(l => l.status === "APPROVED").length,
      rejected: listings.filter(l => l.status === "REJECTED").length,
      listings,
    });
  }

  res.status(405).json({ ok: false });
}
