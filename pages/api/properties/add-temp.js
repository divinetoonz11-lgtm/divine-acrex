// pages/api/properties/add-temp.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const p = await prisma.listing.create({
      data: {
        ownerId: "cmj4b67f30002u18ohui8tsev", // EXISTING USER
        ownerRole: "USER",
        title: "Test Property",
        propertyType: "Apartment",
        purpose: "Sell",
        price: 5000000,
        location: "Mumbai",
        images: "img1.jpg",
        status: "APPROVED",
      },
    });

    return res.json({ ok: true, p });
  } catch (e) {
    return res.status(500).json({ ok: false, e: String(e) });
  }
}
