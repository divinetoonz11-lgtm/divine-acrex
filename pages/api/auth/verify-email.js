// pages/api/auth/verify-email.js
// FINAL – FULL UPDATED CODE (NO IN-MEMORY STORE)

import crypto from "crypto";
import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  try {
    const { token } = req.query;
    if (!token) {
      return res.redirect("/login?error=invalid_link");
    }

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    // hash token
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // find user with valid token
    const user = await users.findOne({
      setupToken: tokenHash,
      setupTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.redirect("/login?error=expired_link");
    }

    // verify email + cleanup token
    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          emailVerified: true,
          emailVerifiedAt: new Date(),
        },
        $unset: {
          setupToken: "",
          setupTokenExpires: "",
        },
      }
    );

    // redirect to login (NextAuth handles session)
    return res.redirect("/login?verified=1");
  } catch (e) {
    console.error("VERIFY EMAIL ERROR", e);
    return res.redirect("/login?error=server");
  }
}
