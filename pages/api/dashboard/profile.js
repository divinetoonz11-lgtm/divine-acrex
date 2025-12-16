// pages/api/dashboard/profile.js

// Temporary in-memory storage (DB connect easy in future)
let profileData = {
  name: "Deepika",
  email: "deepika@example.com",
  phone: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function handler(req, res) {
  // -----------------------------
  // GET → Return user profile
  // -----------------------------
  if (req.method === "GET") {
    return res.status(200).json(profileData);
  }

  // -----------------------------
  // POST → Update profile
  // -----------------------------
  if (req.method === "POST") {
    try {
      const { name, email, phone } = req.body || {};

      // Basic validations
      if (!name || name.trim().length < 2) {
        return res.status(400).json({ error: "Name is required." });
      }

      if (!email || !email.includes("@")) {
        return res.status(400).json({ error: "Valid email required." });
      }

      const phoneDigits = (phone || "").replace(/\D/g, "");
      if (phoneDigits.length < 10) {
        return res.status(400).json({ error: "Valid 10-digit phone required." });
      }

      // Update profile
      profileData = {
        ...profileData,
        name,
        email,
        phone: phoneDigits,
        updatedAt: new Date().toISOString(),
      };

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: profileData,
      });
    } catch (err) {
      console.error("PROFILE POST ERROR:", err);
      return res.status(500).json({ error: "Server error, try again later." });
    }
  }

  // -----------------------------
  // If method not allowed
  // -----------------------------
  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method Not Allowed" });
}
