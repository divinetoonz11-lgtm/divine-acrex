import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },

    email: { type: String, required: true, unique: true },

    password: { type: String }, // for email/password login

    googleId: { type: String }, // for Google OAuth login

    phone: { type: String },

    role: { type: String, default: "user" }, // user OR dealer

    // wishlist (property IDs)
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    ],

    // saved searches (future use)
    savedSearches: [
      {
        location: String,
        minPrice: Number,
        maxPrice: Number,
        bhk: Number,
      },
    ],

    // dealer verification (if user becomes dealer later)
    dealerStatus: {
      type: String,
      enum: ["none", "pending", "approved"],
      default: "none",
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
