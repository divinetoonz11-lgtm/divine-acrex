import clientPromise from "../../../lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

/*
FINAL RULE APPLIED:
- POST  → create property
- GET   → list LIVE properties
- Role property me store nahi
- Listing filter = status === "live" only
*/

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();

  /* ================= GET : PUBLIC LISTING ================= */
  if (req.method === "GET") {
    try {
      const items = await db
        .collection("properties")
        .find({
          status: "live",
          isDeleted: { $ne: true },
        })
        .sort({ createdAt: -1 })
        .toArray();

      return res.json({ ok: true, data: items });
    } catch (e) {
      console.error("PROPERTY LIST ERROR:", e);
      return res.status(500).json({ ok: false });
    }
  }

  /* ================= POST : CREATE PROPERTY ================= */
  if (req.method === "POST") {
    try {
      const session = await getServerSession(req, res, authOptions);
      if (!session || !session.user || !session.user.email) {
        return res.status(401).json({ ok: false, message: "Unauthorized" });
      }

      const b = req.body || {};
      if (!b.title || !b.category || !b.city || !b.price) {
        return res.status(400).json({ ok: false, message: "Missing fields" });
      }

      // 🔒 ROLE ONLY FROM USERS DB
      const role = (session.user.role || "").toLowerCase();
      const isDealer = role === "dealer";

      const property = {
        title: b.title,
        category: b.category,
        propertyType: b.propertyType || "",
        furnishing: b.furnishing || "",
        listingFor: b.listingFor || "",

        price: Number(b.price),
        area: Number(b.area || 0),
        bhk: b.bhk || "",

        state: b.state || "",
        city: b.city,
        locality: b.locality || "",
        society: b.society || "",

        floor: b.floor || "",
        vastu: b.vastu || "",
        description: b.description || "",
        amenities: Array.isArray(b.amenities) ? b.amenities : [],

        photosCount: Number(b.photosCount || 0),
        videoName: b.videoName || null,

        // 🔑 SINGLE SOURCE
        ownerEmail: isDealer ? null : session.user.email,
        ownerName: isDealer ? null : session.user.name || "",

        dealerEmail: isDealer ? session.user.email : null,
        dealerName: isDealer ? session.user.name || "" : null,

        // 🔑 ADMIN FLOW
        status: "pending",
        isDeleted: false,

        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await db.collection("properties").insertOne(property);

      return res.status(200).json({
        ok: true,
        id: result.insertedId,
      });
    } catch (err) {
      console.error("PROPERTY SAVE ERROR:", err);
      return res.status(500).json({ ok: false });
    }
  }

  return res.status(405).json({ ok: false });
}
