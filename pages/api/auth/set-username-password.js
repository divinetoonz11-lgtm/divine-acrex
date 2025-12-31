// pages/api/auth/set-username-password.js
import crypto from "crypto";
import bcrypt from "bcryptjs";
import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  try {
    const { token, email, username, password } = req.body || {};

    // token OR email must exist
    if ((!token && !email) || !password) {
      return res.status(400).json({
        ok: false,
        message: "Invalid request",
      });
    }

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    let user = null;

    /* =========================
       TOKEN BASED (CREATE / RESET)
    ========================= */
    if (token) {
      const tokenHash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      user = await users.findOne({
        setupToken: tokenHash,
        setupTokenExpires: { $gt: new Date() },
      });

      if (!user) {
        return res.status(400).json({
          ok: false,
          message: "Invalid or expired link",
        });
      }
    }

    /* =========================
       EMAIL BASED (FORGOT PASSWORD)
    ========================= */
    if (!user && email) {
      user = await users.findOne({ email });
      if (!user) {
        return res.status(404).json({
          ok: false,
          message: "User not found",
        });
      }
    }

    /* =========================
       USERNAME VALIDATION (OPTIONAL)
    ========================= */
    let cleanUsername = null;
    if (username) {
      cleanUsername = username.trim().toLowerCase();
      if (!/^[a-z0-9_]{4,20}$/.test(cleanUsername)) {
        return res.status(400).json({
          ok: false,
          message: "Invalid username format",
        });
      }

      const exists = await users.findOne({
        username: cleanUsername,
        _id: { $ne: user._id },
      });

      if (exists) {
        return res.status(400).json({
          ok: false,
          message: "Username already taken",
        });
      }
    }

    /* =========================
       PASSWORD HASH
    ========================= */
    if (password.length < 8) {
      return res.status(400).json({
        ok: false,
        message: "Password must be at least 8 characters",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    /* =========================
       UPDATE USER
    ========================= */
    const update = {
      passwordHash,
      passwordSet: true,
      passwordUpdatedAt: new Date(),
    };

    if (cleanUsername) {
      update.username = cleanUsername;
    }

    await users.updateOne(
      { _id: user._id },
      {
        $set: update,
        $unset: {
          setupToken: "",
          setupTokenExpires: "",
        },
      }
    );

    return res.json({
      ok: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error("SET USERNAME PASSWORD ERROR:", err);
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
}
