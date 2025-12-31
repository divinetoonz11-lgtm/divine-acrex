import clientPromise from "../../../../lib/mongodb";
import adminGuard from "../../../../lib/adminGuard";
import { ObjectId } from "mongodb";
import crypto from "crypto";
import { sendMail } from "../../../../lib/mailer";

/* =========================
   OPTIONAL SMS (STUB)
========================= */
async function sendSMS(mobile, message) {
  if (!mobile) return;
  console.log("SMS TO:", mobile, message);
}

/* =========================
   REFERRAL GENERATOR
========================= */
function generateReferralCode(name = "DA") {
  const base = name.replace(/[^A-Z]/gi, "").toUpperCase().slice(0, 5);
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `UA-${base}-${rand}`;
}

export default async function handler(req, res) {
  if (!(await adminGuard(req, res))) return;

  const db = (await clientPromise).db();
  const users = db.collection("users");

  /* =========================
     GET – DEALER LIST
  ========================= */
  if (req.method === "GET") {
    let { tab = "all", page = 1, limit = 10, q } = req.query;
    const safeTab = String(tab).toLowerCase();

    const p = Math.max(parseInt(page), 1);
    const l = Math.min(parseInt(limit), 50);
    const skip = (p - 1) * l;

    const query = {};

    if (safeTab === "requests") query.status = "pending";
    if (safeTab === "active") {
      query.role = "dealer";
      query.status = "active";
    }
    if (safeTab === "blocked") {
      query.role = "dealer";
      query.status = "blocked";
    }
    if (safeTab === "all") query.role = "dealer";

    if (q) {
      query.$or = [
        { name: new RegExp(q, "i") },
        { email: new RegExp(q, "i") },
      ];
    }

    const rows = await users
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(l)
      .toArray();

    const total = await users.countDocuments(query);

    const summary = {
      requests: await users.countDocuments({ status: "pending" }),
      active: await users.countDocuments({ role: "dealer", status: "active" }),
      blocked: await users.countDocuments({ role: "dealer", status: "blocked" }),
    };

    return res.json({
      ok: true,
      rows,
      summary,
      page: p,
      totalPages: Math.ceil(total / l),
    });
  }

  /* =========================
     PATCH – ACTIONS
  ========================= */
  if (req.method === "PATCH") {
    const { id, action } = req.body;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ ok: false });
    }

    const user = await users.findOne({ _id: new ObjectId(id) });
    if (!user) {
      return res.status(404).json({ ok: false });
    }

    /* =========================
       APPROVE → AUTO MAIL
    ========================= */
    if (action === "approve") {
      const rawToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

      const referralCode =
        user.referralCode || generateReferralCode(user.name);

      await users.updateOne(
        { _id: user._id },
        {
          $set: {
            role: "dealer",
            status: "active",
            dealerApprovedAt: new Date(),
            referralCode,
            setupToken: tokenHash,
            setupTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
          },
        }
      );

      const link = `${process.env.NEXTAUTH_URL}/set-password?token=${rawToken}`;

      // 📧 AUTO MAIL (CENTRAL MAILER)
      await sendMail({
        to: user.email,
        subject: "Dealer Account Activated – Divine Acres 🎉",
        html: `
          <h2>Welcome ${user.name || ""}</h2>

          <p>Your <b>Divine Acres Dealer account</b> is now <b>ACTIVE</b>.</p>

          <p>Create your <b>username & password</b> using the link below:</p>

          <p>
            <a href="${link}"
               style="display:inline-block;padding:12px 18px;
                      background:#1e40af;color:#fff;
                      text-decoration:none;border-radius:6px;">
              Create Username & Password
            </a>
          </p>

          <p><b>Your Referral Code:</b> ${referralCode}</p>

          <p>This link is valid for 24 hours.</p>

          <p>Team Divine Acres</p>
        `,
      });

      await sendWelcomeSMS({
        ...user,
        referralCode,
      });

      return res.json({ ok: true });
    }

    /* =========================
       OTHER ACTIONS
    ========================= */
    if (action === "reject") {
      await users.updateOne(
        { _id: user._id },
        { $set: { status: "rejected" } }
      );
    }

    if (action === "block") {
      await users.updateOne(
        { _id: user._id },
        { $set: { status: "blocked" } }
      );
    }

    if (action === "unblock") {
      await users.updateOne(
        { _id: user._id },
        { $set: { role: "dealer", status: "active" } }
      );
    }

    return res.json({ ok: true });
  }

  res.status(405).end();
}

/* =========================
   WELCOME SMS
========================= */
async function sendWelcomeSMS(user) {
  const msg = `Congratulations!
Your Divine Acres Dealer account is ACTIVE.

Referral Code: ${user.referralCode}

Team Divine Acres`;

  await sendSMS(user.mobile, msg);
}
