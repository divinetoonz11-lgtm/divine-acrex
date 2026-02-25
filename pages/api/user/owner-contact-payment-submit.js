import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  try {
    const { propertyId, plan, amount } = req.body;

    if (!propertyId || !plan || !amount) {
      return res.status(400).json({
        ok: false,
        message: "Invalid payment data",
      });
    }

    // ⚠️ Future में session से real userId लेना है
    const userId = "demoUser";

    const client = await clientPromise;
    const db = client.db();

    /* ================= PLAN CONFIG ================= */

    let credits = 0;
    let validityDays = 0;

    if (plan === "MONTHLY") {
      credits = 25;
      validityDays = 30;
    }

    if (plan === "QUARTERLY") {
      credits = 75;
      validityDays = 90;
    }

    if (!credits) {
      return res.status(400).json({
        ok: false,
        message: "Invalid plan",
      });
    }

    /* ================= CHECK DUPLICATE PENDING ================= */

    const existing = await db
      .collection("owner_contact_payments")
      .findOne({
        userId,
        status: "PENDING",
      });

    if (existing) {
      return res.json({
        ok: true,
        message: "Payment already pending",
      });
    }

    /* ================= INSERT PAYMENT ================= */

    await db.collection("owner_contact_payments").insertOne({
      userId,
      propertyId,
      plan,
      amount,
      credits,
      validityDays,
      status: "PENDING",
      createdAt: new Date(),
    });

    return res.json({
      ok: true,
      message: "Payment submitted successfully",
    });
  } catch (error) {
    console.error("OWNER CONTACT PAYMENT ERROR:", error);

    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
}
