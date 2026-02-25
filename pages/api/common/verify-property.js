import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  /* ================= AUTH ================= */
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }

  const { propertyId, source, gps, photo } = req.body;

  if (!propertyId || !source) {
    return res.status(400).json({
      ok: false,
      message: "Missing propertyId or source",
    });
  }

  const client = await clientPromise;
  const db = client.db();

  /* ================= FIND PROPERTY ================= */
  const property = await db.collection("properties").findOne({
    _id: new ObjectId(propertyId),
    ownerEmail: session.user.email,
    isDeleted: { $ne: true },
  });

  if (!property) {
    return res.status(404).json({
      ok: false,
      message: "Property not found",
    });
  }

  /* ================= LIVE PHOTO CHECK ================= */
  if (!photo || typeof photo !== "string") {
    return res.json({
      ok: true,
      verified: false,
      verificationMode: "MANUAL",
      verificationReason: "Live camera photo missing",
    });
  }

  /* ================= GPS CHECK ================= */
  if (
    !gps ||
    typeof gps.lat !== "number" ||
    typeof gps.lng !== "number"
  ) {
    return res.json({
      ok: true,
      verified: false,
      verificationMode: "MANUAL",
      verificationReason: "GPS location missing",
    });
  }

  /* ================= SOURCE CHECK ================= */
  if (source !== "LIVE_CAMERA") {
    return res.json({
      ok: true,
      verified: false,
      verificationMode: "MANUAL",
      verificationReason: "Not captured from live camera",
    });
  }

  /* ================= VERIFIED ================= */
  await db.collection("properties").updateOne(
    { _id: property._id },
    {
      $set: {
        verified: true,
        verificationStatus: "VERIFIED_LIVE",
        verificationMode: "LIVE_CAMERA",
        verificationReason: "Live camera + GPS verified",
        verificationPhoto: photo,     // 🔥 PROOF
        verificationGps: gps,         // 🔥 PROOF
        verifiedAt: new Date(),
        updatedAt: new Date(),
      },
    }
  );

  return res.json({
    ok: true,
    verified: true,
    verificationMode: "LIVE_CAMERA",
    verificationReason: "Property verified using live camera & GPS",
  });
}
