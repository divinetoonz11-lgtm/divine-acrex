import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  try {
    const { paymentId } = req.body;

    if (!paymentId || !ObjectId.isValid(paymentId)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid payment ID",
      });
    }

    const client = await clientPromise;
    const db = client.db();

    const payment = await db.collection("owner_contact_payments").findOne({
      _id: new ObjectId(paymentId),
    });

    if (!payment) {
      return res.status(404).json({
        ok: false,
        message: "Payment not found",
      });
    }

    // 🔒 Prevent double approval
    if (payment.status === "ACTIVE") {
      return res.status(400).json({
        ok: false,
        message: "Already approved",
      });
    }

    // ======================
    // Calculate Expiry
    // ======================
    const now = new Date();
    let expiryDate = new Date();

    if (payment.plan === "SINGLE") {
      expiryDate.setDate(now.getDate() + 7);
    } else if (payment.plan === "MONTHLY") {
      expiryDate.setMonth(now.getMonth() + 1);
    } else if (payment.plan === "QUARTERLY") {
      expiryDate.setMonth(now.getMonth() + 3);
    }

    // ======================
    // Update Payment Status
    // ======================
    await db.collection("owner_contact_payments").updateOne(
      { _id: new ObjectId(paymentId) },
      {
        $set: {
          status: "ACTIVE",
          approvedAt: now,
          expiryDate,
        },
      }
    );

    // ======================
    // Update User Wallet
    // ======================
    await db.collection("users").updateOne(
      { _id: new ObjectId(payment.userId) },
      {
        $inc: {
          ownerContactCredits: payment.credits,
        },
        $set: {
          ownerContactExpiry: expiryDate,
        },
      }
    );

    return res.status(200).json({
      ok: true,
      message: "Payment approved and credits added",
    });
  } catch (error) {
    console.error("APPROVE OWNER PAYMENT ERROR:", error);

    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
}
