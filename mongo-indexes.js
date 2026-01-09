/* =====================================================
   DIVINE ACRES – MONGODB PRODUCTION INDEXES
   SAFE FOR 10 LAKH+ USERS
===================================================== */

/* ================= PROPERTIES COLLECTION ================= */

// USER + DEALER MY PROPERTIES
db.properties.createIndex({
  ownerEmail: 1,
  isDeleted: 1,
  createdAt: -1
});

// DEALER ONLY FILTER
db.properties.createIndex({
  ownerEmail: 1,
  postedBy: 1,
  isDeleted: 1,
  createdAt: -1
});

// ADMIN APPROVAL / STATUS
db.properties.createIndex({
  status: 1,
  createdAt: -1
});

// LIVE LISTINGS (PUBLIC SITE)
db.properties.createIndex({
  isLive: 1,
  status: 1,
  createdAt: -1
});

// CITY SEARCH
db.properties.createIndex({
  city: 1,
  isLive: 1
});

// CATEGORY + PROPERTY TYPE
db.properties.createIndex({
  category: 1,
  propertyType: 1,
  isLive: 1
});

// PRICE SORT / FILTER
db.properties.createIndex({
  price: 1,
  isLive: 1
});

// VERIFICATION STATUS
db.properties.createIndex({
  verificationStatus: 1,
  isLive: 1
});

/* ================= USERS COLLECTION ================= */

// LOGIN / SESSION / UNIQUE EMAIL
db.users.createIndex(
  { email: 1 },
  { unique: true }
);

// DEALER APPROVAL + KYC (ADMIN PANEL)
db.users.createIndex({
  role: 1,
  dealerApproved: 1,
  kycStatus: 1
});

/* ================= OPTIONAL (DRAFT CLEANUP) ================= */
/* ⚠️ Sirf tab use kare jab drafts expire karne ho */

// db.properties.createIndex(
//   { createdAt: 1 },
//   { expireAfterSeconds: 60 * 60 * 24 * 180 }
// );

print("✅ ALL INDEXES CREATED SUCCESSFULLY");
