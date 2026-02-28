import { v2 as cloudinary } from "cloudinary";
import clientPromise from "../../../lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

/* ================= CLOUDINARY CONFIG ================= */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.email) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    const { photo } = req.body;

    if (!photo) {
      return res.status(400).json({ ok: false, message: "No photo provided" });
    }

    /* ===== Upload to Cloudinary ===== */

    const uploadResponse = await cloudinary.uploader.upload(photo, {
      folder: "divineacres/profile",
      width: 300,
      height: 300,
      crop: "fill",
    });

    const imageUrl = uploadResponse.secure_url;

    /* ===== Save URL in MongoDB ===== */

    const client = await clientPromise;
    const db = client.db("divineacres");

    await db.collection("users").updateOne(
      { email: session.user.email },
      { $set: { image: imageUrl } }
    );

    return res.status(200).json({
      ok: true,
      image: imageUrl,
    });

  } catch (error) {
    console.error("CLOUDINARY ERROR:", error);
    return res.status(500).json({ ok: false, message: "Upload failed" });
  }
}