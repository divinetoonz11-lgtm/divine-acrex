import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";

import PropertyHero from "../../components/property/PropertyHero";
import PropertyFacts from "../../components/property/PropertyFacts";
import PropertyTabs from "../../components/property/PropertyTabs";
import PropertyStickyCTA from "../../components/property/PropertyStickyCTA";
import PropertyLightbox from "../../components/PropertyLightbox";

export default function PropertyViewPage() {
  const router = useRouter();
  const { id } = router.query;

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photosOpen, setPhotosOpen] = useState(false);

  const [showWarning, setShowWarning] = useState(false);
  const [showContactDetails, setShowContactDetails] = useState(false);

  const timerRef = useRef(null);

  /* ================= FETCH PROPERTY ================= */
  useEffect(() => {
    if (!id) return;

    fetch(`/api/properties/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json?.data) {
          setProperty(json.data);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  /* ================= BASIC INFO ================= */

  const isDealer = property?.postedBy === "Dealer";

  const contactLabel = isDealer
    ? "Posted By Dealer"
    : "Posted By Owner";

  const contactName = isDealer
    ? property?.dealerName || property?.dealerEmail
    : property?.ownerName || property?.ownerEmail;

  /* ================= VIEW NUMBER ================= */

  const handleViewContact = async () => {
    if (!property?.mobile) {
      alert("Contact number not available");
      return;
    }

    if (isDealer) {
      showContactWithWarning();
      return;
    }

    router.push(`/owner-contact-payment?id=${property._id}`);
  };

  const showContactWithWarning = () => {
    setShowWarning(true);

    timerRef.current = setTimeout(() => {
      setShowWarning(false);
      setShowContactDetails(true);
    }, 1500);
  };

  /* ================= WHATSAPP ================= */

  const handleWhatsApp = () => {
    if (!property?.mobile) return;

    const formatted = property.mobile.replace(/^0/, "91");
    window.open(`https://wa.me/${formatted}`, "_blank");
  };

  /* ================= CLEANUP ================= */

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  /* ================= STATES ================= */

  if (loading) return <div style={{ padding: 20 }}>Loading…</div>;
  if (!property) return <div style={{ padding: 20 }}>Property not found</div>;

  /* ================= UI ================= */

  return (
    <>
      <PropertyHero
        property={property}
        onViewPhotos={() => setPhotosOpen(true)}
        onViewContact={handleViewContact}
        onWhatsApp={handleWhatsApp}
      />

      <PropertyFacts
        property={property}
        contactLabel={contactLabel}
        contactName={contactName}
      />

      <PropertyTabs property={property} />
      <PropertyStickyCTA onContact={handleViewContact} />

      {photosOpen && (
        <PropertyLightbox
          open={photosOpen}
          onClose={() => setPhotosOpen(false)}
          property={property}
          onViewNumber={handleViewContact}
          isDealer={isDealer}
        />
      )}

      {/* SAFETY WARNING */}
      {showWarning && (
        <div style={overlay}>
          <div style={modal}>
            <h3 style={{ color: "#e11d48" }}>⚠️ Safety Warning</h3>
            <p>
              Never pay booking amount without visiting the property.
            </p>
          </div>
        </div>
      )}

      {/* CONTACT DETAILS */}
      {showContactDetails && (
        <div style={overlay}>
          <div style={modal}>
            <h3>
              {isDealer
                ? "Dealer Contact Details"
                : "Owner Contact Details"}
            </h3>

            <p style={{ marginTop: 15, fontWeight: 600 }}>
              {contactName || "Contact Person"}
            </p>

            <p style={{ fontSize: 18 }}>
              {property.mobile}
            </p>

            <button style={whatsappBtn} onClick={handleWhatsApp}>
              WhatsApp Now
            </button>

            <button
              style={closeBtn}
              onClick={() => setShowContactDetails(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ================= STYLES ================= */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 11000, // 🔥 FIXED (above lightbox 9999)
};

const modal = {
  background: "#fff",
  padding: 25,
  borderRadius: 10,
  width: 420,
  maxWidth: "95%",
  textAlign: "center",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
};

const whatsappBtn = {
  width: "100%",
  padding: 10,
  background: "#25D366",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  marginTop: 15,
  cursor: "pointer",
  fontWeight: 600,
};

const closeBtn = {
  width: "100%",
  padding: 10,
  background: "#f3f4f6",
  border: "1px solid #ddd",
  borderRadius: 6,
  marginTop: 10,
  cursor: "pointer",
};