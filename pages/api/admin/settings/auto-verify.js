import clientPromise from "../../../../lib/mongodb";

export default async function handler(req, res) {
    const db = (await clientPromise).db("divineacres");
    const settings = db.collection("settings");

  if (req.method === "GET") {
    const setting = await settings.findOne({ key: "autoVerify" });
    return res.json({ ok: true, value: setting?.value || false });
  }

  if (req.method === "POST") {
    const { value } = req.body;

    await settings.updateOne(
      { key: "autoVerify" },
      { $set: { key: "autoVerify", value } },
      { upsert: true }
    );

    return res.json({ ok: true });
  }

  res.status(405).end();
}