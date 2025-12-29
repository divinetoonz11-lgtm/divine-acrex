import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import clientPromise from "../../../lib/mongodb";

/*
DEALER REGISTRATION REQUEST API
--------------------------------
✔ Only logged-in users
✔ Dealer role NOT auto assigned
✔ Status = pending
✔ Admin approval required
✔ Prevent duplicate requests
*/

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

    // 🔒 If already dealer → block
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
      city,
      experience,
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

    // 📝 Save dealer request (NO role change)
    await dealerRequests.insertOne({
      email,
      name,
      mobile,
      company,
      dealerType,
      city,
      experience,
      idProofType,
      addressProofType,
      documentUploaded: false, // file handled separately if needed
      status: "pending",
      createdAt: new Date(),
    });

    return res.json({
      ok: true,
      status: "pending",
      message: "Dealer request submitted successfully",
    });
  } catch (err) {
    console.error("DEALER REQUEST ERROR:", err);
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
}
