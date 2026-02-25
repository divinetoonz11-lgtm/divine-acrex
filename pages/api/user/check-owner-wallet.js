import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ allow: false });
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ allow: false });
    }

    // ⚠️ IMPORTANT:
    // Future में यहाँ real logged-in userId लेना है (session से)
    const userId = "demoUser"; 

    const client = await clientPromise;
    const db = client.db();

    let wallet = await db.collection("owner_contact_wallet").findOne({
      userId,
    });

    // 🟢 If wallet not exists → create new
    if (!wallet) {
      wallet = {
        userId,
        freeUsed: false,
        credits: 0,
        validTill: null,
        createdAt: new Date(),
      };

      await db.collection("owner_contact_wallet").insertOne(wallet);
    }

    /* ================= FREE CONTACT ================= */

    if (!wallet.freeUsed) {
      await db.collection("owner_contact_wallet").updateOne(
        { userId },
        { $set: { freeUsed: true } }
      );

      return res.json({
        allow: true,
        message: "Free contact unlocked",
      });
    }

    /* ================= PAID CREDIT CHECK ================= */

    const now = new Date();

    if (
      wallet.credits > 0 &&
      wallet.validTill &&
      new Date(wallet.validTill) > now
    ) {
      // Deduct 1 credit
      await db.collection("owner_contact_wallet").updateOne(
        { userId },
        { $inc: { credits: -1 } }
      );

      return res.json({
        allow: true,
        message: "Credit deducted",
      });
    }

    /* ================= NO CREDIT ================= */

    return res.json({
      allow: false,
      message: "No active plan",
    });
  } catch (error) {
    console.error("OWNER WALLET ERROR:", error);

    return res.status(500).json({
      allow: false,
    });
  }
}
