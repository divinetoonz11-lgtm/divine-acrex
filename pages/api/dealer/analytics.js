import dbConnect from "@/lib/dbConnect";
import Property from "@/models/Property";
import Lead from "@/models/Lead";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await dbConnect();

  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== "dealer") {
    return res.status(401).json({ ok: false });
  }

  const dealerId = session.user.id;

  const properties = await Property.find({ dealerId });
  const leads = await Lead.find({ dealerId });

  const totalProperties = properties.length;
  const totalLeads = leads.length;
  const activeListings = properties.filter(p => p.status==="active").length;
  const closedDeals = properties.filter(p => p.status==="sold").length;

  const totalRevenue = properties
    .filter(p => p.status==="sold")
    .reduce((sum,p)=> sum + (p.price || 0), 0);

  const conversionRate = totalLeads===0 ? 0 :
    ((closedDeals/totalLeads)*100).toFixed(1);

  /* ===== LEAD SOURCE ===== */
  const sourceMap = {};
  leads.forEach(l=>{
    const s = l.source || "Direct";
    sourceMap[s] = (sourceMap[s]||0)+1;
  });

  const leadSources = Object.keys(sourceMap).map(k=>({
    name:k,
    value:sourceMap[k]
  }));

  /* ===== CITY PERFORMANCE ===== */
  const cityMap = {};
  properties.forEach(p=>{
    const c = p.city || "Unknown";
    cityMap[c] = (cityMap[c]||0)+1;
  });

  const cityPerformance = Object.keys(cityMap).map(c=>({
    city:c,
    listings:cityMap[c]
  }));

  /* ===== MONTHLY DATA ===== */
  const months = Array.from({length:6}).map((_,i)=>{
    const d = new Date();
    d.setMonth(d.getMonth()-(5-i));
    return d.toLocaleString("default",{month:"short"});
  });

  function countByMonth(arr){
    const map={};
    arr.forEach(x=>{
      if(!x.createdAt) return;
      const m=new Date(x.createdAt).toLocaleString("default",{month:"short"});
      map[m]=(map[m]||0)+1;
    });
    return months.map(m=>map[m]||0);
  }

  return res.json({
    ok:true,
    kpis:{
      totalProperties,
      activeListings,
      totalLeads,
      closedDeals,
      conversionRate,
      totalRevenue
    },
    months,
    monthly:{
      properties:countByMonth(properties),
      leads:countByMonth(leads)
    },
    leadSources,
    cityPerformance
  });
}