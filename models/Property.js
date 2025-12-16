import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    // Owner: user or dealer
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    title: { type: String, required: true },
    description: { type: String, default: "" },

    // Locations
    city: { type: String, required: true },
    location: { type: String, default: "" },

    // Prices
    price: { type: Number, required: true },
    priceType: { type: String, default: "sell" }, // sell | rent

    // Property details
    bhk: { type: Number, default: 2 },
    area: { type: Number, default: 900 }, // sqft

    // Images
    images: [{ type: String }],

    // Status (admin controls)
    active: { type: Boolean, default: true },   // admin ON/OFF property
    approved: { type: Boolean, default: false }, // admin approval system

    // Dealer extra info
    furnished: { type: String, default: "unfurnished" },
    parking: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Property ||
  mongoose.model("Property", PropertySchema);
