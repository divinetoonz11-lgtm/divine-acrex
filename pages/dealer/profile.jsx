import React, { useEffect, useState } from "react";

/*
DEALER PROFILE – FINAL (API CONNECTED)
✔ Admin-approved profile auto-fill
✔ Editable fields only
✔ Mobile mandatory
✔ GET + POST API integrated
*/

export default function DealerProfile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    businessName: "",
    address: "",
    pan: "",
    gst: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    fetch("/api/dealer/profile")
      .then((r) => r.json())
      .then((j) => {
        if (j?.ok && j.profile) {
          setForm({
            name: j.profile.name || "",
            email: j.profile.email || "",
            mobile: j.profile.mobile || "",
            businessName: j.profile.businessName || "",
            address: j.profile.address || "",
            pan: j.profile.pan || "",
            gst: j.profile.gst || "",
          });
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load profile");
        setLoading(false);
      });
  }, []);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= SAVE PROFILE ================= */
  const onSubmit = async () => {
    setError("");
    setSuccess("");

    if (!form.mobile || form.mobile.length < 10) {
      setError("Mobile number is mandatory");
      return;
    }

    const res = await fetch("/api/dealer/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const json = await res.json();

    if (!json.ok) {
      setError(json.message || "Failed to save profile");
      return;
    }

    setSuccess("Profile updated successfully");
  };

  if (loading) {
    return <div style={box}>Loading profile…</div>;
  }

  return (
    <div style={box}>
      <h2 style={title}>Dealer Profile</h2>

      {/* BASIC (READ-ONLY) */}
      <div style={section}>Basic Details</div>

      <input style={inpDisabled} value={form.name} disabled />
      <input style={inpDisabled} value={form.email} disabled />

      {/* CONTACT */}
      <div style={section}>Contact</div>

      <input
        style={inp}
        name="mobile"
        placeholder="Mobile Number *"
        value={form.mobile}
        onChange={onChange}
        required
      />

      {/* BUSINESS */}
      <div style={section}>Business Details</div>

      <input
        style={inp}
        name="businessName"
        placeholder="Business Name"
        value={form.businessName}
        onChange={onChange}
      />

      <textarea
        style={{ ...inp, height: 70 }}
        name="address"
        placeholder="Business Address"
        value={form.address}
        onChange={onChange}
      />

      {/* TAX */}
      <div style={section}>Tax Details</div>

      <input
        style={inp}
        name="pan"
        placeholder="PAN Card Number"
        value={form.pan}
        onChange={onChange}
      />

      <input
        style={inp}
        name="gst"
        placeholder="GST Number (optional)"
        value={form.gst}
        onChange={onChange}
      />

      {error && <div style={errorBox}>{error}</div>}
      {success && <div style={successBox}>{success}</div>}

      <button style={btn} onClick={onSubmit}>
        Save Profile
      </button>
    </div>
  );
}

/* ================= STYLES (UNCHANGED) ================= */

const box = {
  maxWidth: 520,
  background: "#f0f5ff",
  padding: 24,
  borderRadius: 16,
  boxShadow: "0 12px 30px rgba(30,78,216,.15)",
};

const title = {
  color: "#0a2a5e",
  marginBottom: 14,
};

const section = {
  marginTop: 18,
  marginBottom: 8,
  fontWeight: 700,
  fontSize: 13,
  color: "#334155",
};

const inp = {
  width: "100%",
  padding: "12px 14px",
  marginBottom: 12,
  borderRadius: 10,
  border: "1px solid #c7d2fe",
  fontSize: 14,
};

const inpDisabled = {
  ...inp,
  background: "#e8eefc",
};

const btn = {
  width: "100%",
  padding: 14,
  background: "linear-gradient(135deg,#1e4ed8,#2563eb)",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  fontWeight: 800,
  cursor: "pointer",
};

const errorBox = {
  background: "#fee2e2",
  color: "#991b1b",
  padding: 10,
  borderRadius: 8,
  marginBottom: 10,
};

const successBox = {
  background: "#dcfce7",
  color: "#166534",
  padding: 10,
  borderRadius: 8,
  marginBottom: 10,
};
