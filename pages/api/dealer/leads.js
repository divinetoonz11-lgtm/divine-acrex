// pages/api/dealer/leads.js

import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import clientPromise from "../../../lib/mongodb";

/*
LEADS API – v1
✔ Property enquiry → Lead
✔ Dealer-wise leads
✔ MongoDB based
*/

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "dealer") {
    return res.status(401).json({ ok: false });
  }

  const client = await clientPromise;
  const db = client.db();
  const leadsCol = db.collection("leads");

  // ================= GET → Dealer Leads =================
  if (req.method === "GET") {
    const leads = await leadsCol
      .find({ dealerEmail: session.user.email })
      .sort({ createdAt: -1 })
      .toArray();

    return res.json({
      ok: true,
      leads,
    });
  }

  // ================= POST → Create Lead (from property enquiry) =================
  if (req.method === "POST") {
    const {
      propertyId,
      propertyTitle,
      buyerName,
      buyerPhone,
      buyerEmail,
    } = req.body;

    if (!propertyId || !buyerPhone) {
      return res.json({ ok: false, message: "Missing data" });
    }

    await leadsCol.insertOne({
      dealerEmail: session.user.email,
      propertyId,
      propertyTitle,
      buyerName: buyerName || "Unknown",
      buyerPhone,
      buyerEmail: buyerEmail || "",
      status: "NEW", // NEW | CONTACTED | CLOSED
      createdAt: new Date(),
    });

    return res.json({
      ok: true,
      message: "Lead saved",
    });
  }

  return res.status(405).json({ ok: false });
}
