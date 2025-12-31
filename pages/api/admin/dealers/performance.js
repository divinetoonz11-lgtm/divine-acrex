import clientPromise from "../../../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();

  const data = await db.collection("leads").aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" },
        leads: { $sum: 1 },
        revenue: { $sum: "$amount" },
      },
    },
    { $sort: { "_id": 1 } }
  ]).toArray();

  return res.json(data);
}
