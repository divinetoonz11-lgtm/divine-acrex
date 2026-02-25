import clientPromise from "../../../lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { ObjectId } from "mongodb";

/* ================== 413 FIX ================== */
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "25mb",
    },
  },
};
/* ============================================= */

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("divineacres");
    const col = db.collection("properties");

    /* =====================================================
       PUBLIC LISTING (NO LOGIN REQUIRED)
    ===================================================== */
    if (req.method === "GET" && req.query.role === "PUBLIC") {
      const page = Math.max(parseInt(req.query.page || "1", 10), 1);
      const limit = Math.min(
        Math.max(parseInt(req.query.limit || "10", 10), 1),
        50
      );

      const skip = (page - 1) * limit;

      const filter = {
        isDeleted: { $ne: true },
        status: { $in: ["live", "LIVE", "Live"] },
      };

      const [rows, total] = await Promise.all([
        col
          .find(filter)
          .sort({ createdAt: -1, _id: -1 })
          .skip(skip)
          .limit(limit)
          .toArray(),
        col.countDocuments(filter),
      ]);

      return res.status(200).json({
        ok: true,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        data: rows,
      });
    }

    /* =====================================================
       AUTH REQUIRED
    ===================================================== */
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.email) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    const userEmail = session.user.email;
    const role = session.user.role;

    /* ================= GET USER PROPERTIES ================= */
    if (req.method === "GET") {
      const rows = await col
        .find({
          $or: [{ ownerEmail: userEmail }, { dealerEmail: userEmail }],
          isDeleted: { $ne: true },
        })
        .sort({ createdAt: -1, _id: -1 })
        .toArray();

      return res.json({ ok: true, data: rows });
    }

    /* ================= CREATE PROPERTY ================= */
    if (req.method === "POST") {
      const userDoc = await db
        .collection("users")
        .findOne({ email: userEmail });

      const {
        title,
        listingFor,
        category,
        propertyType,
        furnishing,
        price,
        bhk,
        area,
        state,
        city,
        locality,
        society,
        floor,
        vastu,
        description,
        mobile,
        amenities,
        commercial,
        hotel,
        photos,     // old support
        images,     // new support
        videos,     // new support
      } = req.body;

      const finalImages = Array.isArray(images)
        ? images
        : Array.isArray(photos)
        ? photos
        : [];

      const finalVideos = Array.isArray(videos) ? videos : [];

      const newProperty = {
        title: title || "",

        postedBy: role === "dealer" ? "Dealer" : "Owner",

        listingFor,
        category,
        propertyType,
        furnishing,

        price: Number(price) || 0,
        bhk: bhk || "",
        area: Number(area) || 0,

        state,
        city,
        locality,
        society,
        floor,
        vastu,
        description,
        mobile,

        amenities: Array.isArray(amenities) ? amenities : [],
        commercial: commercial || null,
        hotel: hotel || null,

        // ✅ FIXED MEDIA SYSTEM
        images: finalImages,
        videos: finalVideos,
        photosCount: finalImages.length,

        status: "pending",
        availability: true,
        isDeleted: false,

        ownerEmail: role === "user" ? userEmail : null,
        dealerEmail: role === "dealer" ? userEmail : null,

        ownerName: role === "user" ? userDoc?.name || null : null,
        dealerName: role === "dealer" ? userDoc?.name || null : null,
        companyName: role === "dealer" ? userDoc?.company || null : null,

        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await col.insertOne(newProperty);

      return res.status(200).json({
        ok: true,
        message: "Property created successfully",
      });
    }

    /* ================= SOFT DELETE ================= */
    if (req.method === "DELETE") {
      const { propertyId } = req.body;

      if (!propertyId || !ObjectId.isValid(propertyId)) {
        return res.status(400).json({ ok: false });
      }

      await col.updateOne(
        {
          _id: new ObjectId(propertyId),
          $or: [{ ownerEmail: userEmail }, { dealerEmail: userEmail }],
        },
        {
          $set: {
            isDeleted: true,
            updatedAt: new Date(),
          },
        }
      );

      return res.json({ ok: true });
    }

    /* ================= SOLD / RENTED ================= */
    if (req.method === "PATCH") {
      const { propertyId, status } = req.body;

      if (!["sold", "rented"].includes(status)) {
        return res.status(400).json({ ok: false });
      }

      await col.updateOne(
        {
          _id: new ObjectId(propertyId),
          $or: [{ ownerEmail: userEmail }, { dealerEmail: userEmail }],
        },
        {
          $set: {
            status,
            availability: false,
            updatedAt: new Date(),
          },
        }
      );

      return res.json({ ok: true });
    }

    return res.status(405).json({
      ok: false,
      message: "Method not allowed",
    });

  } catch (err) {
    console.error("PROPERTIES API ERROR:", err);
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
}