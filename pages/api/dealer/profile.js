import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import clientPromise from "../../../lib/mongodb";

/*
DEALER PROFILE API (FINAL)
-------------------------
✔ Dealer only
✔ GET  -> fetch approved profile
✔ POST -> update editable fields
✔ Admin-approved data preserved
*/

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || session.user?.role !== "dealer") {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    const client = await clientPromise;
    const db = client.db();
    const profiles = db.collection("dealer_profiles");

    const email = session.user.email;

    /* ================= GET PROFILE ================= */
    if (req.method === "GET") {
      const profile = await profiles.findOne({ email });

      if (!profile) {
        return res.status(404).json({
          ok: false,
          message: "Dealer profile not found",
        });
      }

      return res.json({
        ok: true,
        profile,
      });
    }

    /* ================= UPDATE PROFILE ================= */
    if (req.method === "POST") {
      const {
        mobile,
        businessName,
        address,
        pan,
        gst,
        bio,
        photo,
      } = req.body || {};

      if (!mobile || mobile.length < 10) {
        return res.status(400).json({
          ok: false,
          message: "Valid mobile number is required",
        });
      }

      await profiles.updateOne(
        { email },
        {
          $set: {
            mobile,
            businessName: businessName || "",
            address: address || "",
            pan: pan || "",
            gst: gst || "",
            bio: bio || "",
            photo: photo || "",
            updatedAt: new Date(),
          },
        }
      );

      return res.json({
        ok: true,
        message: "Dealer profile updated successfully",
      });
    }

    return res.status(405).json({ ok: false, message: "Method not allowed" });
  } catch (err) {
    console.error("DEALER PROFILE API ERROR:", err);
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
}
