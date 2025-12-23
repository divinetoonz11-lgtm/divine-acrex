import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "../../../utils/dbConnect";
import Payment from "../../../models/Payment";
import User from "../../../models/User";

/*
STEP 2 – PAYMENT SUBMIT API (FINAL)
✔ Dealer auth required
✔ Status = PENDING
✔ Wallet auto-init (CRITICAL)
✔ Referral unlock flag
*/

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user?.role !== "dealer") {
    return res.status(401).json({ ok: false });
  }

  const { plan, amount } = req.body;
  if (!plan || !amount) {
    return res.status(400).json({ ok: false });
  }

  await dbConnect();

  /* ===== FIND DEALER ===== */
  const dealer = await User.findOne({ email: session.user.email });
  if (!dealer) {
    return res.status(404).json({ ok: false });
  }

  /* ===== 🔒 WALLET AUTO INIT (ROOT FIX) ===== */
  if (!dealer.wallet) {
    dealer.wallet = {
      total: 0,
      balance: 0,
      pending: 0,
      withdrawn: 0,
    };
  }

  /* ===== REFERRAL UNLOCK FLAG ===== */
  dealer.referralActive = true;

  /* ===== CREATE PAYMENT ===== */
  const payment = await Payment.create({
    dealerId: dealer._id,
    userEmail: dealer.email,
    plan,
    amount,
    status: "PENDING",
    createdAt: new Date(),
  });

  await dealer.save();

  return res.json({
    ok: true,
    message: "Payment submitted. Admin verification pending.",
    paymentId: payment._id,
  });
}
