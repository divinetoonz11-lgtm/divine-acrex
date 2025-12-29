// lib/ga.js
// ==========================================
// GOOGLE ANALYTICS 4 – SINGLE SOURCE FILE
// Public + Admin + SPA + Revenue Events
// ==========================================

// GA4 Measurement ID
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";

// ------------------------------------------
// PAGE VIEW (SPA SAFE)
// ------------------------------------------
export const pageview = (url) => {
  if (!GA_ID || typeof window === "undefined") return;

  window.gtag("config", GA_ID, {
    page_path: url,
    anonymize_ip: true,
  });
};

// ------------------------------------------
// GENERIC EVENT
// ------------------------------------------
export const event = ({ action, category, label, value }) => {
  if (!GA_ID || typeof window === "undefined") return;

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
};

// ------------------------------------------
// ADMIN EVENTS
// ------------------------------------------
export const adminClick = (label) =>
  event({
    action: "admin_click",
    category: "admin",
    label,
  });

// ------------------------------------------
// REVENUE EVENTS
// ------------------------------------------
export const paymentVerified = (amount) =>
  event({
    action: "payment_verified",
    category: "revenue",
    label: "payment",
    value: amount,
  });

export const subscriptionApproved = (plan) =>
  event({
    action: "subscription_approved",
    category: "revenue",
    label: plan,
  });

export const dealerPromoted = (dealerId) =>
  event({
    action: "dealer_promoted",
    category: "promotion",
    label: dealerId,
  });

// ------------------------------------------
// LEAD / PROPERTY EVENTS (FUTURE READY)
// ------------------------------------------
export const leadPurchased = (propertyId) =>
  event({
    action: "lead_purchased",
    category: "lead",
    label: propertyId,
  });

export const propertyFeatured = (propertyId) =>
  event({
    action: "property_featured",
    category: "property",
    label: propertyId,
  });
