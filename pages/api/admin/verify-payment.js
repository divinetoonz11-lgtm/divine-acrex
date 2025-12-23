import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "../../../utils/dbConnect";
import Payment from "../../../models/Payment";
import User from "../../../models/User";

/*
STEP 4 – ADMIN VERIFY PAYMENT
✔ Admin only
✔ Pending → Paid
✔ Subscription + Referral activate
*/

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user?.role !== "admin") {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }

  const { paymentId } = req.body;

  if (!paymentId) {
    return res.status(400).json({ ok: false, message: "Payment ID required" });
  }

  await dbConnect();

  const payment = await Payment.findById(paymentId);
  if (!payment) {
    return res.status(404).json({ ok: false, message: "Payment not found" });
  }

  // mark paid
  payment.status = "paid";
  payment.verifiedBy = session.user.email;
  payment.verifiedAt = new Date();
  await payment.save();

  // activate dealer subscription + referral
  await User.updateOne(
    { email: payment.userEmail },
    {
      $set: {
        subscriptionPlan: payment.plan,
        subscriptionActive: true,
        referralActive: true,
      },
    }
  );

  return res.json({
    ok: true,
    message: "Payment verified & subscription activated",
  });
}
