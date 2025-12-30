import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import clientPromise from "../../../lib/mongodb";

/*
DEALER REGISTRATION REQUEST API (FINAL)
---------------------------------------
✔ Login required
✔ Dealer role NOT auto assigned
✔ Status = pending
✔ Admin approval required
✔ Duplicate request blocked
✔ Referral auto-assign if empty
*/

const COMPANY_DEFAULT_REFERRAL = "DIVINE-ACRES"; // 🔑 company referral code

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    // 🔐 Session check
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    const email = session.user.email;

    // 🗄️ DB connect
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");
    const dealerRequests = db.collection("dealer_requests");

    // 🔒 Already dealer
    const user = await users.findOne({ email });
    if (user?.role === "dealer") {
      return res.json({
        ok: true,
        alreadyDealer: true,
        message: "You are already a dealer",
      });
    }

    // 🔒 Prevent duplicate pending request
    const existingRequest = await dealerRequests.findOne({
      email,
      status: "pending",
    });

    if (existingRequest) {
      return res.json({
        ok: true,
        pending: true,
        message: "Dealer request already pending",
      });
    }

    // 📦 Extract form data
    const {
      name,
      mobile,
      company,
      dealerType,
      experience,
      referralCode,
      country,
      state,
      city,
      address,
      pincode,
      idProofType,
      addressProofType,
      agreed,
    } = req.body || {};

    if (!agreed) {
      return res.status(400).json({
        ok: false,
        message: "Terms not accepted",
      });
    }

    // 🔁 Referral logic (AUTO FALLBACK)
    const finalReferralCode =
      referralCode && referralCode.trim()
        ? referralCode.trim()
        : COMPANY_DEFAULT_REFERRAL;

    // 📝 Save dealer request (NO role change)
    await dealerRequests.insertOne({
      email,
      name,
      mobile,
      company,
      dealerType,
      experience,

      country,
      state,
      city,
      address,
      pincode,

      referralCode: finalReferralCode,

      idProofType,
      addressProofType,

      status: "pending",
      approvedBy: null,
      approvedAt: null,

      createdAt: new Date(),
    });

    return res.json({
      ok: true,
      status: "pending",
      referralUsed: finalReferralCode,
      message:
        "Dealer application submitted. Approval usually takes 24–48 business hours.",
    });
  } catch (err) {
    console.error("DEALER REQUEST ERROR:", err);
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
}
