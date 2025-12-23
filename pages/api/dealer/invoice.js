import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "../../../utils/dbConnect";
import Payment from "../../../models/Payment";

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ ok: false });
    }

    // 🔐 Only dealer or admin can view invoice
    if (!["dealer", "admin"].includes(session.user.role)) {
      return res.status(403).json({ ok: false });
    }

    const { id } = req.query;
    if (!id) {
      return res.json(null);
    }

    await dbConnect();

    const p = await Payment.findById(id).lean();
    if (!p) {
      return res.json(null);
    }

    const gst = Math.round(p.amount * 0.18);
    const total = p.amount + gst;

    return res.json({
      invoiceNo: `GST-${p._id.toString().slice(-6)}`,
      date: new Date(p.createdAt).toLocaleDateString(),
      plan: p.plan,
      amount: p.amount,
      gst,
      total,
      status: p.status.toUpperCase(), // UNPAID | PENDING | PAID
      dealerEmail: p.email || session.user.email,
    });
  } catch (e) {
    console.error("Invoice API error:", e);
    return res.status(500).json({ ok: false });
  }
}
