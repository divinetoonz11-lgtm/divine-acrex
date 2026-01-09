import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User";
import Dealer from "../../../models/Dealer";
import Property from "../../../models/Property";
import Enquiry from "../../../models/Enquiry";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const ADMIN_EMAILS = [
  "inder.ambalika@gmail.com",
  "divinetoonz11@gmail.com",
];

export default async function handler(req, res) {
  try {
    // ✅ METHOD
    if (req.method !== "GET") {
      return res.status(405).json({ ok: false });
    }

    // ✅ ADMIN AUTH
    const session = await getServerSession(req, res, authOptions);
    if (!session || !ADMIN_EMAILS.includes(session.user?.email)) {
      return res.status(401).json({ ok: false });
    }

    await dbConnect();

    const { type, from, to } = req.query;

    if (!type) {
      return res.status(400).json({ ok: false, message: "type missing" });
    }

    // ✅ DATE FILTER
    const dateQuery = {};
    if (from || to) {
      dateQuery.createdAt = {};
      if (from) dateQuery.createdAt.$gte = new Date(from);
      if (to) dateQuery.createdAt.$lte = new Date(to);
    }

    let rows = [];

    /* ================= DATA SOURCE ================= */
    if (type === "users") {
      rows = await User.find(dateQuery)
        .select("name email phone createdAt")
        .lean();
    }

    else if (type === "dealers") {
      rows = await Dealer.find(dateQuery)
        .select("name email phone status plan createdAt")
        .lean();
    }

    else if (type === "properties") {
      rows = await Property.find(dateQuery)
        .select("title city price status ownerType dealerId createdAt")
        .lean();
    }

    else if (type === "enquiries") {
      rows = await Enquiry.find(dateQuery)
        .select("name email phone propertyTitle message createdAt")
        .lean();
    }

    else {
      return res.status(400).json({ ok: false, message: "invalid type" });
    }

    /* ================= CSV BUILD ================= */
    if (rows.length === 0) {
      return res
        .status(200)
        .send("No data found");
    }

    const headers = Object.keys(rows[0]).join(",");

    const csvBody = rows
      .map(row =>
        Object.values(row)
          .map(v => `"${String(v ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const csv = `${headers}\n${csvBody}`;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${type}-report.csv`
    );

    return res.status(200).send(csv);

  } catch (err) {
    console.error("REPORTS API ERROR:", err);
    return res.status(500).json({ ok: false });
  }
}
