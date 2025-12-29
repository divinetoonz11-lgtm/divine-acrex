import clientPromise from "../../../../lib/mongodb";

/*
SUB ADMIN – PERMISSIONS API
✔ Correct path
✔ Server-side only
✔ Build safe
*/

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ ok: false });
  }

  try {
    const { userId, permissions } = req.body;

    if (!userId || !permissions) {
      return res.status(400).json({ ok: false });
    }

    const client = await clientPromise;
    const db = client.db();

    await db.collection("users").updateOne(
      { _id: userId, role: "sub_admin" },
      {
        $set: {
          permissions,
          updatedAt: new Date(),
        },
      }
    );

    return res.json({ ok: true });
  } catch (e) {
    console.error("PERMISSION API ERROR:", e);
    return res.status(500).json({ ok: false });
  }
}
