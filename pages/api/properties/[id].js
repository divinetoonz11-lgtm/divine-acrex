// pages/api/properties/[id].js

import dbConnect from "../../../utils/dbConnect";
import Property from "../../../models/Property";

// AUTO SWITCH → DEMO MODE or REAL DB MODE
const useDemo = process.env.USE_DEMO !== "0";

/* ==============================
   DEMO DATA (in-memory)
============================== */
if (useDemo && !global._demoProperties) {
  global._demoProperties = [
    {
      id: "p1",
      title: "Luxurious Apartment",
      price: 5400000,
      bhk: 2,
      area: 950,
      location: "South Ex",
      image: "/images/listing-example-1.png",
      status: "active",
      featured: false,
    },
    {
      id: "p2",
      title: "Modern Flat",
      price: 7200000,
      bhk: 3,
      area: 1200,
      location: "Connaught Place",
      image: "/images/listing-example-2.png",
      status: "active",
      featured: true,
    },
  ];
}

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  /* ===========================
     DEMO MODE
  =========================== */
  if (useDemo) {
    const items = global._demoProperties;
    const index = items.findIndex((x) => x.id === id);

    if (index === -1)
      return res.status(404).json({ ok: false, message: "Not found" });

    if (method === "GET") {
      return res.json({ ok: true, data: items[index] });
    }

    if (method === "PUT") {
      items[index] = { ...items[index], ...req.body };
      return res.json({ ok: true, data: items[index] });
    }

    if (method === "DELETE") {
      items.splice(index, 1);
      return res.json({ ok: true, message: "Deleted" });
    }

    return res.status(405).json({ ok: false, message: "Not allowed" });
  }

  /* ===========================
     REAL DATABASE MODE (MONGOOSE)
  =========================== */
  try {
    await dbConnect();

    if (method === "GET") {
      const doc = await Property.findById(id).lean();
      if (!doc)
        return res.status(404).json({ ok: false, message: "Not found" });
      return res.json({ ok: true, data: doc });
    }

    if (method === "PUT") {
      const updated = await Property.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
      ).lean();
      return res.json({ ok: true, data: updated });
    }

    if (method === "DELETE") {
      await Property.findByIdAndDelete(id);
      return res.json({ ok: true, message: "Deleted" });
    }

    return res.status(405).json({ ok: false, message: "Not allowed" });
  } catch (err) {
    console.error("PROPERTY API ERROR:", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}
