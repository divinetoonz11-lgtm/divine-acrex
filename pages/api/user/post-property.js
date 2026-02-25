// pages/api/user/post-property.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import clientPromise from "../../../lib/mongodb";

/*
USER (OWNER) POST PROPERTY – FINAL
✔ MongoDB only
✔ Max 2 free listings
✔ Admin approval required
✔ Dealer logic separated
*/

export default async function handler(req, res) {
  /* ================= METHOD ================= */
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  /* ================= AUTH ================= */
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }

  const email = session.user.email;
  const client = await clientPromise;
  const db = client.db();

  /* ================= USER CHECK ================= */
  const user = await db.collection("users").findOne({
    email,
    role: { $in: ["USER", "user"] },
    status: "active",
  });

  if (!user) {
    return res.status(403).json({
      ok: false,
      message: "Only property owners can post here",
    });
  }

  /* ================= FREE LIMIT (2) ================= */
  const used = await db.collection("properties").countDocuments({
    ownerEmail: email,
    ownerRole: "USER",
    isDeleted: { $ne: true },
  });

  if (used >= 2) {
    return res.status(403).json({
      ok: false,
      message: "Free owner limit reached (2 properties)",
      upgradeRequired: true,
    });
  }

  /* ================= VALIDATION ================= */
  const {
    title,
    propertyType,
    purpose,
    price,
    location,
    images,
    description,
  } = req.body || {};

  if (!title || !propertyType || !price || !location) {
    return res.status(400).json({
      ok: false,
      message: "Missing required fields",
    });
  }

  /* ================= CREATE PROPERTY ================= */
  const property = {
    ownerEmail: email,
    ownerRole: "USER",

    title,
    propertyType,
    purpose,
    price: Number(price),
    location,
    images: images || [],
    description: description || "",

    status: "pending",          // 🔒 admin approval
    isLive: false,
    verified: false,
    verificationMode: "MANUAL",

    contactLocked: true,        // owner privacy
    availability: true,
    isDeleted: false,

    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection("properties").insertOne(property);

  return res.json({
    ok: true,
    message: "Property submitted. Waiting for admin approval.",
    propertyId: result.insertedId,
  });
}
