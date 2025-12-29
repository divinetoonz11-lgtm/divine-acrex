import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";

export default function LoginModal({ open, onClose }) {
  const [step, setStep] = useState("role");
  const [role, setRole] = useState("");
  const [agree, setAgree] = useState(false);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [serverOtp, setServerOtp] = useState("");

  useEffect(() => {
    if (!open) {
      setStep("role");
      setRole("");
      setAgree(false);
      setPhone("");
      setOtp("");
      setServerOtp("");
    }
  }, [open]);

  if (!open) return null;

  const selectRole = (r) => {
    setRole(r);
    setStep("form");
  };

  /* ================= GOOGLE LOGIN ================= */
  const googleLogin = async () => {
    if (!role) return alert("Select User or Dealer");
    if (!agree) return alert("Accept Terms");

    // Step-1: Google login (auth only)
    const res = await signIn("google", {
      callbackUrl: "/auth/redirect",
    });

    // Step-2: role set API hit (MAIN LOGIC)
    if (res !== undefined) {
      await fetch(
        role === "dealer" ? "/api/set-dealer" : "/api/set-user",
        { method: "POST" }
      );
    }
  };

  /* ================= OTP (AS-IS / FUTURE) ================= */
  const sendOtp = async () => {
    if (!role) return alert("Select User or Dealer");
    if (!agree) return alert("Accept Terms");
    if (phone.length !== 10) return alert("Invalid phone");

    const res = await fetch("/api/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    const data = await res.json();
    if (!data.ok) return alert("OTP failed");

    setServerOtp(data.otp);
    setOtp(data.otp);
    setStep("otp");
  };

  const verifyOtp = async () => {
    const login = await signIn("credentials", {
      phone,
      otp,
      redirect: false,
    });

    if (!login?.ok) return alert("Login failed");

    await fetch(
      role === "dealer" ? "/api/set-dealer" : "/api/set-user",
      { method: "POST" }
    );

    window.location.href =
      role === "dealer" ? "/dealer/dashboard" : "/user/dashboard";
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={box} onClick={(e) => e.stopPropagation()}>
        <button style={close} onClick={onClose}>✕</button>

        {step === "role" && (
          <>
            <h2 style={title}>Select Account Type</h2>
            <button style={roleBtn} onClick={() => selectRole("user")}>
              Login as User
            </button>
            <button style={roleBtnAlt} onClick={() => selectRole("dealer")}>
              Login as Dealer
            </button>
          </>
        )}

        {step === "form" && (
          <>
            <h2 style={title}>
              {role === "dealer" ? "Dealer Login" : "User Login"}
            </h2>

            <button style={googleBtn} onClick={googleLogin}>
              Continue with Google
            </button>

            <div style={orLine}>OR</div>

            <input
              placeholder="Mobile Number"
              value={phone}
              maxLength={10}
              onChange={(e) =>
                setPhone(e.target.value.replace(/[^0-9]/g, ""))
              }
              style={input}
            />

            <button style={btn} onClick={sendOtp}>Send OTP</button>

            <label style={agreeBox}>
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <span>I agree to Terms & Conditions</span>
            </label>
          </>
        )}

        {step === "otp" && (
          <>
            <h2 style={title}>Verify OTP</h2>

            <input
              placeholder="Enter OTP"
              value={otp}
              maxLength={6}
              onChange={(e) =>
                setOtp(e.target.value.replace(/[^0-9]/g, ""))
              }
              style={inputOtp}
            />

            {serverOtp && <div style={otpBox}>OTP: {serverOtp}</div>}

            <button style={btn} onClick={verifyOtp}>
              Verify & Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ===== STYLES (UNCHANGED) ===== */
const overlay = { position:"fixed", inset:0, background:"rgba(0,0,0,.55)", display:"flex", justifyContent:"center", alignItems:"center", zIndex:9999 };
const box = { width:420, background:"#fff", padding:24, borderRadius:14, position:"relative" };
const close = { position:"absolute", top:10, right:12, background:"transparent", border:"none", fontSize:22 };
const title = { textAlign:"center", marginBottom:18, fontWeight:800 };
const roleBtn = { width:"100%", padding:14, marginTop:12, borderRadius:10, background:"#315DFF", color:"#fff", border:"none" };
const roleBtnAlt = { ...roleBtn, background:"#0A2E6F" };
const googleBtn = { width:"100%", padding:12, borderRadius:8, border:"1px solid #ddd" };
const orLine = { textAlign:"center", margin:"14px 0", color:"#777" };
const input = { width:"100%", padding:12, borderRadius:8, border:"1px solid #ddd", marginBottom:10 };
const inputOtp = { ...input, textAlign:"center", letterSpacing:6, fontSize:18, fontWeight:700 };
const btn = { width:"100%", padding:12, background:"#315DFF", color:"#fff", border:"none", borderRadius:8 };
const agreeBox = { display:"flex", gap:8, fontSize:13, marginTop:12 };
const otpBox = { marginTop:10, padding:8, background:"#E8F0FF", borderRadius:6, textAlign:"center", fontWeight:800 };
