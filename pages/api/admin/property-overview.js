import dbConnect from "../../../utils/dbConnect";
import Property from "../../../models/Property";

export default async function handler(req, res) {
  try {
    await dbConnect();

    const total = await Property.countDocuments({});
    const pending = await Property.countDocuments({ status: "pending" });
    const live = await Property.countDocuments({ status: "live" });
    const blocked = await Property.countDocuments({ status: "blocked" });

    const spam = await Property.countDocuments({ spam: true });
    const featured = await Property.countDocuments({ featured: true });
    const verified = await Property.countDocuments({ verified: true });
    const unverified = total - verified;

    const todayStart = new Date();
    todayStart.setHours(0,0,0,0);

    const today = await Property.countDocuments({
      createdAt: { $gte: todayStart }
    });

    // Agar fields exist nahi karti to 0 hi aayega
    const users = await Property.countDocuments({ postedBy: "Owner" });
    const dealers = await Property.countDocuments({ postedBy: "Dealer" });
    const builders = await Property.countDocuments({ postedBy: "Builder" });

    const expired = await Property.countDocuments({ expired: true });
    const boosted = await Property.countDocuments({ boosted: true });

    return res.status(200).json({
      total,
      pending,
      live,
      blocked,
      spam,
      featured,
      verified,
      unverified,
      users,
      dealers,
      builders,
      today,
      expired,
      boosted,
    });

  } catch (error) {
    console.error("PROPERTY OVERVIEW ERROR:", error);
    return res.status(500).json({});
  }
}
