// pages/api/properties/add-temp.js
import { PrismaClient } from "@prisma/client";
import cloudinary from "cloudinary";

const prisma = new PrismaClient();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    const {
      title,
      propertyType,
      purpose,
      price,
      location,
      images, // 👈 frontend se base64 images aayengi
    } = req.body;

    // 🔹 Step 1: Cloudinary upload
    const uploadedImages = [];

    for (const img of images) {
      const upload = await cloudinary.v2.uploader.upload(img, {
        folder: "divineacres/properties",
      });

      // ✅ YAHI SE REAL URL MILTA HAI
      uploadedImages.push(upload.secure_url);
    }

    // 🔹 Step 2: Prisma save (MongoDB)
    const p = await prisma.listing.create({
      data: {
        ownerId: "cmj4b67f30002u18ohui8tsev", // EXISTING USER
        ownerRole: "USER",
        title,
        propertyType,
        purpose,
        price,
        location,

        // ✅ REAL IMAGE URLs SAVE HONGI
        images: uploadedImages,

        status: "APPROVED",
      },
    });

    return res.json({ ok: true, p });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: String(e) });
  }
}
