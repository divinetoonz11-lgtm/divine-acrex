import clientPromise from "../../../lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  try {
    /* ================= AUTH ================= */
    const session = await getServerSession(req, res, authOptions);

    if (!session || session.user.role !== "dealer") {
      return res.status(401).json({
        ok: false,
        message: "Unauthorized",
      });
    }

    const dealerEmail = session.user.email;

    const client = await clientPromise;

    /* 🔥 SINGLE DATABASE SOURCE (IMPORTANT) */
    const db = client.db(); 
    const col = db.collection("properties");

    /* ================= GET MY PROPERTIES ================= */
    if (req.method === "GET") {
      const rows = await col
        .find({
          dealerEmail: dealerEmail,
          isDeleted: { $ne: true },
        })
        .sort({ createdAt: -1 })
        .toArray();

      return res.status(200).json({
        ok: true,
        count: rows.length,
        data: rows,
      });
    }

    /* ================= DELETE (SOFT DELETE) ================= */
    if (req.method === "DELETE") {
      const { propertyId } = req.body;

      if (!propertyId || !ObjectId.isValid(propertyId)) {
        return res.status(400).json({
          ok: false,
          message: "Invalid Property ID",
        });
      }

      const result = await col.updateOne(
        {
          _id: new ObjectId(propertyId),
          dealerEmail: dealerEmail,
        },
        {
          $set: {
            isDeleted: true,
            updatedAt: new Date(),
          },
        }
      );

      return res.status(200).json({
        ok: true,
        modified: result.modifiedCount,
      });
    }

    /* ================= SOLD / RENTED ================= */
    if (req.method === "PATCH") {
      const { propertyId, status } = req.body;

      if (!propertyId || !ObjectId.isValid(propertyId)) {
        return res.status(400).json({
          ok: false,
          message: "Invalid Property ID",
        });
      }

      if (!["sold", "rented", "active"].includes(status)) {
        return res.status(400).json({
          ok: false,
          message: "Invalid Status",
        });
      }

      const result = await col.updateOne(
        {
          _id: new ObjectId(propertyId),
          dealerEmail: dealerEmail,
        },
        {
          $set: {
            status: status,
            availability: status === "active",
            updatedAt: new Date(),
          },
        }
      );

      return res.status(200).json({
        ok: true,
        modified: result.modifiedCount,
      });
    }

    /* ================= METHOD NOT ALLOWED ================= */
    return res.status(405).json({
      ok: false,
      message: "Method Not Allowed",
    });

  } catch (error) {
    console.error("DEALER MY LISTINGS ERROR:", error);

    return res.status(500).json({
      ok: false,
      message: "Server Error",
    });
  }
}
