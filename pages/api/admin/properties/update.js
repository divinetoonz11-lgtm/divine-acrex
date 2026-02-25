import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({
      ok: false,
      message: "Method not allowed",
    });
  }

  try {
    const {
      id,
      title,
      city,
      price,
      description,
      images,
      videos,
    } = req.body;

    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({
        ok: false,
        message: "Valid Property ID required",
      });
    }

    const client = await clientPromise;
    const db = client.db("divineacres");
    const col = db.collection("properties");

    const existing = await col.findOne({
      _id: new ObjectId(id),
    });

    if (!existing || existing.isDeleted) {
      return res.status(404).json({
        ok: false,
        message: "Property not found",
      });
    }

    /* ================= SAFE MEDIA HANDLING ================= */

    // If frontend sends array → use it
    // If undefined → preserve existing
    const finalImages = Array.isArray(images)
      ? images
      : existing.images || [];

    const finalVideos = Array.isArray(videos)
      ? videos
      : existing.videos || [];

    /* ================= BUILD UPDATE ================= */

    const update = {
      title: title ?? existing.title,
      city: city ?? existing.city,
      price: price !== undefined ? Number(price) : existing.price,
      description: description ?? existing.description,

      images: finalImages,
      videos: finalVideos,
      photosCount: finalImages.length,

      updatedAt: new Date(),
      lastEditedBy: "admin",
      lastEditedRole: "admin",
    };

    /* ================= SAVE ================= */

    await col.updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    return res.status(200).json({
      ok: true,
      message: "Property updated successfully",
      images: finalImages,
      videos: finalVideos,
    });

  } catch (err) {
    console.error("ADMIN PROPERTY UPDATE ERROR:", err);

    return res.status(500).json({
      ok: false,
      message: "Update failed",
    });
  }
}