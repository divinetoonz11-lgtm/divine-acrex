import clientPromise from "../../../../lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).end();

  const client = await clientPromise;
  const db = client.db();
  const p = await db.collection("properties").find({}).toArray();

  const today = new Date().toDateString();

  res.json({
    total: p.length,
    pending: p.filter(x => x.status === "pending").length,
    live: p.filter(x => x.status === "live").length,
    blocked: p.filter(x => x.status === "blocked").length,
    spam: p.filter(x => x.spam).length,
    featured: p.filter(x => x.featured).length,
    users: p.filter(x => x.postedBy === "Owner").length,
    dealers: p.filter(x => x.postedBy === "Dealer").length,
    builders: p.filter(x => x.postedBy === "Builder").length,
    verified: p.filter(x => x.verified === true).length,
    unverified: p.filter(x => x.verified !== true).length,
    today: p.filter(x =>
      x.createdAt &&
      new Date(x.createdAt).toDateString() === today
    ).length,
  });
}
