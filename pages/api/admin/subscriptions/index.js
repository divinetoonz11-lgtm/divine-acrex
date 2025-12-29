import clientPromise from "../../../../lib/mongodb";
import adminGuard from "../../../../lib/adminGuard";

/*
ADMIN SUBSCRIPTIONS – LIST API
✔ Pagination
✔ Status filter
✔ Matches admin UI exactly
*/

export default async function handler(req, res) {
  if (!(await adminGuard(req, res))) return;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const db = (await clientPromise).db();

  const {
    page = 1,
    limit = 20,
    status = "active",
  } = req.query;

  const p = Math.max(parseInt(page), 1);
  const l = Math.min(parseInt(limit), 50);
  const skip = (p - 1) * l;

  const query = {};

  if (status !== "all") {
    query.status = status;
  }

  const subscriptions = await db
    .collection("subscriptions")
    .find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(l)
    .toArray();

  const total = await db
    .collection("subscriptions")
    .countDocuments(query);

  return res.json({
    subscriptions,
    total,
    page: p,
    limit: l,
  });
}
