import clientPromise from "../../../lib/mongodb";

/*
PUBLIC DEALER REQUEST API – FINAL (ADMIN DOC PREVIEW FIXED)
----------------------------------------------------------
✔ Public form (no login)
✔ Existing user update OR new insert
✔ Referral program scalable
✔ Documents saved in admin-compatible format
✔ Dealer Requests visible
*/

const COMPANY_DEFAULT_REFERRAL = "DIVINE-ACRES";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    /* =========================
       SAFE FORM DATA
    ========================= */
    const body = req.body || {};

    const name = body.name?.trim();
    const email = body.email?.toLowerCase()?.trim();
    const mobile = body.mobile?.trim();
    const dealerType = body.dealerType?.trim();
    const agreed = body.agreed === true;

    if (!name || !email || !mobile || !dealerType || !agreed) {
      return res.status(400).json({
        ok: false,
        message: "Required fields missing",
      });
    }

    /* =========================
       REFERRAL (REPEATABLE)
    ========================= */
    const referredBy =
      body.referralCode?.trim() || COMPANY_DEFAULT_REFERRAL;

    /* =========================
       NORMALIZE DOCUMENTS
       (THIS FIXES ADMIN PREVIEW)
    ========================= */
    const normalizedDocs = {
      aadhaar:
        body.aadhaarUrl ||
        body.documents?.aadhaar ||
        "",
      pan:
        body.panUrl ||
        body.documents?.pan ||
        "",
      photo:
        body.photoUrl ||
        body.documents?.photo ||
        "",
      other:
        body.otherDocUrl ||
        body.documents?.other ||
        "",
    };

    /* =========================
       CHECK EXISTING USER
    ========================= */
    const existingUser = await users.findOne({ email });

    const payload = {
      name,
      mobile,
      dealerType,
      company: body.company || "",
      country: body.country || "",
      state: body.state || "",
      city: body.city || "",
      address: body.address || "",
      pincode: body.pincode || "",
      idProofType: body.idProofType || "",
      addressProofType: body.addressProofType || "",

      documents: normalizedDocs,   // ✅ FIXED
      referredBy,                  // ✅ repeat allowed

      role: "dealer",
      status: "pending",
      kycStatus: "pending",
      dealerRequestedAt: new Date(),
    };

    if (existingUser) {
      // UPDATE EXISTING USER
      await users.updateOne(
        { _id: existingUser._id },
        { $set: payload }
      );
    } else {
      // INSERT NEW USER
      await users.insertOne({
        email,
        ...payload,
        createdAt: new Date(),
      });
    }

    return res.json({
      ok: true,
      status: "pending",
      message:
        "Dealer application submitted successfully. Admin approval takes 24–48 hours.",
    });
  } catch (err) {
    console.error("DEALER REQUEST ERROR:", err);
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
}
