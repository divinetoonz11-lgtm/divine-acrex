import mongoose from "mongoose";

const OwnerContactPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contacts: { type: Number, required: true },
    price: { type: Number, required: true },
    validityMonths: { type: Number, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.OwnerContactPlan ||
  mongoose.model("OwnerContactPlan", OwnerContactPlanSchema);
