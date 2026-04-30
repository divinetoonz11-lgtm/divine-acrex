export default function handler(req, res) {

  const { locality, city, state, propertyType } = req.query;

  if (!locality) {
    return res.status(400).json({ error: "Location required" });
  }

  /* ---------- AI SUMMARY ---------- */

  let summary = "";

  if (propertyType === "Flat / Apartment") {

    summary = `${locality} in ${city} is a well established
    residential locality offering apartments and housing
    societies. The area benefits from strong connectivity
    through railway stations, metro corridors and major
    road networks.

    Residents have access to schools, hospitals, shopping
    malls and entertainment hubs nearby.`;

  }

  else if (propertyType === "Commercial Shop") {

    summary = `${locality} in ${city} is a busy commercial
    hub featuring retail outlets, offices and business
    establishments with strong daily footfall.`;

  }

  else if (propertyType === "Agricultural Land") {

    summary = `${locality} in ${state} offers agricultural
    land parcels suitable for farming activities and
    long term land investment opportunities.`;

  }

  else {

    summary = `${locality} in ${city} is a developing area
    with improving infrastructure and connectivity.`;

  }

  /* ---------- AREA PHOTOS ---------- */

  const photos = [

    `https://source.unsplash.com/1200x700/?${locality},${city},buildings`,
    `https://source.unsplash.com/1200x700/?${locality},${city},apartments`,
    `https://source.unsplash.com/1200x700/?${locality},${city},street`

  ];

  /* ---------- HIGHLIGHTS ---------- */

  const highlights = [

    "Good road connectivity",
    "Public transport availability",
    "Schools and hospitals nearby",
    "Shopping malls and restaurants",
    "Growing infrastructure"

  ];

  res.json({
    summary,
    photos,
    highlights
  });

}