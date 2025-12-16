import dbConnect from "../../../utils/dbConnect";
import Admin from "../../../models/Admin";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Only POST allowed" });
  }

  const { email, password } = req.body;

  // CHECK REQUIRED FIELDS
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password required" });
  }

  try {
    // CHECK ADMIN IN DATABASE
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ success: false, message: "Admin not found" });
    }

    // CHECK PASSWORD
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }

    // SUCCESS → return simple token
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: "ADMIN_SECURE_TOKEN",
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
