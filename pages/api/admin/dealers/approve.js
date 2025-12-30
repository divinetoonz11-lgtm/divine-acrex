import dbConnect from "../../../../utils/dbConnect";
import Dealer from "../../../../models/Dealer";
import User from "../../../../models/User";
import { sendMail } from "../../../../lib/mailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  const { dealerId } = req.body;

  if (!dealerId) {
    return res.status(400).json({
      success: false,
      message: "Dealer ID required",
    });
  }

  try {
    await dbConnect();

    /* =========================
       1️⃣ APPROVE DEALER RECORD
    ========================= */
    const dealer = await Dealer.findByIdAndUpdate(
      dealerId,
      { verifyStatus: "approved" },
      { new: true }
    );

    if (!dealer) {
      return res.status(404).json({
        success: false,
        message: "Dealer not found",
      });
    }

    /* =========================
       2️⃣ UPDATE USER ROLE → DEALER
    ========================= */
    await User.updateOne(
      { email: dealer.email },
      { $set: { role: "dealer" } }
    );

    /* =========================
       3️⃣ SEND APPROVAL EMAIL
    ========================= */
    await sendMail({
      to: dealer.email,
      subject: "Dealer Account Approved – Divine Acres",
      html: `
        <h2>Congratulations 🎉</h2>
        <p>Your dealer account on <b>Divine Acres</b> has been approved.</p>
        <p>Please login again to access your dealer dashboard.</p>
        <br/>
        <a 
          href="https://divineacres.in/dealer_login"
          style="display:inline-block;padding:10px 18px;background:#1e40af;color:#fff;text-decoration:none;border-radius:6px;"
        >
          Login to Dealer Dashboard
        </a>
        <br/><br/>
        <p>Regards,<br/>Divine Acres Team</p>
      `,
    });

    /* =========================
       4️⃣ FORCE RE-LOGIN SIGNAL
    ========================= */
    return res.json({
      success: true,
      forceRelogin: true,
      message: "Dealer approved, role updated & email sent",
    });
  } catch (error) {
    console.error("APPROVE DEALER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}
