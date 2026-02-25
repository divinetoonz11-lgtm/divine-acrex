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

    const payment = await db
      .collection("owner_contact_payments")
      .findOne({
        _id: new ObjectId(paymentId),
      });

    if (!payment) {
      return res.status(404).json({
        ok: false,
        message: "Payment not found",
      });
    }

    await db.collection("owner_contact_payments").updateOne(
      { _id: new ObjectId(paymentId) },
      {
        $set: {
          status: "REJECTED",
          rejectedAt: new Date(),
        },
      }
    );

    return res.status(200).json({
      ok: true,
      message: "Payment rejected successfully",
    });
  } catch (error) {
    console.error("REJECT OWNER PAYMENT ERROR:", error);

    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
}
