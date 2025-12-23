import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User";

/*
DEALER PROFILE API
✔ Auth required
✔ Mobile mandatory
✔ Google/Phone auto fields safe
*/

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || session.user?.role !== "dealer") {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, message: "Method not allowed" });
    }

    const {
      mobile,
      businessName,
      address,
      pan,
      gst,
    } = req.body;

    if (!mobile || mobile.length < 10) {
      return res.status(400).json({
        ok: false,
        message: "Mobile number is mandatory",
      });
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return res.status(404).json({ ok: false, message: "Dealer not found" });
    }

    // 🔒 Auto fields from session (do not trust client)
    user.name = session.user.name || user.name;
    user.email = session.user.email || user.email;

    // ✍️ Editable fields
    user.mobile = mobile;
    user.businessName = businessName || "";
    user.address = address || "";
    user.pan = pan || "";
    user.gst = gst || "";

    await user.save();

    return res.json({
      ok: true,
      message: "Profile updated successfully",
    });
  } catch (err) {
    console.error("Profile API Error:", err);
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
}
