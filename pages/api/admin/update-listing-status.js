import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  // ✅ ONLY POST ALLOWED
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      success: false,
      enabled: false,
      message: "Method not allowed",
    });
  }

  try {
    // ✅ SESSION + ADMIN CHECK
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user || session.user.role !== "admin") {
      return res.status(401).json({
        ok: false,
        success: false,
        enabled: false,
        message: "Unauthorized",
      });
    }

    const { propertyId } = req.body;

    if (!propertyId) {
      return res.status(400).json({
        ok: false,
        success: false,
        enabled: false,
        message: "Property ID missing",
      });
    }

    const client = await clientPromise;
    const db = client.db();

    // ✅ UPDATE PROPERTY → LIVE + VERIFIED
    const result = await db.collection("properties").updateOne(
      { _id: new ObjectId(propertyId) },
      {
        $set: {
          status: "live",
          verificationStatus: "VERIFIED_LIVE",
          verified: true,
          verifiedAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    // ✅ FRONTEND-FRIENDLY RESPONSE
    return res.status(200).json({
      ok: true,
      success: true,
      enabled: true,
      modified: result.modifiedCount,
      message: "Property verified successfully",
    });
  } catch (error) {
    console.error("PROPERTY VERIFY ERROR:", error);

    return res.status(500).json({
      ok: false,
      success: false,
      enabled: false,
      message: "Server error",
    });
  }
}
