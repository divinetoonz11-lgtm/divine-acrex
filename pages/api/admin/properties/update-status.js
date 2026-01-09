// pages/api/admin/properties/update-status.js

import dbConnect from "../../../../utils/dbConnect";
import Property from "../../../../models/Property";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

/*
✔ REAL DB (mongoose)
✔ SAFE admin auth (server-side)
✔ NO React hooks
✔ Approve / Block works
*/

const ADMIN_EMAILS = [
  "inder.ambalika@gmail.com",
  "divinetoonz11@gmail.com",
];

export default async function handler(req, res) {
  try {
    /* ================= METHOD CHECK ================= */
    if (req.method !== "PUT") {
      return res.status(405).json({
        ok: false,
        message: "Only PUT allowed",
      });
    }

    /* ================= ADMIN AUTH (SAFE) ================= */
    const session = await getServerSession(req, res, authOptions);
    if (!session || !ADMIN_EMAILS.includes(session.user?.email)) {
      return res.status(401).json({
        ok: false,
        message: "Unauthorized",
      });
    }

    /* ================= DB CONNECT ================= */
    await dbConnect();

    const { id, status } = req.body;

    if (!id || !status) {
      return res.status(400).json({
        ok: false,
        message: "id or status missing",
      });
    }

    const nextStatus = status.toLowerCase(); // pending | live | blocked

    if (!["pending", "live", "blocked"].includes(nextStatus)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid status value",
      });
    }

    /* ================= UPDATE PROPERTY ================= */
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        ok: false,
        message: "Property not found",
      });
    }

    property.status = nextStatus;
    property.updatedAt = new Date();

    await property.save();

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      ok: true,
      property,
    });

  } catch (error) {
    console.error("UPDATE STATUS API ERROR:", error);
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
}
