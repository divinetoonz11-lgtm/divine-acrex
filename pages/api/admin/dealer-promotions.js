import clientPromise from "../../../lib/mongodb";
import adminGuard from "../../../lib/adminGuard";
import { ObjectId } from "mongodb";

/*
ADMIN DEALER PROMOTION API
✔ List dealers
✔ Search / filter
✔ Promotion due logic
✔ Approve / Hold promotion
✔ Pagination
*/

const LEVEL_RULES = {
  1: 1,
  2: 10,
  3: 25,
  4: 50,
  5: 100,
};

function getCurrentLevel(activeSubs = 0) {
  if (activeSubs >= 100) return 5;
  if (activeSubs >= 50) return 4;
  if (activeSubs >= 25) return 3;
  if (activeSubs >= 10) return 2;
  if (activeSubs >= 1) return 1;
  return 0;
}

export default async function handler(req, res) {
  if (!(await adminGuard(req, res))) return;

  const db = (await clientPromise).db();

  /* =====================================================
     GET : LIST / FILTER / PROMOTION STATUS
  ===================================================== */
  if (req.method === "GET") {
    const {
      q,
      level,
      status,
      page = 1,
      limit = 20,
    } = req.query;

    const p = Math.max(parseInt(page), 1);
    const l = Math.min(parseInt(limit), 50);
    const skip = (p - 1) * l;

    const query = { role: "dealer", status: { $ne: "deleted" } };

    // 🔍 SEARCH
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { mobile: { $regex: q, $options: "i" } },
      ];
    }

    const raw = await db
      .collection("users")
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(l)
      .toArray();

    const rows = raw.map((u) => {
      const activeSubs = u.activeSubscriptions || 0;
      const currentLevel = getCurrentLevel(activeSubs);
      const nextLevel = Math.min(currentLevel + 1, 5);
      const required = LEVEL_RULES[nextLevel] || 0;
      const remaining = Math.max(0, required - activeSubs);
      const due = remaining === 0 && nextLevel > currentLevel;

      return {
        _id: u._id,
        name: u.name || "—",
        email: u.email,
        mobile: u.mobile || "—",
        city: u.city || "—",
        activeSubs,
        currentLevel,
        nextLevel,
        remaining,
        promotionStatus: due ? "due" : "not-due",
      };
    });

    // 🎯 FILTER BY LEVEL
    const filteredByLevel =
      level && level !== "all"
        ? rows.filter((r) => r.currentLevel === Number(level))
        : rows;

    // ⚠️ FILTER BY PROMOTION STATUS
    const finalRows =
      status === "due"
        ? filteredByLevel.filter((r) => r.promotionStatus === "due")
        : status === "not-due"
        ? filteredByLevel.filter((r) => r.promotionStatus === "not-due")
        : filteredByLevel;

    const total = await db
      .collection("users")
      .countDocuments(query);

    return res.json({
      ok: true,
      rows: finalRows,
      page: p,
      limit: l,
      total,
    });
  }

  /* =====================================================
     PATCH : APPROVE / HOLD PROMOTION
  ===================================================== */
  if (req.method === "PATCH") {
    const { id, action } = req.body;

    if (!id || !action) {
      return res
        .status(400)
        .json({ ok: false, message: "id and action required" });
    }

    const dealer = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id), role: "dealer" });

    if (!dealer) {
      return res.status(404).json({ ok: false, message: "Dealer not found" });
    }

    const activeSubs = dealer.activeSubscriptions || 0;
    const currentLevel = getCurrentLevel(activeSubs);
    const nextLevel = Math.min(currentLevel + 1, 5);

    if (action === "approve") {
      await db.collection("users").updateOne(
        { _id: dealer._id },
        {
          $set: {
            promotionLevel: nextLevel,
            promotionApprovedAt: new Date(),
          },
        }
      );
    }

    if (action === "hold") {
      await db.collection("users").updateOne(
        { _id: dealer._id },
        {
          $set: {
            promotionHold: true,
            promotionHoldAt: new Date(),
          },
        }
      );
    }

    return res.json({ ok: true });
  }

  res.status(405).json({ ok: false, message: "Method not allowed" });
}
