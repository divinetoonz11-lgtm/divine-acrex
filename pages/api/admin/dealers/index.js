// pages/api/admin/dealers/index.js
import dbConnect from "../../../../utils/dbConnect";
import Dealer from "../../../../models/Dealer";
import adminGuard from "../../../../utils/adminGuard";

// simple in-memory rate limit (per server instance)
const RATE_LIMIT = {};
const WINDOW_MS = 60 * 1000; // 1 min
const MAX_REQ = 120; // per admin per minute

function rateLimit(key) {
  const now = Date.now();
  if (!RATE_LIMIT[key]) {
    RATE_LIMIT[key] = { count: 1, start: now };
    return true;
  }

  const diff = now - RATE_LIMIT[key].start;
  if (diff > WINDOW_MS) {
    RATE_LIMIT[key] = { count: 1, start: now };
    return true;
  }

  RATE_LIMIT[key].count += 1;
  return RATE_LIMIT[key].count <= MAX_REQ;
}

export default async function handler(req, res) {
  // 🔒 ADMIN SECURITY
  if (!(await adminGuard(req, res))) return;

  // ✅ ONLY GET
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Only GET allowed" });
  }

  // 🔐 RATE LIMIT (10L LOGIN SAFE)
  const adminKey = req.headers["x-admin-key"] || req.socket.remoteAddress;
  if (!rateLimit(adminKey)) {
    return res.status(429).json({
      success: false,
      message: "Too many requests. Slow down.",
    });
  }

  await dbConnect();

  try {
    const page = Math.max(parseInt(req.query.page || "1"), 1);
    const limit = Math.min(parseInt(req.query.limit || "20"), 50);
    const status = req.query.status; // optional
    const skip = (page - 1) * limit;

    // ✅ INDEXED QUERY ONLY
    const query = {};
    if (status) query.status = status;

    // ✅ LEAN + PROJECTION (FAST & SAFE)
    const dealers = await Dealer.find(query)
      .select("_id name email phone status promoted createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Dealer.countDocuments(query);

    return res.status(200).json({
      success: true,
      page,
      limit,
      total,
      dealers,
    });
  } catch (err) {
    console.error("DEALER LIST ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}
