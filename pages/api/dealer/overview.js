import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || session.user?.role !== "dealer") {
      return res.status(401).json({ ok: false });
    }

    const client = await clientPromise;
    const db = client.db();

    const email = session.user.email?.toLowerCase();
    const dealerIdString = session.user.id;

    let dealerObjectId = null;
    if (ObjectId.isValid(dealerIdString)) {
      dealerObjectId = new ObjectId(dealerIdString);
    }

    const propertiesCol = db.collection("properties");
    const leadsCol = db.collection("leads");
    const paymentsCol = db.collection("payments");
    const viewsCol = db.collection("propertyViews");

    /* ========= UNIVERSAL DEALER FILTER ========= */

    const dealerFilter = {
      $or: [
        { dealerEmail: email },
        { dealerEmail: session.user.email },
        { dealerId: dealerIdString },
        ...(dealerObjectId ? [{ dealerId: dealerObjectId }] : [])
      ],
      isDeleted: { $ne: true }
    };

    /* ========= PROPERTIES ========= */

    const totalProperties =
      await propertiesCol.countDocuments(dealerFilter);

    const liveProperties =
      await propertiesCol.countDocuments({
        ...dealerFilter,
        status: "active"
      });

    const soldProperties =
      await propertiesCol.countDocuments({
        ...dealerFilter,
        status: "sold"
      });

    /* ========= LEADS ========= */

    const totalLeads =
      await leadsCol.countDocuments({
        $or: [
          { dealerEmail: email },
          { dealerId: dealerIdString },
          ...(dealerObjectId ? [{ dealerId: dealerObjectId }] : [])
        ]
      });

    const closedLeads =
      await leadsCol.countDocuments({
        $or: [
          { dealerEmail: email },
          { dealerId: dealerIdString },
          ...(dealerObjectId ? [{ dealerId: dealerObjectId }] : [])
        ],
        status: "closed"
      });

    const conversion =
      totalLeads > 0
        ? Number(((closedLeads / totalLeads) * 100).toFixed(1))
        : 0;

    /* ========= REVENUE ========= */

    const payments = await paymentsCol
      .find({
        $or: [
          { dealerEmail: email },
          { dealerId: dealerIdString },
          ...(dealerObjectId ? [{ dealerId: dealerObjectId }] : [])
        ]
      })
      .project({ amount: 1 })
      .toArray();

    const totalRevenue = payments.reduce(
      (sum, p) => sum + (Number(p.amount) || 0),
      0
    );

    /* ========= VIEWS ========= */

    const totalViews =
      await viewsCol.countDocuments({
        $or: [
          { dealerEmail: email },
          { dealerId: dealerIdString },
          ...(dealerObjectId ? [{ dealerId: dealerObjectId }] : [])
        ]
      });

    /* ========= AI SCORE ========= */

    let aiScore = 50;
    if (conversion > 20) aiScore += 15;
    if (liveProperties > 5) aiScore += 10;
    if (totalViews > 100) aiScore += 10;
    if (soldProperties > 3) aiScore += 15;

    if (aiScore > 100) aiScore = 100;

    return res.json({
      ok: true,
      kpis: {
        totalProperties,
        liveProperties,
        soldProperties,
        totalLeads,
        closedLeads,
        conversion,
        totalRevenue,
        totalViews,
        aiScore
      }
    });

  } catch (err) {
    console.error("OVERVIEW API ERROR:", err);
    return res.status(500).json({ ok: false });
  }
}