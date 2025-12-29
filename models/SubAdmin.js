// models/SubAdmin.js
import mongoose from "mongoose";

const SubAdminSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    regions: [String],
    permissions: [String],
  },
  { timestamps: true }
);

export default mongoose.models.SubAdmin ||
  mongoose.model("SubAdmin", SubAdminSchema);
