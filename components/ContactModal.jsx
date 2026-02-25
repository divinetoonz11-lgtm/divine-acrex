import React, { useState } from "react";

export default function ContactModal({
  open,
  onClose,
  propertyId,
  onContactRevealed,
}) {
  if (!open) return null;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [contactNumber, setContactNumber] = useState(null);

  const submitLead = async () => {
    setError("");

    if (!name || !email || !phone) {
      setError("Name, Email and Phone are required");
      return;
    }
    if (!agree) {
      setError("Please accept Terms & Privacy");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/leads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId,
          name,
          email,
          phone,
          message,
          source: "PROPERTY_VIEW",
        }),
      });

      const json = await res.json();

      if (json?.contactNumber) {
        setContactNumber(json.contactNumber);
        onContactRevealed && onContactRevealed(json.contactNumber);
      } else if (json?.requireSubscription) {
        window.location.href = "/subscription";
      } else {
        setError(json?.message || "Unable to fetch contact details");
      }
    } catch {
      setError("Network error. Try again.");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          background: "#fff",
          width: 440,
          maxWidth: "100%",
          borderRadius: 8,
          padding: 18,
        }}
      >
        <div style={{ marginBottom: 10 }}>
          <h3 style={{ margin: 0 }}>
            You are requesting to view advertiser details
          </h3>
          <p style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
            Your details will be shared with the advertiser only.
          </p>
        </div>

        {!contactNumber ? (
          <>
            <label style={{ display: "block", marginBottom: 8 }}>
              Name*
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
              />
            </label>

            <label style={{ display: "block", marginBottom: 8 }}>
              Email*
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
            </label>

            <label style={{ display: "block", marginBottom: 8 }}>
              Phone*
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={inputStyle}
              />
            </label>

            <label style={{ display: "block", marginBottom: 8 }}>
              Message (optional)
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ ...inputStyle, height: 70 }}
              />
            </label>

            <label
              style={{
                display: "flex",
                gap: 8,
                fontSize: 13,
                marginBottom: 10,
              }}
            >
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              I agree to Terms & Privacy Policy
            </label>

            {error && (
              <div style={{ color: "#b91c1c", marginBottom: 8 }}>
                {error}
              </div>
            )}

            <button
              onClick={submitLead}
              disabled={loading}
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "#1f6feb",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {loading ? "Please wait…" : "Submit"}
            </button>
          </>
        ) : (
          <>
            <div style={{ textAlign: "center", marginTop: 10 }}>
              <div style={{ fontSize: 14, color: "#16a34a" }}>
                Contact details unlocked
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  marginTop: 8,
                }}
              >
                {contactNumber}
              </div>

              <div style={{ marginTop: 12, fontSize: 13 }}>
                Was your call helpful?
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button style={feedbackBtn}>Yes</button>
                <button style={feedbackBtn}>No</button>
                <button style={feedbackBtn}>Didn’t pickup</button>
              </div>
            </div>
          </>
        )}

        <button
          onClick={onClose}
          style={{
            marginTop: 14,
            background: "transparent",
            border: "none",
            color: "#555",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: 8,
  marginTop: 4,
  borderRadius: 4,
  border: "1px solid #ccc",
  fontSize: 14,
};

const feedbackBtn = {
  flex: 1,
  padding: "6px 8px",
  borderRadius: 4,
  border: "1px solid #ddd",
  background: "#f9fafb",
  cursor: "pointer",
};
