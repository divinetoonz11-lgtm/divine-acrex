import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.email) {
    return res.status(401).json({ ok: false });
  }

  const { id } = req.query;

  // ===== OWNERSHIP CHECK =====
  const dealer = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!dealer) return res.status(403).json({ ok: false });

  const listing = await prisma.listing.findFirst({
    where: { id, ownerId: dealer.id, isDeleted: false },
  });
  if (!listing) return res.status(404).json({ ok: false });

  // ===== GET (Prefill Edit Form) =====
  if (req.method === "GET") {
    return res.status(200).json({ ok: true, data: listing });
  }

  // ===== PUT (Update Property) =====
  if (req.method === "PUT") {
    const data = req.body;

    const updated = await prisma.listing.update({
      where: { id },
      data: {
        title: data.title,
        location: data.location,
        price: data.price,
        images: data.images,
        status: "PENDING", // admin re-approval
      },
    });

    return res.status(200).json({ ok: true, data: updated });
  }

  // ===== DELETE (Soft delete) =====
  if (req.method === "DELETE") {
    await prisma.listing.update({
      where: { id },
      data: { isDeleted: true },
    });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ ok: false });
}
