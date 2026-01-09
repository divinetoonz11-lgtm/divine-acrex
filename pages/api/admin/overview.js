// pages/api/admin/overview.js
// FINAL PURE API – NO REACT, NO JSX, NO useState

import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  try {
    const { range = "monthly" } = req.query;

    const client = await clientPromise;
    const db = client.db();

    let format = "%Y-%m";
    if (range === "daily") format = "%Y-%m-%d";
    if (range === "yearly") format = "%Y";

    const listingsAgg = await db.collection("properties").aggregate(
      [
        {
          $match: {
            verificationStatus: "VERIFIED_LIVE",
            createdAt: { $exists: true },
          },
        },
        {
          $project: {
            label: {
              $dateToString: {
                format,
                date: "$createdAt",
              },
            },
          },
        },
        {
          $group: {
            _id: "$label",
            value: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ],
      { allowDiskUse: true }
    ).toArray();

    res.status(200).json({
      ok: true,
      data: {
        graphs: {
          listings: listingsAgg.map(x => ({
            label: x._id,
            value: x.value,
          })),
        },
      },
    });
  } catch (err) {
    console.error("OVERVIEW API ERROR:", err);
    res.status(500).json({
      ok: false,
      data: { graphs: { listings: [] } },
    });
  }
}
