import mongoose from "mongoose";

const DealerSchema = new mongoose.Schema(
  {
    // BASIC DETAILS
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },

    password: { type: String },   // normal login
    googleId: { type: String },   // google login

    // BUSINESS DETAILS
    businessName: { type: String },
    officeAddress: { type: String },
    city: { type: String },

    // KYC DOCUMENTS
    kyc: {
      pan: { type: String },
      gst: { type: String },
      rera: { type: String },
      adharFront: { type: String },
      adharBack: { type: String },
      profilePhoto: { type: String },
    },

    // STATUS
    verifyStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // PROPERTIES LINKED TO THIS DEALER
    properties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    ],

    role: { type: String, default: "dealer" },
  },
  { timestamps: true }
);

export default mongoose.models.Dealer || mongoose.model("Dealer", DealerSchema);
