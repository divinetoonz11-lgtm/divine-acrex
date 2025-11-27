import { useRouter } from "next/router";
import { useState } from "react";
import {
  signInWithGooglePopup,
  signInWithEmail,
  sendOtpToPhone,
  makeRecaptcha,
} from "../../utils/firebaseClient";

import { doc, setDoc } from "firebase/firestore";
import { db } from "../../utils/firebaseClient";

export default function DealerLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // ⭐ AUTO-SAVE ROLE FUNCTION (COMMON FOR ALL LOGIN TYPES)
  async function saveDealerRole(user) {
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          role: "dealer",
          email: user.email || null,
          phone: user.phoneNumber || null,
          name: user.displayName || null,
          photoURL: user.photoURL || null,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn("Could not save dealer role:", err);
    }
  }

  // ------------------------
  // EMAIL LOGIN
  // ------------------------
  const emailLogin = async (e) => {
    e.preventDefault();
    if (!email || !pass) return alert("Enter email & password");

    try {
      setLoading(true);
      const res = await signInWithEmail(email, pass);

      await saveDealerRole(res.user);

      localStorage.setItem("logged_in", "yes");
      localStorage.setItem("role", "dealer");
      localStorage.setItem("dealer_email", res.user.email);

      router.push("/dealer_dashboard");
    } catch (err) {
      alert("Login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------
  // GOOGLE LOGIN
  // ------------------------
  const googleLogin = async () => {
    try {
      setLoading(true);
      const res = await signInWithGooglePopup();

      await saveDealerRole(res.user);

      localStorage.setItem("logged_in", "yes");
      localStorage.setItem("role", "dealer");
      localStorage.setItem("dealer_email", res.user.email);

      router.push("/dealer_dashboard");
    } catch (err) {
      alert("Google login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------
  // SEND OTP
  // ------------------------
  const sendOtp = async () => {
    if (!phone) return alert("Enter phone like +91xxxxxxxxxx");

    try {
      setLoading(true);
      makeRecaptcha("recaptcha-container-dealer");
      const result = await sendOtpToPhone(phone, "recaptcha-container-dealer");
      window.__dealerOtp = result;
      setSent(true);
      alert("OTP sent");
    } catch (err) {
      alert("Failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------
  // VERIFY OTP
  // ------------------------
  const verifyOtp = async () => {
    try {
      setLoading(true);
      const res = await window.__dealerOtp.confirm(otp);

      await saveDealerRole(res.user);

      localStorage.setItem("logged_in", "yes");
      localStorage.setItem("role", "dealer");
      localStorage.setItem("dealer_phone", res.user.phoneNumber);

      router.push("/dealer_dashboard");
    } catch (err) {
      alert("OTP wrong");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------
  // UI STARTS
  // ------------------------
  return (
    <div style={box}>
      <h2 style={title}>Dealer Login</h2>

      <div style={{ display: "grid", gap: 14 }}>
        <form onSubmit={emailLogin}>
          <input
            style={input}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            style={input}
            placeholder="Password"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          <button style={btn} disabled={loading}>
            Login with Email
          </button>
        </form>

        <div style={{ textAlign: "center" }}>— OR —</div>

        <button
          style={{ ...btn, background: "#de5246" }}
          onClick={googleLogin}
          disabled={loading}
        >
          Login with Google
        </button>

        <div style={{ textAlign: "center" }}>— OR Phone OTP —</div>

        {!sent ? (
          <>
            <input
              style={input}
              placeholder="+919876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <div id="recaptcha-container-dealer"></div>
            <button style={btn} onClick={sendOtp} disabled={loading}>
              Send OTP
            </button>
          </>
        ) : (
          <>
            <input
              style={input}
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button style={btn} onClick={verifyOtp} disabled={loading}>
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const box = {
  maxWidth: 460,
  margin: "40px auto",
  padding: 18,
  background: "#fff",
  borderRadius: 8,
  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
};

const title = { fontSize: 26, fontWeight: 700, marginBottom: 12 };

const input = {
  width: "100%",
  padding: 12,
  border: "1px solid #ddd",
  borderRadius: 8,
  marginBottom: 12,
};

const btn = {
  width: "100%",
  padding: 14,
  background: "#6b21a8",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};
