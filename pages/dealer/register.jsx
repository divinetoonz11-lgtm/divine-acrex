// pages/dealer/register.jsx
import { useState } from "react";
import { useRouter } from "next/router";

/* ================= LOCATION DATA ================= */

const STATES = {
  India: [
    "Delhi","Maharashtra","Uttar Pradesh","Haryana","Karnataka",
    "Tamil Nadu","Madhya Pradesh","Rajasthan","Gujarat","Punjab",
    "West Bengal","Kerala","Telangana",
  ],
  UAE: ["Dubai","Abu Dhabi","Sharjah","Ajman"],
};

const UAE_CITIES = {
  Dubai: ["Dubai"],
  "Abu Dhabi": ["Abu Dhabi","Al Ain"],
  Sharjah: ["Sharjah"],
  Ajman: ["Ajman"],
};

export default function DealerRegister() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    country: "India",
    state: "",
    city: "",
    address: "",
    pincode: "",
    countryCode: "+91",
    mobile: "",
    company: "",
    reraNumber: "",
    dealerType: "",
    referralCode: "",
    idProofType: "",
    addressProofType: "",
    agreed: false,
  });

  const [idProofFile, setIdProofFile] = useState(null);
  const [addressProofFile, setAddressProofFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.agreed) return alert("Please accept Terms & Conditions");
    if (!form.email) return alert("Email is required");
    if (form.country === "India" && !form.pincode)
      return alert("PIN Code is required for India");

    // 🔴 IMPORTANT FIX: JSON SEND (backend compatible)
    const res = await fetch("/api/dealer/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err.message || "Submission failed. Please try again later.");
      return;
    }

    setSubmitted(true);
  }

  /* ================= SUCCESS ================= */

  if (submitted) {
    return (
      <div style={wrap}>
        <h2 style={title}>✅ Dealer Application Submitted</h2>

        <div style={noteBox}>
          ⏳ <b>Verification & admin approval</b> usually takes{" "}
          <b>24–48 business hours</b>.<br /><br />

          📧 Status update will be sent to your registered email.<br /><br />

          🔐 After approval, you will receive an email to
          <b> set your username & password</b>.<br /><br />

          📞 Need help? Contact us anytime:
          <br />
          📧 <b>divinetoonz11@gmail.com</b>
          <br />
          📱 <b>9867402515</b>
        </div>

        <button style={btn} onClick={() => router.replace("/")}>
          Go to Home
        </button>
      </div>
    );
  }

  /* ================= FORM ================= */

  return (
    <div style={wrap}>
      <h2 style={title}>Become a Dealer</h2>
      <p style={sub}>India & UAE onboarding</p>

      <div style={noteBox}>
        <b>Important Information:</b><br /><br />
        1️⃣ This is a <b>dealer request form</b>. Submission does not guarantee approval.<br /><br />
        2️⃣ <b>Admin verification</b> takes 24–48 working hours.<br /><br />
        3️⃣ Username & password will be created <b>only after approval</b> via email.<br /><br />
        4️⃣ If you face any problem during submission, contact us directly:<br />
        📧 <b>divinetoonz11@gmail.com</b><br />
        📱 <b>9867402515</b>
      </div>

      <form onSubmit={handleSubmit} style={formBox}>
        <input name="name" placeholder="Full Name" required onChange={handleChange} style={input} />
        <input name="email" placeholder="Email (Gmail preferred)" required onChange={handleChange} style={input} />

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

        {form.country === "India" ? (
          <input name="city" placeholder="City" required onChange={handleChange} style={input} />
        ) : (
          <select name="city" value={form.city} onChange={handleChange} required style={input}>
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
          <input name="pincode" placeholder="PIN Code" required onChange={handleChange} style={input} />
        )}

        <input name="mobile" placeholder="Mobile Number" required onChange={handleChange} style={input} />
        <input name="company" placeholder="Company / Firm Name" required onChange={handleChange} style={input} />
        <input name="reraNumber" placeholder="RERA Registration Number" onChange={handleChange} style={input} />
        <select name="dealerType" required onChange={handleChange} style={input}>
          <option value="">Dealer Type</option>
          <option value="Individual">Individual</option>
          <option value="Agency">Agency</option>
          <option value="Builder">Builder</option>
        </select>

        <input name="referralCode" placeholder="Referral Code (optional)" onChange={handleChange} style={input} />

        <select name="idProofType" onChange={handleChange} style={input}>
          <option value="">Select ID Proof (optional)</option>
          <option value="Aadhaar">Aadhaar</option>
          <option value="Passport">Passport</option>
          <option value="Driving License">Driving License</option>
        </select>

        <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => setIdProofFile(e.target.files[0])} style={input} />

        <select name="addressProofType" onChange={handleChange} style={input}>
          <option value="">Select Address Proof (optional)</option>
          <option value="Aadhaar">Aadhaar</option>
          <option value="Passport">Passport</option>
          <option value="Utility Bill">Utility Bill</option>
        </select>

        <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => setAddressProofFile(e.target.files[0])} style={input} />

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

const wrap = { maxWidth: 760, margin: "auto", padding: 24, background: "#f8fbff" };
const title = { textAlign: "center", fontWeight: 900 };
const sub = { textAlign: "center", fontSize: 13 };
const formBox = { display: "flex", flexDirection: "column", gap: 12 };
const input = { padding: 12, borderRadius: 12, border: "1px solid #c7d2fe" };
const agree = { fontSize: 13, display: "flex", gap: 8 };
const btn = { padding: 14, borderRadius: 14, background: "#2563eb", color: "#fff", fontWeight: 800, border: "none" };
const noteBox = { padding: 14, background: "#eef2ff", borderRadius: 14, fontSize: 13 };
