// pages/api/auth/google.js
import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  const role = req.query.role; // user | dealer
  if (!role) {
    return res.status(400).send("Role is required");
  }

  // 🔒 Role conflict check (FINAL)
  if (req.query.email) {
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    const existing = await users.findOne({ email: req.query.email });

    if (existing && existing.role !== role) {
      return res
        .status(403)
        .send(
          "This email or mobile number is already associated with another account."
        );
    }
  }

  // 🔐 Role lock via state
  const state = Buffer.from(JSON.stringify({ role })).toString("base64url");

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });

  res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
}
