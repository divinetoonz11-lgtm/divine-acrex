import crypto from "crypto";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import clientPromise from "../../../../lib/mongodb";
import { sendMail } from "../../../../lib/mailer";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    /* ================= ADMIN AUTH ================= */
    const session = await getServerSession(req, res, authOptions);
    if (!session || session.user?.role !== "admin") {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    const { requestId } = req.body;
    if (!requestId) {
      return res.status(400).json({ ok: false, message: "requestId required" });
    }

    const client = await clientPromise;
    const db = client.db();

    const dealerRequests = db.collection("dealer_requests");
    const users = db.collection("users");
    const dealerProfiles = db.collection("dealer_profiles");
    const properties = db.collection("properties");

    const _id = new ObjectId(requestId);

    /* ================= FETCH REQUEST ================= */
    const reqDoc = await dealerRequests.findOne({ _id, status: "pending" });
    if (!reqDoc) {
      return res.status(404).json({
        ok: false,
        message: "Pending dealer request not found",
      });
    }

    /* ================= TOKEN ================= */
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    /* ================= APPROVE REQUEST ================= */
    await dealerRequests.updateOne(
      { _id },
      {
        $set: {
          status: "approved",
          approvedBy: session.user.email,
          approvedAt: new Date(),
        },
      }
    );

    /* ================= USER UPSERT ================= */
    const existingUser = await users.findOne({ email: reqDoc.email });

    const userUpdate = {
      email: reqDoc.email,
      role: "dealer",
      dealerApproved: true,
      dealerProfileCompleted: true,
      updatedAt: new Date(),
    };

    if (reqDoc.name && !existingUser?.name) userUpdate.name = reqDoc.name;
    if (reqDoc.mobile && !existingUser?.mobile) userUpdate.mobile = reqDoc.mobile;
    if (reqDoc.companyName && !existingUser?.companyName)
      userUpdate.companyName = reqDoc.companyName;

    if (!existingUser?.image && reqDoc.image) {
      userUpdate.image = reqDoc.image;
    }

    if (!existingUser?.passwordSet) {
      userUpdate.passwordSet = false;
      userUpdate.setupToken = tokenHash;
      userUpdate.setupTokenExpires = tokenExpiry;
    }

    await users.updateOne(
      { email: reqDoc.email },
      { $set: userUpdate, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );

    /* ================= 🔒 DEALER PROFILE AUTO-CREATE & LOCK ================= */
    await dealerProfiles.updateOne(
      { email: reqDoc.email },
      {
        $set: {
          name: reqDoc.name || "",
          email: reqDoc.email,
          mobile: reqDoc.mobile || "",
          businessName: reqDoc.companyName || "",
          address: reqDoc.address || "",
          pan: reqDoc.pan || "",
          gst: reqDoc.gst || "",
          profileCompleted: true,
          profileLocked: true, // 🔒 HARD LOCK
          approvedAt: new Date(),
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );

    /* ================= PROPERTY SYNC ================= */
    await properties.updateMany(
      { dealerRequestId: _id },
      {
        $set: {
          dealerEmail: reqDoc.email,
          updatedAt: new Date(),
        },
      }
    );

    /* ================= EMAIL ================= */
    const setupUrl = `${process.env.NEXTAUTH_URL}/set-username-password?token=${rawToken}`;

    await sendMail({
      to: reqDoc.email,
      subject: "Dealer Approved – Set Username & Password",
      html: `
        <h2>Congratulations 🎉</h2>
        <p>Your Dealer account has been approved.</p>
        <p>Click below to set your username & password:</p>
        <a href="${setupUrl}">Set Username & Password</a>
        <p>This link is valid for 24 hours.</p>
      `,
    });

    return res.json({
      ok: true,
      message: "Dealer approved & profile locked successfully",
    });
  } catch (err) {
    console.error("APPROVE DEALER ERROR:", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}
