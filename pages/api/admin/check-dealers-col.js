import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  const db = (await clientPromise).db();
  const rows = await db.collection("dealers").find({}).limit(10).toArray();
  res.json({ rows });
}
