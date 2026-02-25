import dbConnect from "../../../../utils/dbConnect";
import Property from "../../../../models/Property";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).end();

  try {
    await dbConnect();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const stats = await Property.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          pending: [{ $match: { status: "pending" } }, { $count: "count" }],
          live: [{ $match: { status: "live" } }, { $count: "count" }],
          blocked: [{ $match: { status: "blocked" } }, { $count: "count" }],
          spam: [{ $match: { spam: true } }, { $count: "count" }],
          featured: [{ $match: { featured: true } }, { $count: "count" }],
          verified: [{ $match: { verified: true } }, { $count: "count" }],
          today: [
            { $match: { createdAt: { $gte: todayStart } } },
            { $count: "count" }
          ]
        }
      }
    ]);

    const result = stats[0];

    res.json({
      total: result.total[0]?.count || 0,
      pending: result.pending[0]?.count || 0,
      live: result.live[0]?.count || 0,
      blocked: result.blocked[0]?.count || 0,
      spam: result.spam[0]?.count || 0,
      featured: result.featured[0]?.count || 0,
      verified: result.verified[0]?.count || 0,
      unverified:
        (result.total[0]?.count || 0) -
        (result.verified[0]?.count || 0),
      today: result.today[0]?.count || 0,
    });

  } catch (err) {
    console.error("OVERVIEW ERROR:", err);
    res.status(500).json({ ok: false });
  }
}
