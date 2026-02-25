import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

const LIMIT = 20;

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== "admin") {
    return res.status(401).json({ ok: false });
  }

  const client = await clientPromise;
  const db = client.db();
  const col = db.collection("properties");

  const { page = 1, q = "", status = "all", exportCsv } = req.query;

  /* ================= FILTER ================= */
  const filter = {};
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { city: { $regex: q, $options: "i" } },
      { ownerEmail: { $regex: q, $options: "i" } },
      { dealerEmail: { $regex: q, $options: "i" } },
    ];
  }
  if (status === "spam") filter.spam = true;
  if (status === "blocked") filter.status = "blocked";

  /* ================= BULK ACTION ================= */
  if (req.method === "POST") {
    const { ids = [], set } = req.body;
    await col.updateMany(
      { _id: { $in: ids.map(id => new ObjectId(id)) } },
      { $set: set }
    );
    return res.json({ ok: true });
  }

  /* ================= CSV ================= */
  if (exportCsv === "1") {
    const rows = await col.find(filter).limit(50000).toArray();
    const csv = [
      "Title,City,Status,Spam",
      ...rows.map(r =>
        `"${r.title || ""}","${r.city || ""}","${r.status || ""}",${r.spam ? "YES" : "NO"}`
      ),
    ];
    res.setHeader("Content-Type", "text/csv");
    return res.send(csv.join("\n"));
  }

  /* ================= KPI ================= */
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [total, spam, blocked, today] = await Promise.all([
    col.countDocuments({}),
    col.countDocuments({ spam: true }),
    col.countDocuments({ status: "blocked" }),
    col.countDocuments({ createdAt: { $gte: startOfDay } }),
  ]);

  /* ================= LIST ================= */
  const skip = (Number(page) - 1) * LIMIT;
  const [items, count] = await Promise.all([
    col.find(filter).sort({ createdAt: -1 }).skip(skip).limit(LIMIT).toArray(),
    col.countDocuments(filter),
  ]);

  return res.json({
    ok: true,
    kpi: { total, spam, blocked, today },
    items,
    totalPages: Math.ceil(count / LIMIT),
  });
}
