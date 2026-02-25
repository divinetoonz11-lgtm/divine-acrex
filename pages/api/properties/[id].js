import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  try {
    const { id } = req.query;

    /* ================= VALIDATE ID ================= */
    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid Property ID",
      });
    }

    const client = await clientPromise;
    const db = client.db("divineacres");
    const col = db.collection("properties");

    /* ======================================================
       GET SINGLE PROPERTY
    ====================================================== */
    if (req.method === "GET") {
      const property = await col.findOne({
        _id: new ObjectId(id),
        isDeleted: { $ne: true },
      });

      if (!property) {
        return res.status(404).json({
          ok: false,
          message: "Property not found",
        });
      }

      return res.status(200).json({
        ok: true,
        data: property,
      });
    }

    /* ======================================================
       UPDATE PROPERTY (PUT)
    ====================================================== */
    if (req.method === "PUT") {
      const session = await getServerSession(req, res, authOptions);

      if (!session?.user?.email) {
        return res.status(401).json({
          ok: false,
          message: "Unauthorized",
        });
      }

      const property = await col.findOne({
        _id: new ObjectId(id),
      });

      if (!property || property.isDeleted) {
        return res.status(404).json({
          ok: false,
          message: "Property not found",
        });
      }

      /* ================= PERMISSION ================= */
      const isAdmin = session.user.role === "admin";

      const isOwner =
        property.ownerEmail === session.user.email ||
        property.dealerEmail === session.user.email;

      if (!isAdmin && !isOwner) {
        return res.status(403).json({
          ok: false,
          message: "Permission denied",
        });
      }

      /* ================= SAFE UPDATE FIELDS ================= */

      const allowedFields = [
        "title",
        "postedBy",
        "listingFor",
        "category",
        "propertyType",
        "furnishing",
        "price",
        "bhk",
        "area",
        "state",
        "city",
        "locality",
        "society",
        "floor",
        "vastu",
        "description",
        "mobile",
        "amenities",
        "commercial",
        "hotel",
        "images",
        "videos",
      ];

      let updateData = {};

      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      });

      /* ================= TYPE SAFETY ================= */

      if (updateData.price !== undefined) {
        updateData.price = Number(updateData.price);
      }

      if (updateData.area !== undefined) {
        updateData.area = Number(updateData.area);
      }

      /* ================= MEDIA HANDLING ================= */

      if (Array.isArray(req.body.images)) {
        updateData.images = req.body.images;
        updateData.photosCount = req.body.images.length;
      }

      if (Array.isArray(req.body.videos)) {
        updateData.videos = req.body.videos;
      }

      /* ================= PROTECTION ================= */

      delete updateData._id;
      delete updateData.ownerEmail;
      delete updateData.dealerEmail;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          ok: false,
          message: "No valid fields provided for update",
        });
      }

      /* ================= ENTERPRISE LOGIC ================= */

      updateData.updatedAt = new Date();
      updateData.lastEditedBy = session.user.email;
      updateData.lastEditedRole = session.user.role;

      if (!isAdmin) {
        updateData.status = "pending";
      }

      await col.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      return res.status(200).json({
        ok: true,
        message: "Property updated successfully",
      });
    }

    /* ======================================================
       DELETE PROPERTY (SOFT DELETE)
    ====================================================== */
    if (req.method === "DELETE") {
      const session = await getServerSession(req, res, authOptions);

      if (!session?.user?.email) {
        return res.status(401).json({
          ok: false,
          message: "Unauthorized",
        });
      }

      const property = await col.findOne({
        _id: new ObjectId(id),
      });

      if (!property || property.isDeleted) {
        return res.status(404).json({
          ok: false,
          message: "Property not found",
        });
      }

      const isAdmin = session.user.role === "admin";

      const isOwner =
        property.ownerEmail === session.user.email ||
        property.dealerEmail === session.user.email;

      if (!isAdmin && !isOwner) {
        return res.status(403).json({
          ok: false,
          message: "Permission denied",
        });
      }

      await col.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            isDeleted: true,
            deletedAt: new Date(),
            deletedBy: session.user.email,
          },
        }
      );

      return res.status(200).json({
        ok: true,
        message: "Property deleted successfully",
      });
    }

    return res.status(405).json({
      ok: false,
      message: "Method not allowed",
    });

  } catch (err) {
    console.error("PROPERTY ID API ERROR:", err);

    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
}