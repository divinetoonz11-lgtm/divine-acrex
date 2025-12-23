import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User";

/*
USER REFERRAL API – FINAL LOCKED
✔ Google + Mobile safe
✔ Auto-generate referral
✔ referralCreatedAt included
✔ No payment / wallet logic
*/

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || session.user?.role !== "user") {
      return res.status(401).json({ ok: false });
    }

    await dbConnect();

    let user = await User.findOne({
      email: session.user.email,
    }).lean();

    if (!user) {
      return res.json({ ok: true, referralCode: "" });
    }

    /* ================= REFERRAL AUTO-GENERATE ================= */
    if (!user.referralCode) {
      const base =
        (user.email && user.email.split("@")[0]) ||
        (user.phone && user.phone.slice(-6)) ||
        "UA";

      const referralCode =
        "UA-" +
        base.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6) +
        "-" +
        Math.floor(1000 + Math.random() * 9000);

      const createdAt = new Date();

      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            referralCode,
            referralCreatedAt: createdAt,
          },
        }
      );

      // update local object so response is correct
      user = {
        ...user,
        referralCode,
        referralCreatedAt: createdAt,
      };
    }

    return res.json({
      ok: true,
      referralCode: user.referralCode,
      referralCreatedAt: user.referralCreatedAt || null,
    });
  } catch (err) {
    console.error("User Referral Error:", err);
    return res.status(500).json({ ok: false });
  }
}
