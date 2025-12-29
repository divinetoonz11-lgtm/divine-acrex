import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

/* ================= LOCATION DATA ================= */

const STATES = {
  India: ["Delhi", "Maharashtra", "Uttar Pradesh", "Haryana"],
  UAE: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman"],
};

const CITIES = {
  Delhi: ["New Delhi"],
  Maharashtra: ["Mumbai", "Pune"],
  "Uttar Pradesh": ["Noida", "Lucknow"],
  Haryana: ["Gurgaon"],
  Dubai: ["Dubai"],
  "Abu Dhabi": ["Abu Dhabi"],
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
    countryCode: "+91",
    mobile: "",
    company: "",
    dealerType: "",
    experience: "",
    referralCode: "",
    username: "",
    password: "",
    confirmPassword: "",
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
      return alert("Please accept Terms & Conditions");
    }

    if (form.password && form.password !== form.confirmPassword) {
      return alert("Password & Confirm Password do not match");
    }

    const fd = new FormData();
    fd.append("email", session.user.email);
    Object.keys(form).forEach((k) => fd.append(k, form[k]));
    if (documentFile) fd.append("document", documentFile);

    await fetch("/api/dealer/request", {
      method: "POST",
      body: fd,
    });

    setSubmitted(true);
  }

  /* ================= SUCCESS ================= */

  if (submitted) {
    return (
      <div style={wrap}>
        <h2 style={title}>✅ Application Submitted</h2>

        <div style={noteBox}>
          ⏳ Dealer approval takes <b>24–48 business hours</b>.<br /><br />
          📧 You will receive confirmation on your registered email.<br /><br />
          🔐 After approval, login from <b>Dealer</b> tab using Google or
          Username & Password.
        </div>

        <button style={smallBtn} onClick={() => router.replace("/user/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  /* ================= FORM ================= */

  return (
    <div style={wrap}>
      <h2 style={title}>Become a Dealer</h2>
      <p style={sub}>International onboarding • India & UAE</p>

      <form onSubmit={handleSubmit} style={formBox}>
        <input name="name" placeholder="Full Name" required onChange={handleChange} style={input} />
        <input value={session.user.email} disabled style={input} />

        <select name="country" value={form.country} onChange={handleChange} style={input}>
          <option value="India">India</option>
          <option value="UAE">United Arab Emirates</option>
        </select>

        <select name="state" value={form.state} onChange={handleChange} required style={input}>
          <option value="">Select State</option>
          {STATES[form.country].map((s) => <option key={s}>{s}</option>)}
        </select>

        <select name="city" value={form.city} onChange={handleChange} required style={input}>
          <option value="">Select City</option>
          {(CITIES[form.state] || []).map((c) => <option key={c}>{c}</option>)}
        </select>

        <div style={{ display: "flex", gap: 8 }}>
          <select name="countryCode" value={form.countryCode} onChange={handleChange} style={{ ...input, width: "35%" }}>
            <option value="+91">🇮🇳 +91</option>
            <option value="+971">🇦🇪 +971</option>
          </select>
          <input name="mobile" placeholder="Mobile Number" required onChange={handleChange} style={input} />
        </div>

        <input name="company" placeholder="Company / Firm Name" required onChange={handleChange} style={input} />

        <select name="dealerType" required onChange={handleChange} style={input}>
          <option value="">Dealer Type</option>
          <option>Individual</option>
          <option>Agency</option>
          <option>Builder</option>
        </select>

        <select name="experience" onChange={handleChange} style={input}>
          <option value="">Experience</option>
          <option>0–1 Years</option>
          <option>1–3 Years</option>
          <option>3–5 Years</option>
          <option>5+ Years</option>
        </select>

        <input name="referralCode" placeholder="Referral Code (optional)" onChange={handleChange} style={input} />

        {/* ===== TERMS & CONDITIONS ===== */}
        <label style={agree}>
          <input type="checkbox" name="agreed" onChange={handleChange} />
          <span>
            I agree to the{" "}
            <a href="/terms" target="_blank" style={{ color: "#1e40af", fontWeight: 700 }}>
              Terms & Conditions
            </a>
          </span>
        </label>

        <div style={noteBox}>
          ⏳ Approval takes 24–48 hours.  
          📧 Email confirmation will be sent after approval.
        </div>

        <button type="submit" style={smallBtn}>
          Submit Application
        </button>
      </form>
    </div>
  );
}

/* ================= STYLES ================= */

const wrap = {
  maxWidth: 720,
  margin: "auto",
  padding: 20,
  background: "linear-gradient(180deg,#f8fbff,#eaf1ff)",
};

const title = { textAlign: "center", fontWeight: 900, color: "#0a2458" };
const sub = { textAlign: "center", fontSize: 13, color: "#475569" };
const formBox = { display: "flex", flexDirection: "column", gap: 10 };

const input = {
  padding: 12,
  borderRadius: 12,
  border: "1px solid #c7d2fe",
  fontSize: 14,
};

const agree = { fontSize: 13, display: "flex", gap: 8, marginTop: 10 };

const smallBtn = {
  marginTop: 12,
  padding: "12px 22px",
  borderRadius: 12,
  background: "#2563eb",
  color: "#fff",
  fontWeight: 800,
  border: "none",
};

const noteBox = {
  marginTop: 12,
  padding: 14,
  background: "#eef2ff",
  borderRadius: 14,
  fontSize: 13,
};
