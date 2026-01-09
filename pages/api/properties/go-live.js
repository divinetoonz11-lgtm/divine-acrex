import clientPromise from "../../../lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
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

  const { propertyId } = req.body || {};
  if (!propertyId) {
    return res.status(400).json({ ok: false, message: "Property id required" });
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
    return res.status(404).json({ ok: false, message: "Property not found" });
  }

  /* ================= AUTO VERIFY RULE =================
     ✔ 3 photos OR
     ✔ 1 video
     (Magicbricks logic)
  ===================================================== */
  const autoVerified =
    (property.photosCount || 0) >= 3 || !!property.videoName;

  /* ================= UPDATE ================= */
  await db.collection("properties").updateOne(
    { _id: property._id },
    {
      $set: {
        status: "LIVE",
        verified: autoVerified,
        verificationMode: autoVerified ? "AUTO" : "MANUAL",
        updatedAt: new Date(),
      },
    }
  );

  return res.json({
    ok: true,
    status: "LIVE",
    verified: autoVerified,
    verificationMode: autoVerified ? "AUTO" : "MANUAL",
  });
}
