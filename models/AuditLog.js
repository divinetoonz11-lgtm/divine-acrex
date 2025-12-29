// models/AuditLog.js
import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true, // dealer, user, payment, system
      index: true,
    },
    action: {
      type: String,
      required: true, // approve, block, update, delete
    },
    actor: {
      type: String,
      required: true, // admin email/id
      index: true,
    },
    target: {
      type: String, // dealerId / userId / entityId
    },
    meta: {
      type: Object,
    },
  },
  { timestamps: true }
);

AuditLogSchema.index({ createdAt: -1 });

export default mongoose.models.AuditLog ||
  mongoose.model("AuditLog", AuditLogSchema);
