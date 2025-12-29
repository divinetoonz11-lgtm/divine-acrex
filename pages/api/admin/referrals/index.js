import clientPromise from "../../../../lib/mongodb";
import adminGuard from "../../../../lib/adminGuard";

const LEVEL_RULES = {
  1: 1,
  2: 10,
  3: 25,
  4: 50,
  5: 100,
};

function getLevel(activeTeam = 0) {
  if (activeTeam >= 100) return 5;
  if (activeTeam >= 50) return 4;
  if (activeTeam >= 25) return 3;
  if (activeTeam >= 10) return 2;
  if (activeTeam >= 1) return 1;
  return 0;
}

export default async function handler(req, res) {
  if (!(await adminGuard(req, res))) return;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const db = (await clientPromise).db();

  const { page = 1, limit = 20, q = "", level = "all" } = req.query;

  const p = Math.max(parseInt(page), 1);
  const l = Math.min(parseInt(limit), 50);
  const skip = (p - 1) * l;

  const query = { role: "dealer" };

  if (q) {
    query.$or = [
      { name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
      { mobile: { $regex: q, $options: "i" } },
    ];
  }

  const users = await db
    .collection("users")
    .find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(l)
    .toArray();

  const rows = users.map((u) => {
    const activeTeam = u.activeTeam || 0;
    const lvl = getLevel(activeTeam);
    const nextReq = LEVEL_RULES[lvl + 1] || null;

    return {
      _id: u._id,
      name: u.name || "-",
      email: u.email,
      referralCode: u.referralCode || "-",
      level: lvl,
      activeTeam,
      wallet: u.walletBalance || 0,
      totalEarned: u.totalReferralEarned || 0,
      promotionDue: nextReq ? activeTeam >= nextReq : false,
    };
  });

  const filtered =
    level === "all"
      ? rows
      : rows.filter((r) => r.level === Number(level));

  const total = await db.collection("users").countDocuments(query);

  res.json({
    rows: filtered,
    total,
    page: p,
    limit: l,
  });
}
