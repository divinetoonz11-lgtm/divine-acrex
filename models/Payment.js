import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    plan: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "rejected"],
      default: "pending",
    },
    verifiedBy: String,
    verifiedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.models.Payment ||
  mongoose.model("Payment", PaymentSchema);
