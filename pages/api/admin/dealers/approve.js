import dbConnect from "../../../../utils/dbConnect";
import Dealer from "../../../../models/Dealer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  const { dealerId } = req.body;

  if (!dealerId) {
    return res.status(400).json({
      success: false,
      message: "Dealer ID required",
    });
  }

  try {
    await dbConnect();

    await Dealer.findByIdAndUpdate(dealerId, {
      verifyStatus: "approved",
    });

    return res.status(200).json({
      success: true,
      message: "Dealer approved",
    });
  } catch (error) {
    console.error("APPROVE DEALER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}
