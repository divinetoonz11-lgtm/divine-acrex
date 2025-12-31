import clientPromise from "../../../../lib/mongodb";
import adminGuard from "../../../../lib/adminGuard";
import { ObjectId } from "mongodb";
import crypto from "crypto";
import { sendMail } from "../../../../lib/mailer";

export default async function handler(req, res) {
  if (!(await adminGuard(req, res))) return;

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  const { id } = req.body;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ ok: false, message: "Invalid ID" });
  }

  try {
    const db = (await clientPromise).db();
    const users = db.collection("users");

    const user = await users.findOne({ _id: new ObjectId(id) });
    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    /* =========================
       🔑 CREATE SETUP TOKEN
    ========================= */
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          setupToken: tokenHash,
          setupTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
        },
      }
    );

    const link = `${process.env.NEXTAUTH_URL}/set-password?token=${rawToken}`;

    /* =========================
       📧 SEND MAIL (CENTRAL MAILER)
    ========================= */
    await sendMail({
      to: user.email,
      subject: "Activate your Dealer Account – Divine Acres",
      html: `
        <h3>Hello ${user.name || ""}</h3>
        <p>Your <b>Divine Acres Dealer account</b> has been approved.</p>

        <p>Please create your <b>username & password</b> using the link below:</p>

        <p>
          <a href="${link}"
             style="display:inline-block;padding:12px 18px;
                    background:#1e40af;color:#fff;
                    text-decoration:none;border-radius:6px;">
            Create Username & Password
          </a>
        </p>

        <p>This link is valid for 24 hours.</p>

        <p>
          <b>Your Referral Code:</b><br/>
          ${user.referralCode || "-"}
        </p>

        <p>Team Divine Acres</p>
      `,
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error("RESEND ACTIVATION ERROR:", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}
