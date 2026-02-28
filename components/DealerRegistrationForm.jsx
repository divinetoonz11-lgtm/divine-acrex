import { useState, useEffect } from "react";

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

export default function DealerRegistrationForm({
  initialData = {},
  adminMode = false,
  onSave,
  onSuccess,
}) {

  const [form, setForm] = useState({
    name: "",
    email: "",
    country: "India",
    state: "",
    city: "",
    address: "",
    pincode: "",
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

  /* ================= AUTO FILL ================= */
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setForm({
        name: initialData.name || "",
        email: initialData.email || "",
        country: initialData.country || "India",
        state: initialData.state || "",
        city: initialData.city || "",
        address: initialData.address || "",
        pincode: initialData.pincode || "",
        mobile: initialData.mobile || "",
        company: initialData.company || "",
        reraNumber: initialData.reraNumber || "",
        dealerType: initialData.dealerType || "",
        referralCode: initialData.referralCode || "",
        idProofType: initialData.idProofType || "",
        addressProofType: initialData.addressProofType || "",
        agreed: true,
      });
    }
  }, [initialData]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    /* ================= ADMIN MODE ================= */
    if (adminMode) {
      if (onSave) onSave(form);
      return;
    }

    if (!form.agreed) return alert("Please accept Terms & Conditions");

    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    if (idProofFile) formData.append("idProof", idProofFile);
    if (addressProofFile) formData.append("addressProof", addressProofFile);

    const res = await fetch("/api/dealer/request", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      alert("Submission failed");
      return;
    }

    if (onSuccess) onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} style={formBox}>

      <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required style={input}/>
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required style={input}/>

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
        <input name="city" value={form.city} onChange={handleChange} placeholder="City" required style={input}/>
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
        value={form.address}
        onChange={handleChange}
        placeholder="Complete Address"
        required
        style={{...input,height:80}}
      />

      {form.country === "India" && (
        <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="PIN Code" required style={input}/>
      )}

      <input name="mobile" value={form.mobile} onChange={handleChange} placeholder="Mobile Number" required style={input}/>
      <input name="company" value={form.company} onChange={handleChange} placeholder="Company / Firm Name" required style={input}/>
      <input name="reraNumber" value={form.reraNumber} onChange={handleChange} placeholder="RERA Registration Number" style={input}/>

      <select name="dealerType" value={form.dealerType} required onChange={handleChange} style={input}>
        <option value="">Dealer Type</option>
        <option value="Individual">Individual</option>
        <option value="Agency">Agency</option>
        <option value="Builder">Builder</option>
      </select>

      <input name="referralCode" value={form.referralCode} onChange={handleChange} placeholder="Referral Code (optional)" style={input}/>

      <select name="idProofType" value={form.idProofType} onChange={handleChange} style={input}>
        <option value="">Select ID Proof</option>
        <option value="Aadhaar">Aadhaar</option>
        <option value="Passport">Passport</option>
        <option value="Driving License">Driving License</option>
      </select>

      <input type="file" accept=".jpg,.jpeg,.png,.pdf"
        onChange={(e)=>setIdProofFile(e.target.files[0])}
        style={input}
      />

      <select name="addressProofType" value={form.addressProofType} onChange={handleChange} style={input}>
        <option value="">Select Address Proof</option>
        <option value="Aadhaar">Aadhaar</option>
        <option value="Passport">Passport</option>
        <option value="Utility Bill">Utility Bill</option>
      </select>

      <input type="file" accept=".jpg,.jpeg,.png,.pdf"
        onChange={(e)=>setAddressProofFile(e.target.files[0])}
        style={input}
      />

      {!adminMode && (
        <label style={{display:"flex",gap:8}}>
          <input type="checkbox" name="agreed" onChange={handleChange}/>
          I agree to Terms & Conditions
        </label>
      )}

      <button type="submit" style={btn}>
        {adminMode ? "Save Changes" : "Submit Dealer Application"}
      </button>
    </form>
  );
}

/* SAME UI */
const formBox = { display: "flex", flexDirection: "column", gap: 12 };
const input = { padding: 12, borderRadius: 12, border: "1px solid #c7d2fe" };
const btn = { padding: 14, borderRadius: 14, background: "#2563eb", color: "#fff", fontWeight: 800, border: "none" };