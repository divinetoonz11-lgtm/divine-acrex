import clientPromise from "../../../lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { ObjectId } from "mongodb";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "25mb",
    },
  },
};

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("divineacres");
    const col = db.collection("properties");

    /* =====================================================
       PUBLIC LISTING (FILTER ENABLED)
    ===================================================== */
    if (req.method === "GET" && req.query.role === "PUBLIC") {

      const page = Math.max(parseInt(req.query.page || "1", 10), 1);
      const limit = Math.min(
        Math.max(parseInt(req.query.limit || "12", 10), 1),
        50
      );

      const skip = (page - 1) * limit;

      const {
        category,
        transaction,
        propertyType,
        bedrooms,
        budgetMin,
        budgetMax,
        areaMin,
        areaMax,
        amenities,
        search
      } = req.query;

      let filter = {
        isDeleted: { $ne: true },
        status: { $in: ["live", "LIVE", "Live"] },
      };

      /* ========= CATEGORY (CASE INSENSITIVE) ========= */
      if (category) {
        filter.category = {
          $regex: `^${category}$`,
          $options: "i"
        };
      }

      /* ========= TRANSACTION (BUY SHOULD MATCH SELL) ========= */
      if (transaction) {

        const t = transaction.toLowerCase();

        if (t === "buy") {
          filter.listingFor = {
            $regex: "buy|sell",
            $options: "i"
          };
        }

        else if (t === "rent") {
          filter.listingFor = {
            $regex: "^rent$",
            $options: "i"
          };
        }

        else if (t === "lease") {
          filter.listingFor = {
            $regex: "^lease$",
            $options: "i"
          };
        }
      }

      /* ========= PROPERTY TYPE ========= */
      if (propertyType) {
        filter.propertyType = {
          $regex: `^${propertyType}$`,
          $options: "i"
        };
      }

      /* ========= BEDROOMS ========= */
      if (bedrooms) {
        filter.bhk = bedrooms;
      }

      /* ========= BUDGET RANGE ========= */
      if (budgetMin || budgetMax) {
        filter.price = {};
        if (budgetMin) filter.price.$gte = Number(budgetMin);
        if (budgetMax) filter.price.$lte = Number(budgetMax);
      }

      /* ========= AREA RANGE ========= */
      if (areaMin || areaMax) {
        filter.area = {};
        if (areaMin) filter.area.$gte = Number(areaMin);
        if (areaMax) filter.area.$lte = Number(areaMax);
      }

      /* ========= AMENITIES ========= */
      if (amenities) {
        const arr = amenities.split(",");
        filter.amenities = { $all: arr };
      }

      /* ========= SMART SEARCH ========= */
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: "i" } },
          { city: { $regex: search, $options: "i" } },
          { locality: { $regex: search, $options: "i" } },
          { propertyType: { $regex: search, $options: "i" } }
        ];
      }

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
        photos,
        images,
        videos,
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