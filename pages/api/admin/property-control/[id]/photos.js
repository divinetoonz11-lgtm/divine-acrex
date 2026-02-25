import clientPromise from "../../../../../lib/mongodb";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { ObjectId } from "mongodb";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ ok: false, message: "Property ID missing" });
    }

    const uploadDir = path.join(process.cwd(), "public/uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = new formidable.IncomingForm({
      uploadDir,
      keepExtensions: true,
      multiples: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB per photo
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Form parse error:", err);
        return res.status(500).json({ ok: false, message: "Upload failed" });
      }

      if (!files.photos) {
        return res.status(400).json({ ok: false, message: "No photos uploaded" });
      }

      const list = Array.isArray(files.photos)
        ? files.photos
        : [files.photos];

      const images = list.map((f) => {
        const filename = path.basename(f.filepath);
        return `/uploads/${filename}`;
      });

      const client = await clientPromise;

      await client
        .db()
        .collection("properties")
        .updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              images,
              photosCount: images.length,
              updatedAt: new Date(),
            },
          }
        );

      return res.json({ ok: true, images });

    });
  } catch (e) {
    console.error("Server error:", e);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}