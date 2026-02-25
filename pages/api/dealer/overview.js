import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || session.user?.role !== "dealer") {
      return res.status(401).json({ ok: false });
    }

    const client = await clientPromise;
    const db = client.db();

    const email = session.user.email.toLowerCase();

    const propertiesCol = db.collection("properties");
    const leadsCol = db.collection("leads");
    const paymentsCol = db.collection("payments");
    const viewsCol = db.collection("propertyViews");

    /* ================= PROPERTIES ================= */

    const totalProperties = await propertiesCol.countDocuments({
      dealerEmail: email,
    });

    const liveProperties = await propertiesCol.countDocuments({
      dealerEmail: email,
      status: "active",
    });

    /* ================= LEADS ================= */

    const leads = await leadsCol
      .find({ dealerEmail: email })
      .toArray();

    const totalLeads = leads.length;

    const closedLeads = leads.filter(l => l.status === "closed");
    const monthlyClosed = closedLeads.filter(l => {
      const now = new Date();
      const d = new Date(l.updatedAt);
      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    }).length;

    const conversion =
      totalLeads > 0
        ? ((closedLeads.length / totalLeads) * 100).toFixed(1)
        : 0;

    /* ================= AVG RESPONSE TIME ================= */

    const responded = leads.filter(
      l => l.firstResponseAt && l.createdAt
    );

    let avgResponseMinutes = 0;

    if (responded.length > 0) {
      const totalMinutes = responded.reduce((sum, l) => {
        const diff =
          new Date(l.firstResponseAt) -
          new Date(l.createdAt);
        return sum + diff / 60000;
      }, 0);

      avgResponseMinutes = Math.round(
        totalMinutes / responded.length
      );
    }

    /* ================= REVENUE ================= */

    const payments = await paymentsCol
      .find({ dealerEmail: email })
      .toArray();

    const totalRevenue = payments.reduce(
      (sum, p) => sum + (Number(p.amount) || 0),
      0
    );

    /* Monthly Revenue (Last 6 Months) */
    const monthlyRevenueData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);

      const month = date.getMonth();
      const year = date.getFullYear();

      const monthlySum = payments
        .filter(p => {
          const d = new Date(p.createdAt);
          return (
            d.getMonth() === month &&
            d.getFullYear() === year
          );
        })
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

      monthlyRevenueData.push(monthlySum);
    }

    /* Yearly Revenue (Last 5 Years) */
    const yearlyRevenueData = [];
    for (let i = 4; i >= 0; i--) {
      const year = new Date().getFullYear() - i;

      const yearlySum = payments
        .filter(p => {
          const d = new Date(p.createdAt);
          return d.getFullYear() === year;
        })
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

      yearlyRevenueData.push(yearlySum);
    }

    /* ================= VIEWS ================= */

    const totalViews = await viewsCol.countDocuments({
      dealerEmail: email,
    });

    /* ================= AI SCORE (Simple Logic) ================= */

    let aiScore = 50;

    if (conversion > 20) aiScore += 15;
    if (avgResponseMinutes < 30) aiScore += 15;
    if (liveProperties > 5) aiScore += 10;
    if (totalViews > 100) aiScore += 10;

    if (aiScore > 100) aiScore = 100;

    return res.json({
      ok: true,

      totalProperties,
      liveProperties,
      totalRevenue,

      conversion,
      monthlyClosed,
      avgResponseMinutes,

      totalViews,
      aiScore,

      monthlyRevenueData,
      yearlyRevenueData,
    });

  } catch (err) {
    console.error("OVERVIEW API ERROR:", err);
    return res.status(500).json({ ok: false });
  }
}