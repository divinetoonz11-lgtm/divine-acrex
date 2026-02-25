import React, { useEffect, useState } from "react";

export default function DealerProfile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    company: "",
    address: "",
    pan: "",
    gst: "",
    reraNumber: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/dealer/profile")
      .then((r) => r.json())
      .then((j) => {
        if (j?.ok && j.profile) {
          setForm({
            name: j.profile.name || "",
            email: j.profile.email || "",
            mobile: j.profile.mobile || "",
            company: j.profile.company || "",
            address: j.profile.address || "",
            pan: j.profile.panNumber || "",
            gst: j.profile.gstNumber || "",
            reraNumber: j.profile.reraNumber || "",
          });
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load profile");
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={box}>Loading profile…</div>;

  return (
    <div style={box}>
      <h2 style={title}>Dealer Profile (Admin Approved)</h2>

      <div style={section}>Basic Details</div>
      <input style={inpDisabled} value={form.name} disabled />
      <input style={inpDisabled} value={form.email} disabled />

      <div style={section}>Contact</div>
      <input style={inpDisabled} value={form.mobile} disabled />

      <div style={section}>Business Details</div>
      <input style={inpDisabled} value={form.company} disabled />
      <textarea style={{ ...inpDisabled, height: 70 }} value={form.address} disabled />

      <div style={section}>Tax Details</div>
      <input style={inpDisabled} value={form.pan} disabled />
      <input style={inpDisabled} value={form.gst} disabled />

      <div style={section}>RERA Registration</div>
      <input style={inpDisabled} value={form.reraNumber} disabled />

      {error && <div style={errorBox}>{error}</div>}
    </div>
  );
}

const box = {
  maxWidth: 520,
  background: "#f0f5ff",
  padding: 24,
  borderRadius: 16,
  boxShadow: "0 12px 30px rgba(30,78,216,.15)",
};

const title = { color: "#0a2a5e", marginBottom: 14 };

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

const inpDisabled = { ...inp, background: "#e8eefc" };

const errorBox = {
  background: "#fee2e2",
  color: "#991b1b",
  padding: 10,
  borderRadius: 8,
  marginBottom: 10,
};