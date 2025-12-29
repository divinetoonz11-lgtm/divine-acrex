import clientPromise from "../../../../lib/mongodb";
import adminGuard from "../../../../lib/adminGuard";
import { ObjectId } from "mongodb";
import {
  sendDealerApprovalMail,
  sendDealerRejectMail,
} from "../../../../lib/mailer";

/*
MASTER DEALER ADMIN API – FINAL (EMAIL ENABLED)
✔ Dealer requests list
✔ Approve / Reject
✔ Role escalation (user → dealer)
✔ Auto email on approval / rejection
✔ Pagination
✔ Search
✔ Production ready
*/

export default async function handler(req, res) {
  // 🔐 ADMIN GUARD
  if (!(await adminGuard(req, res))) return;

  const db = (await clientPromise).db();

  /* ======================================================
     GET : LIST / FILTER / TABS
  ====================================================== */
  if (req.method === "GET") {
    const {
      tab = "all",
      q,
      city,
      page = 1,
      limit = 20,
    } = req.query;

    const p = Math.max(parseInt(page), 1);
    const l = Math.min(parseInt(limit), 50);
    const skip = (p - 1) * l;

    const query = {
      dealerRequest: { $exists: true },
    };

    // 🔍 SEARCH
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { mobile: { $regex: q, $options: "i" } },
      ];
    }

    // 📍 CITY FILTER
    if (city) query.city = city;

    // 🧭 TABS
    if (tab === "requests") query.dealerRequest = "pending";
    if (tab === "active") query.role = "dealer";
    if (tab === "blocked") query.status = "blocked";
    if (tab === "kyc") query.kycStatus = { $ne: "approved" };
    if (tab === "subscriptions") query.subscription = { $exists: true };
    if (tab === "promotions") query.promotion = { $exists: true };
    if (tab === "referrals") query.referralCode = { $exists: true };

    const rows = await db
      .collection("users")
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(l)
      .toArray();

    const total = await db.collection("users").countDocuments(query);

    return res.json({
      ok: true,
      rows,
      page: p,
      limit: l,
      total,
      totalPages: Math.ceil(total / l),
    });
  }

  /* ======================================================
     PATCH : APPROVE / REJECT DEALER
  ====================================================== */
  if (req.method === "PATCH") {
    const { id, update } = req.body;

    if (!id || !update) {
      return res.status(400).json({
        ok: false,
        message: "id and update required",
      });
    }

    const user = await db.collection("users").findOne({
      _id: new ObjectId(id),
    });

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "User not found",
      });
    }

    const finalUpdate = {
      ...update,
      updatedAt: new Date(),
    };

    /* ✅ ADMIN APPROVES DEALER */
    if (update.status === "active") {
      finalUpdate.role = "dealer";
      finalUpdate.dealerApproved = true;
      finalUpdate.dealerApprovedAt = new Date();
      finalUpdate.dealerRequest = "approved";
      finalUpdate.status = "active";

      // ✉️ SEND APPROVAL MAIL
      await sendDealerApprovalMail({
        to: user.email,
        name: user.name || "Dealer",
      });
    }

    /* ❌ ADMIN REJECTS DEALER */
    if (update.status === "blocked") {
      finalUpdate.dealerApproved = false;
      finalUpdate.dealerRequest = "rejected";
      finalUpdate.status = "blocked";

      // ✉️ SEND REJECT MAIL
      await sendDealerRejectMail({
        to: user.email,
        name: user.name || "User",
      });
    }

    await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: finalUpdate }
    );

    return res.json({ ok: true });
  }

  /* ======================================================
     DELETE : SOFT DELETE
  ====================================================== */
  if (req.method === "DELETE") {
    const { id } = req.body;

    await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "deleted",
          deletedAt: new Date(),
        },
      }
    );

    return res.json({ ok: true });
  }

  res.status(405).json({ ok: false, message: "Method not allowed" });
}
