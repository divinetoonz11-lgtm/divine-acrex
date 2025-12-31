import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  const db = (await clientPromise).db();

  const rows = await db
    .collection("users")
    .find(
      {
        documents: { $exists: true }
      },
      {
        projection: {
          email: 1,
          role: 1,
          status: 1,
          kycStatus: 1,
          createdAt: 1
        }
      }
    )
    .limit(20)
    .toArray();

  res.json({ rows });
}
