// pages/dealer/register.jsx
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

/* ================= LOCATION DATA ================= */

const STATES = {
  India: [
    "Delhi",
    "Maharashtra",
    "Uttar Pradesh",
    "Haryana",
    "Karnataka",
    "Tamil Nadu",
    "Madhya Pradesh",
    "Rajasthan",
    "Gujarat",
    "Punjab",
    "West Bengal",
    "Kerala",
    "Telangana",
  ],
  UAE: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman"],
};

const UAE_CITIES = {
  Dubai: ["Dubai"],
  "Abu Dhabi": ["Abu Dhabi", "Al Ain"],
  Sharjah: ["Sharjah"],
  Ajman: ["Ajman"],
};

export default function DealerRegister() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    country: "India",
    state: "",
    city: "",
    address: "",
    pincode: "",
    countryCode: "+91",
    mobile: "",
    company: "",
    dealerType: "",
    referralCode: "",
    idProofType: "",
    addressProofType: "",
    agreed: false,
  });

  const [documentFile, setDocumentFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  if (status !== "authenticated") return null;

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.agreed) {
      alert("Please accept Terms & Conditions");
      return;
    }

    if (form.country === "India" && !form.pincode) {
      alert("PIN Code is required for India");
      return;
    }

    if (!documentFile) {
      alert("Please upload ID / Address Proof document");
      return;
    }

    const fd = new FormData();
    fd.append("email", session.user.email);
    Object.keys(form).forEach((k) => fd.append(k, form[k]));
    fd.append("document", documentFile);

    await fetch("/api/dealer/request", {
      method: "POST",
      body: fd,
    });

    setSubmitted(true);
  }

  /* ================= SUCCESS SCREEN ================= */

  if (submitted) {
    return (
      <div style={wrap}>
        <h2 style={title}>✅ Dealer Application Submitted</h2>

        <div style={noteBox}>
          ⏳ Dealer verification & admin approval usually takes{" "}
          <b>24–48 business hours</b>.<br /><br />

          📧 Approval / rejection confirmation will be sent to your registered
          Gmail ID.<br /><br />

          🔐 After approval, your <b>Dealer Dashboard</b> will be activated
          automatically.<br />
          You can login using your registered email.<br /><br />

          💡 For best experience, please use <b>Google Chrome</b>.
        </div>

        <button style={btn} onClick={() => router.replace("/user/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  /* ================= FORM ================= */

  return (
    <div style={wrap}>
      <h2 style={title}>Become a Dealer</h2>
      <p style={sub}>India & UAE onboarding</p>

      {/* ===== IMPORTANT NOTES (VISIBLE BEFORE SUBMIT) ===== */}
      <div style={noteBox}>
        ⏳ <b>Dealer verification & admin approval</b> takes{" "}
        <b>24–48 business hours</b>.<br /><br />

        🆔 <b>ID Proof / Address Proof</b> accepted:
        Aadhaar, Passport, Driving License, Utility Bill.<br /><br />

        📧 Status update will be sent on your registered Gmail.<br /><br />

        💡 Recommended browser: <b>Google Chrome</b>.<br /><br />

        ⚠️ If you face any issue during submission, contact:<br />
        📩 <b>divinetoonz11@gmail.com</b><br />
        📱 WhatsApp: <b>+91 9867402515</b>
      </div>

      <form onSubmit={handleSubmit} style={formBox}>
        <input
          name="name"
          placeholder="Full Name"
          required
          onChange={handleChange}
          style={input}
        />

        <input value={session.user.email} disabled style={input} />

        <select
          name="country"
          value={form.country}
          onChange={handleChange}
          style={input}
        >
          <option value="India">India</option>
          <option value="UAE">United Arab Emirates</option>
        </select>

        <select
          name="state"
          value={form.state}
          onChange={handleChange}
          required
          style={input}
        >
          <option value="">Select State</option>
          {STATES[form.country].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {form.country === "India" ? (
          <input
            name="city"
            placeholder="City"
            required
            onChange={handleChange}
            style={input}
          />
        ) : (
          <select
            name="city"
            value={form.city}
            onChange={handleChange}
            required
            style={input}
          >
            <option value="">Select City</option>
            {(UAE_CITIES[form.state] || []).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        )}

        <textarea
          name="address"
          placeholder="Complete Address"
          required
          onChange={handleChange}
          style={{ ...input, height: 80 }}
        />

        {form.country === "India" && (
          <input
            name="pincode"
            placeholder="PIN Code"
            required
            onChange={handleChange}
            style={input}
          />
        )}

        <div style={{ display: "flex", gap: 8 }}>
          <select
            name="countryCode"
            value={form.countryCode}
            onChange={handleChange}
            style={{ ...input, width: "35%" }}
          >
            <option value="+91">🇮🇳 +91</option>
            <option value="+971">🇦🇪 +971</option>
          </select>

          <input
            name="mobile"
            placeholder="Mobile Number"
            required
            onChange={handleChange}
            style={input}
          />
        </div>

        <input
          name="company"
          placeholder="Company / Firm Name"
          required
          onChange={handleChange}
          style={input}
        />

        <select
          name="dealerType"
          required
          onChange={handleChange}
          style={input}
        >
          <option value="">Dealer Type</option>
          <option value="Individual">Individual</option>
          <option value="Agency">Agency</option>
          <option value="Builder">Builder</option>
        </select>

        <input
          name="referralCode"
          placeholder="Referral Code (optional)"
          onChange={handleChange}
          style={input}
        />

        <select
          name="idProofType"
          required
          onChange={handleChange}
          style={input}
        >
          <option value="">Select ID Proof</option>
          <option value="Aadhaar">Aadhaar</option>
          <option value="Passport">Passport</option>
          <option value="Driving License">Driving License</option>
        </select>

        <select
          name="addressProofType"
          required
          onChange={handleChange}
          style={input}
        >
          <option value="">Select Address Proof</option>
          <option value="Aadhaar">Aadhaar</option>
          <option value="Passport">Passport</option>
          <option value="Utility Bill">Utility Bill</option>
        </select>

        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) => setDocumentFile(e.target.files[0])}
          style={input}
        />

        <label style={agree}>
          <input type="checkbox" name="agreed" onChange={handleChange} />
          <span>
            I agree to{" "}
            <a href="/terms" target="_blank"><b>Terms & Conditions</b></a>
          </span>
        </label>

        <button type="submit" style={btn}>
          Submit Dealer Application
        </button>
      </form>
    </div>
  );
}

/* ================= STYLES ================= */

const wrap = {
  maxWidth: 760,
  margin: "auto",
  padding: 24,
  background: "#f8fbff",
};

const title = { textAlign: "center", fontWeight: 900 };
const sub = { textAlign: "center", fontSize: 13 };

const formBox = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const input = {
  padding: 12,
  borderRadius: 12,
  border: "1px solid #c7d2fe",
};

const agree = { fontSize: 13, display: "flex", gap: 8 };

const btn = {
  padding: 14,
  borderRadius: 14,
  background: "#2563eb",
  color: "#fff",
  fontWeight: 800,
  border: "none",
};

const noteBox = {
  padding: 14,
  background: "#eef2ff",
  borderRadius: 14,
  fontSize: 13,
};
