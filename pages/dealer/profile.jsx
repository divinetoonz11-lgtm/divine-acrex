import React, { useEffect, useState } from "react";

/*
DEALER PROFILE – FINAL
✔ Google login → auto name/email
✔ Phone login → auto mobile
✔ Mobile mandatory
✔ Business + PAN + GST + Address
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

  const [error, setError] = useState("");

  // 🔹 AUTO-FILL FROM SESSION (mock for now)
  useEffect(() => {
    /*
      👉 Yahan future me session se data aayega:
      session.user.name
      session.user.email
      session.user.phone
    */

    setForm((f) => ({
      ...f,
      name: "Auto Name (Google)",
      email: "auto@email.com",
      mobile: "9876543210", // phone login se
    }));
  }, []);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = () => {
    if (!form.mobile || form.mobile.length < 10) {
      setError("Mobile number is mandatory");
      return;
    }

    setError("");
    alert("Profile data ready to save (API connect next)");
  };

  return (
    <div style={box}>
      <h2 style={title}>Dealer Profile</h2>

      {/* BASIC (AUTO) */}
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

      <button style={btn} onClick={onSubmit}>
        Save Profile
      </button>
    </div>
  );
}

/* ================= STYLES ================= */

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
