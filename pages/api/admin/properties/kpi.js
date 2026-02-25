import dbConnect from "../../../../utils/dbConnect";
import Property from "../../../../models/Property";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false });
  }

  try {
    await dbConnect();

    const [
      totalProperties,
      liveProperties,
      pendingProperties,
      blockedProperties,
      residentialCount,
      commercialCount,
      sellCount,
      rentCount
    ] = await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({ status: "live" }),
      Property.countDocuments({ status: "pending" }),
      Property.countDocuments({ status: "blocked" }),
      Property.countDocuments({ category: "residential" }),
      Property.countDocuments({ category: "commercial" }),
      Property.countDocuments({ listingFor: "sell" }),
      Property.countDocuments({ listingFor: "rent" }),
    ]);

    const revenueAgg = await Property.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $toDouble: "$price" } },
        },
      },
    ]);

    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    return res.status(200).json({
      ok: true,
      data: {
        totalProperties,
        liveProperties,
        pendingProperties,
        blockedProperties,
        residentialCount,
        commercialCount,
        sellCount,
        rentCount,
        totalRevenue,
      },
    });

  } catch (error) {
    console.error("KPI ERROR:", error);
    return res.status(500).json({
      ok: false,
      message: "Server Error",
    });
  }
}
