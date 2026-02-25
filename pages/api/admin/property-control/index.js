import clientPromise from "../../../../lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session || session.user.role !== "admin") {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    const client = await clientPromise;
    const db = client.db();
    const col = db.collection("properties");

    /* ================= SINGLE PROPERTY MODE ================= */
    if (req.query.id) {
      const property = await col.findOne({
        _id: new ObjectId(req.query.id),
      });

      if (!property) {
        return res.status(404).json({
          ok: false,
          message: "Property not found",
        });
      }

      return res.status(200).json({
        ok: true,
        data: property, // 🔥 IMPORTANT
      });
    }

    /* ================= LIST MODE ================= */

    const page = Math.max(parseInt(req.query.page || "1"), 1);
    const limit = Math.min(parseInt(req.query.limit || "12"), 50);
    const skip = (page - 1) * limit;

    const { search = "", city = "", type = "" } = req.query;

    const query = {
      hidden: { $ne: true },
    };

    if (city) query.city = city;
    if (type) query.propertyType = type;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { propertyTitle: { $regex: search, $options: "i" } },
        { ownerEmail: { $regex: search, $options: "i" } },
        { dealerEmail: { $regex: search, $options: "i" } },
      ];
    }

    const [properties, total] = await Promise.all([
      col.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      col.countDocuments(query),
    ]);

    return res.status(200).json({
      ok: true,
      properties,
      totalPages: Math.ceil(total / limit),
      total,
      page,
    });

  } catch (err) {
    console.error("PROPERTY CONTROL API ERROR:", err);
    return res.status(500).json({
      ok: false,
      message: "Failed to load properties",
    });
  }
}
