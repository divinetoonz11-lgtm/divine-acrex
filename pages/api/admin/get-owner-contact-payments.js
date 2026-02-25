import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    const payments = await db
      .collection("owner_contact_payments")
      .find({})
      .sort({ createdAt: -1 }) // latest first
      .toArray();

    return res.status(200).json({
      ok: true,
      payments,
    });
  } catch (error) {
    console.error("GET OWNER CONTACT PAYMENTS ERROR:", error);

    return res.status(500).json({
      ok: false,
      payments: [],
    });
  }
}
