// pages/api/admin/enquiries/index.js

import dbConnect from "../../../../utils/dbConnect";
import Enquiry from "../../../../models/Enquiry";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

const ADMIN_EMAILS = [
  "inder.ambalika@gmail.com",
  "divinetoonz11@gmail.com",
];

export default async function handler(req, res) {
  try {
    // ONLY GET
    if (req.method !== "GET") {
      return res.status(405).json({ ok: false, message: "Method not allowed" });
    }

    // ADMIN AUTH
    const session = await getServerSession(req, res, authOptions);
    if (!session || !ADMIN_EMAILS.includes(session.user?.email)) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    await dbConnect();

    // PAGINATION
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "20", 10);
    const skip = (page - 1) * limit;

    // FILTERS
    const status = (req.query.status || "all").toLowerCase();
    const ownerType = (req.query.ownerType || "all").toLowerCase();

    const query = {};

    if (status !== "all") {
      query.status = status; // new | responded | closed | spam
    }

    if (ownerType !== "all") {
      query.ownerType = ownerType; // user | dealer
    }

    // DB QUERY
    const [items, total] = await Promise.all([
      Enquiry.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Enquiry.countDocuments(query),
    ]);

    return res.status(200).json({
      ok: true,
      page,
      limit,
      total,
      items,
    });
  } catch (err) {
    console.error("ADMIN ENQUIRIES API ERROR:", err);
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
}
