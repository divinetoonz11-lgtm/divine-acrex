// pages/api/dealer/post-property.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import clientPromise from "../../../lib/mongodb";

/*
DEALER POST PROPERTY – FINAL (LOCKED & SAME AS USER FLOW)
✔ Post Property form unchanged
✔ My Properties card reads same schema
✔ photos field (NOT images)
✔ postedBy = "dealer"
✔ Pending property MUST appear in Dealer → My Properties
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

  /* ================= DEALER CHECK ================= */
  const dealer = await db.collection("users").findOne({
    email,
    role: { $in: ["dealer", "DEALER"] },
    dealerApproved: true,
    status: "active",
  });

  if (!dealer) {
    return res.status(403).json({
      ok: false,
      message: "Dealer not approved",
    });
  }

  /* ================= SUBSCRIPTION ================= */
  const sub = dealer.subscription || { plan: "FREE" };

  let limit = 0;
  if (sub.plan === "FREE") limit = 10;
  else if (sub.plan === "STARTER") limit = 50;
  else if (sub.plan === "PRO") limit = 300;
  else if (sub.plan === "ELITE") limit = Infinity;

  if (
    sub.plan === "FREE" &&
    sub.expiresAt &&
    new Date(sub.expiresAt) < new Date()
  ) {
    return res.status(403).json({
      ok: false,
      message: "Free plan expired. Please upgrade to continue posting.",
      upgradeRequired: true,
    });
  }

  /* ================= COUNT USED LISTINGS ================= */
  const used = await db.collection("properties").countDocuments({
    dealerEmail: email,
    postedBy: "dealer",
    isDeleted: { $ne: true },
  });

  if (used >= limit) {
    return res.status(403).json({
      ok: false,
      message:
        sub.plan === "FREE"
          ? "Free plan allows only 10 listings. Please upgrade."
          : "Listing limit reached for your plan.",
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
    photos,                 // ✅ SAME AS USER
    description,
  } = req.body || {};

  if (!title || !propertyType || !purpose || !price || !location) {
    return res.json({ ok: false, message: "Missing required fields" });
  }

  /* ================= CREATE PROPERTY ================= */
  const property = {
    postedBy: "dealer",                 // 🔒 LOCKED
    dealerEmail: email,                 // 🔒 LOCKED

    title,
    propertyType,
    purpose,
    price: Number(price),
    location,

    photos: Array.isArray(photos) ? photos : [],   // ✅ MAIN FIX
    description: description || "",

    status: "pending",                  // admin approve se pehle bhi show
    isLive: false,

    verified: false,
    verificationMode: "MANUAL",

    availability: true,
    isDeleted: false,

    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection("properties").insertOne(property);

  /* ================= RESPONSE ================= */
  return res.json({
    ok: true,
    message: "Property submitted. Waiting for admin approval.",
    propertyId: result.insertedId,
  });
}
