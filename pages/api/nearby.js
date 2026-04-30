export default async function handler(req, res) {

  const { location } = req.query;

  const key = process.env.GOOGLE_MAPS_API_KEY;

  console.log("LOCATION:", location);
  console.log("API KEY:", key);

  if (!location) {
    return res.status(400).json({ error: "Location missing" });
  }

  try {

    const geoRes = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${key}`
    );

    const geoData = await geoRes.json();

    console.log("GEOCODE RESPONSE:", geoData);

    if (!geoData.results || geoData.results.length === 0) {
      return res.json({ debug: "no geocode result", geoData });
    }

    const { lat, lng } = geoData.results[0].geometry.location;

    const placeRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=3000&type=train_station&key=${key}`
    );

    const placeData = await placeRes.json();

    console.log("PLACES RESPONSE:", placeData);

    return res.json(placeData);

  } catch (err) {

    console.error("ERROR:", err);

    return res.status(500).json({
      error: err.message
    });

  }

}