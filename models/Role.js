// models/Role.js
import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    permissions: [String],
  },
  { timestamps: true }
);

export default mongoose.models.Role || mongoose.model("Role", RoleSchema);
