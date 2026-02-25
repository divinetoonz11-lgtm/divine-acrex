import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    /* ================= BASIC ================= */
    title: { type: String, required: true },
    description: String,

    category: {
      type: String,
      enum: ["residential", "commercial", "hotel"],
    },

    propertyType: String,
    listingFor: {
      type: String,
      enum: ["sell", "rent", "lease"],
    },

    /* ================= PRICE ================= */
    price: Number,
    priceType: String,

    /* ================= DETAILS ================= */
    bhk: String,
    area: Number,
    floor: String,
    vastu: String,
    furnishing: String,

    /* ================= LOCATION ================= */
    state: String,
    city: String,
    locality: String,
    society: String,

    /* ================= MEDIA ================= */

    // Existing images (safe)
    images: {
      type: [String],
      default: [],
    },

    // NEW proper videos array (IMPORTANT FIX)
    videos: {
      type: [String],
      default: [],
    },

    // Temporary backward compatibility (safe)
    videoName: {
      type: String,
      default: null,
    },

    photosCount: {
      type: Number,
      default: 0,
    },

    /* ================= CONTACT ================= */
    mobile: String,
    ownerEmail: String,
    ownerName: String,
    dealerEmail: String,
    dealerName: String,

    /* ================= STATUS SYSTEM ================= */
    status: {
      type: String,
      enum: ["pending", "live", "blocked", "sold", "rented"],
      default: "pending",
    },

    verified: {
      type: Boolean,
      default: false,
    },

    approvedBy: String,
    approvedAt: Date,
    blockedReason: String,

    /* ================= SYSTEM FLAGS ================= */
    isDeleted: {
      type: Boolean,
      default: false,
    },

    availability: {
      type: Boolean,
      default: true,
    },

    views: {
      type: Number,
      default: 0,
    },

    enquiries: {
      type: Number,
      default: 0,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isPremium: {
      type: Boolean,
      default: false,
    },

    /* ================= COMMERCIAL EXTRA ================= */
    commercial: {
      builtUp: String,
      carpet: String,
      frontage: String,
      floorLevel: String,
      parkingCapacity: String,
    },

    /* ================= HOTEL EXTRA ================= */
    hotel: {
      hotelType: String,
      rooms: String,
      starMin: String,
      starMax: String,
      banquet: Boolean,
      lawn: Boolean,
      peopleCapacity: String,
      restaurant: Boolean,
      bar: Boolean,
      swimmingPool: Boolean,
    },

    /* ================= AUDIT ================= */
    updatedByAdmin: Boolean,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Property ||
  mongoose.model("Property", PropertySchema);