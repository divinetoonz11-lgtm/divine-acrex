// pages/api/dealer/post-property.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const FREE_LIMIT = 10;

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.email) {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  const email = session.user.email;

  // FIND DEALER
  const dealer = await prisma.user.findUnique({
    where: { email },
  });

  if (!dealer) {
    return res.status(404).json({ ok: false, message: "Dealer not found" });
  }

  // CHECK FREE LIMIT
  const totalListings = await prisma.listing.count({
    where: {
      ownerId: dealer.id,
      isDeleted: false,
    },
  });

  if (totalListings >= FREE_LIMIT) {
    return res.json({
      ok: false,
      message: "Free listing limit reached. Please upgrade plan.",
    });
  }

  const {
    title,
    propertyType,
    purpose,
    price,
    location,
    images,
    description,
  } = req.body;

  if (!title || !propertyType || !purpose || !price || !location) {
    return res.json({ ok: false, message: "Missing required fields" });
  }

  // CREATE LISTING (ADMIN APPROVAL REQUIRED)
  const listing = await prisma.listing.create({
    data: {
      ownerId: dealer.id,
      ownerRole: "DEALER",
      title,
      propertyType,
      purpose,
      price: Number(price),
      location,
      images: images || "",
      description: description || "",
      status: "PENDING", // 🔒 admin approval required
    },
  });

  return res.json({
    ok: true,
    message: "Property submitted. Waiting for admin approval.",
    listing,
  });
}
