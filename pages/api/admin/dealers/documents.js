import clientPromise from "../../../../lib/mongodb";
import adminGuard from "../../../../lib/adminGuard";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (!(await adminGuard(req, res))) return;

  const { dealerId } = req.query;
  if (!ObjectId.isValid(dealerId)) {
    return res.status(400).json({ ok: false });
  }

  const db = (await clientPromise).db();

  const user = await db.collection("users").findOne(
    { _id: new ObjectId(dealerId) },
    { projection: { documents: 1, name: 1, email: 1 } }
  );

  if (!user) {
    return res.status(404).json({ ok: false });
  }

  /* =========================
     NORMALIZE DOCUMENTS
  ========================= */
  const docs = [];
  const d = user.documents || {};

  if (d.aadhaar) docs.push({ type: "aadhaar", url: d.aadhaar });
  if (d.pan) docs.push({ type: "pan", url: d.pan });
  if (d.photo) docs.push({ type: "photo", url: d.photo });
  if (d.other) docs.push({ type: "other", url: d.other });

  return res.json({
    ok: true,
    name: user.name || "-",
    email: user.email,
    documents: docs,
  });
}
