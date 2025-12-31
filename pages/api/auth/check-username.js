// pages/api/auth/check-username.js
import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    const { username } = req.body || {};
    if (!username) {
      return res.status(400).json({ ok: false, message: "Username required" });
    }

    // basic sanitize
    const clean = username.trim().toLowerCase();

    // rules (simple + safe)
    if (!/^[a-z0-9_]{4,20}$/.test(clean)) {
      return res.json({
        ok: true,
        available: false,
        message: "Use 4–20 chars (a-z, 0-9, _)",
      });
    }

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    const exists = await users.findOne({ username: clean });
    if (exists) {
      return res.json({ ok: true, available: false });
    }

    return res.json({ ok: true, available: true });
  } catch (err) {
    console.error("CHECK USERNAME ERROR:", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}
