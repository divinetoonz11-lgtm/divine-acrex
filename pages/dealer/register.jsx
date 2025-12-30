import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

/* ================= LOCATION DATA ================= */

const STATES = {
  "India": [
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
    "Telangana"
  ],
  "UAE": [
    "Dubai",
    "Abu Dhabi",
    "Sharjah",
    "Ajman"
  ]
};

const CITIES = {
  "Delhi": ["New Delhi"],

  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],

  "Uttar Pradesh": [
    "Noida",
    "Greater Noida",
    "Lucknow",
    "Kanpur",
    "Agra",
    "Varanasi"
  ],

  "Haryana": ["Gurgaon", "Faridabad", "Panipat"],

  "Karnataka": ["Bengaluru", "Mysuru", "Hubli"],

  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],

  "Madhya Pradesh": ["Indore", "Bhopal", "Gwalior"],

  "Rajasthan": ["Jaipur", "Udaipur", "Jodhpur"],

  "Gujarat": ["Ahmedabad", "Surat", "Vadodara"],

  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar"],

  "West Bengal": ["Kolkata", "Howrah", "Durgapur"],

  "Kerala": ["Kochi", "Trivandrum", "Kozhikode"],

  "Telangana": ["Hyderabad", "Warangal"],

  "Dubai": ["Dubai"],
  "Abu Dhabi": ["Abu Dhabi", "Al Ain"],
  "Sharjah": ["Sharjah"],
  "Ajman": ["Ajman"]
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
    idProofType: "",
    addressProofType: "",
    agreed: false,
  });

  const [documentFile, setDocumentFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // 🔐 Login required (as per your flow)
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

    const fd = new FormData();
    fd.append("email", session.user.email);

    Object.keys(form).forEach((k) => {
      fd.append(k, form[k]);
    });

    if (documentFile) {
      fd.append("document", documentFile);
    }

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
          ⏳ Dealer verification & admin approval takes <b>24–48 business hours</b>.
          <br /><br />
          📧 Approval / rejection mail will be sent to your registered Gmail.
          <br /><br />
          🔐 Dealer dashboard access unlocks only after approval.
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
      <p style={sub}>International onboarding • India & UAE</p>

      <form onSubmit={handleSubmit} style={formBox}>
        <input
          name="name"
          placeholder="Full Name"
          required
          onChange={handleChange}
          style={input}
        />

        <input value={session.user.email} disabled style={input} />

        <select name="country" value={form.country} onChange={handleChange} style={input}>
          <option value="India">India</option>
          <option value="UAE">United Arab Emirates</option>
        </select>

        <select name="state" value={form.state} onChange={handleChange} required style={input}>
          <option value="">Select State</option>
          {STATES[form.country].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select name="city" value={form.city} onChange={handleChange} required style={input}>
          <option value="">Select City</option>
          {(CITIES[form.state] || []).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

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

        <select name="dealerType" required onChange={handleChange} style={input}>
          <option value="">Dealer Type</option>
          <option value="Individual">Individual</option>
          <option value="Agency">Agency</option>
          <option value="Builder">Builder</option>
        </select>

        <select name="experience" onChange={handleChange} style={input}>
          <option value="">Experience</option>
          <option value="0–1 Years">0–1 Years</option>
          <option value="1–3 Years">1–3 Years</option>
          <option value="3–5 Years">3–5 Years</option>
          <option value="5+ Years">5+ Years</option>
        </select>

        <input
          name="referralCode"
          placeholder="Referral Code (optional)"
          onChange={handleChange}
          style={input}
        />

        <select name="idProofType" onChange={handleChange} style={input}>
          <option value="">ID Proof</option>
          <option value="Aadhaar">Aadhaar</option>
          <option value="Passport">Passport</option>
          <option value="Driving License">Driving License</option>
        </select>

        <select name="addressProofType" onChange={handleChange} style={input}>
          <option value="">Address Proof</option>
          <option value="Aadhaar">Aadhaar</option>
          <option value="Passport">Passport</option>
          <option value="Utility Bill">Utility Bill</option>
        </select>

        <input
          type="file"
          onChange={(e) => setDocumentFile(e.target.files[0])}
          style={input}
        />

        <div style={noteBox}>
          ⏳ Dealer approval usually takes <b>24–48 business hours</b>.
          <br />
          📧 Confirmation will be sent on registered Gmail.
        </div>

        <label style={agree}>
          <input type="checkbox" name="agreed" onChange={handleChange} />
          <span>
            I agree to the{" "}
            <a href="/terms" target="_blank" style={{ color: "#1e40af", fontWeight: 700 }}>
              Terms & Conditions
            </a>
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
  background: "linear-gradient(180deg,#f8fbff,#eef2ff)",
};

const title = { textAlign: "center", fontWeight: 900, color: "#0a2458" };
const sub = { textAlign: "center", fontSize: 13, color: "#475569" };

const formBox = { display: "flex", flexDirection: "column", gap: 12 };

const input = {
  padding: 12,
  borderRadius: 12,
  border: "1px solid #c7d2fe",
  fontSize: 14,
};

const agree = { fontSize: 13, display: "flex", gap: 8 };

const btn = {
  marginTop: 14,
  padding: "14px",
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
