import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    const { propertyId, name, email, phone, message, source } = req.body || {};

    if (!propertyId || !name || !email || !phone) {
      return res
        .status(400)
        .json({ ok: false, message: "Missing required fields" });
    }

    const client = await clientPromise;
    const db = client.db();

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress ||
      "unknown";

    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentCount = await db.collection("leads").countDocuments({
      propertyId,
      ip,
      createdAt: { $gte: oneMinuteAgo },
    });

    if (recentCount >= 3) {
      return res.status(429).json({
        ok: false,
        message: "Too many requests. Please try again shortly.",
      });
    }

    const property = await db.collection("properties").findOne({
      _id: new ObjectId(propertyId),
    });

    if (!property) {
      return res
        .status(404)
        .json({ ok: false, message: "Property not found" });
    }

    const leadDoc = {
      propertyId,
      name,
      email,
      phone,
      message: message || "",
      source: source || "PROPERTY_VIEW",
      ip,
      userAgent: req.headers["user-agent"] || "",
      createdAt: new Date(),
      delivered: false,
      deliveredTo: null,
      consentGiven: true,
    };

    const { insertedId } = await db.collection("leads").insertOne(leadDoc);

    const postedBy =
      property.postedBy ||
      property.ownerRole ||
      (property.dealerId ? "DEALER" : "OWNER");

    if (postedBy === "DEALER" && property.dealerId) {
      const dealer = await db.collection("dealers").findOne({
        _id: new ObjectId(property.dealerId),
      });

      if (dealer && dealer.subscriptionActive === true) {
        await db.collection("leads").updateOne(
          { _id: insertedId },
          {
            $set: {
              delivered: true,
              deliveredTo: dealer._id,
            },
          }
        );

        return res.json({
          ok: true,
          contactNumber: dealer.phone || dealer.mobile,
        });
      }
    }

    if (postedBy === "OWNER" && property.ownerId) {
      const owner = await db.collection("users").findOne({
        _id: new ObjectId(property.ownerId),
      });

      if (owner && owner.subscriptionRequired === true) {
        return res.json({
          ok: true,
          requireSubscription: true,
        });
      }

      if (owner && owner.phone) {
        await db.collection("leads").updateOne(
          { _id: insertedId },
          {
            $set: {
              delivered: true,
              deliveredTo: owner._id,
            },
          }
        );

        return res.json({
          ok: true,
          contactNumber: owner.phone,
        });
      }
    }

    return res.json({
      ok: true,
      message: "Lead captured. Advertiser will contact you.",
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
}
