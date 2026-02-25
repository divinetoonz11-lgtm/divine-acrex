import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  const client = await clientPromise;
  const db = client.db("divineacres");

  const { userId, propertyId } = req.body;

  if (!userId || !propertyId) {
    return res.status(400).json({ ok: false });
  }

  const walletCol = db.collection("owner_contact_wallets");
  const logsCol = db.collection("owner_contact_usage_logs");

  /* ================= CHECK IF ALREADY VIEWED ================= */
  const existingLog = await logsCol.findOne({
    userId,
    propertyId,
  });

  if (existingLog) {
    return res.status(200).json({
      ok: true,
      message: "Already unlocked",
      remainingCredits: existingLog.remainingCredits,
    });
  }

  /* ================= FETCH WALLET ================= */
  const wallet = await walletCol.findOne({ userId });

  if (!wallet) {
    return res.status(403).json({
      ok: false,
      message: "No active plan",
    });
  }

  /* ================= PLAN EXPIRY CHECK ================= */
  if (new Date(wallet.expiryDate) < new Date()) {
    return res.status(403).json({
      ok: false,
      message: "Plan expired",
    });
  }

  /* ================= CREDIT CHECK ================= */
  if (wallet.remainingCredits <= 0) {
    return res.status(403).json({
      ok: false,
      message: "Credits exhausted",
    });
  }

  /* ================= DEDUCT CREDIT ================= */
  const newCredits = wallet.remainingCredits - 1;

  await walletCol.updateOne(
    { userId },
    {
      $set: { remainingCredits: newCredits },
    }
  );

  /* ================= CREATE LOG ================= */
  await logsCol.insertOne({
    userId,
    propertyId,
    plan: wallet.plan,
    usedCredits: 1,
    remainingCredits: newCredits,
    createdAt: new Date(),
  });

  return res.status(200).json({
    ok: true,
    remainingCredits: newCredits,
  });
}
