import { useState } from "react";
import { useRouter } from "next/router";
import {
  signInWithEmail,
  signInWithGooglePopup,
  sendOtpToPhone,
  makeRecaptcha
} from "../../utils/firebaseClient";

export default function UserLogin() {
  const router = useRouter();

  // Email Login
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  // Phone Login
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  const [loading, setLoading] = useState(false);

  // -----------------------------------------
  // EMAIL LOGIN
  // -----------------------------------------
  async function loginEmail(e) {
    e.preventDefault();
    if (!email || !pass) return alert("Enter email & password");

    try {
      setLoading(true);
      const res = await signInWithEmail(email, pass);

      localStorage.setItem("logged_in", "yes");
      localStorage.setItem("role", "user");
      localStorage.setItem("user_email", res.user.email);

      window.dispatchEvent(new Event("authChanged"));
      router.push("/dashboard/user");
    } catch (err) {
      alert("Login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------------------
  // GOOGLE LOGIN
  // -----------------------------------------
  async function loginGoogle() {
    try {
      setLoading(true);
      const res = await signInWithGooglePopup();

      localStorage.setItem("logged_in", "yes");
      localStorage.setItem("role", "user");
      localStorage.setItem("user_email", res.user.email);

      // ⭐ तुमने माँगी हुई 2 lines: avatar + name save
      if (res.user.photoURL) localStorage.setItem("user_avatar", res.user.photoURL);
      if (res.user.displayName) localStorage.setItem("user_name", res.user.displayName);

      window.dispatchEvent(new Event("authChanged"));
      router.push("/dashboard/user");
    } catch (err) {
      alert("Google login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------------------
  // SEND OTP
  // -----------------------------------------
  async function sendOTP() {
    if (!phone) return alert("Enter phone number");

    try {
      setLoading(true);
      makeRecaptcha("recaptcha-user"); // creates invisible recaptcha
      const conf = await sendOtpToPhone(phone);

      setConfirmation(conf);
      setOtpSent(true);
      alert("OTP Sent");
    } catch (err) {
      alert("OTP failed: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------------------
  // VERIFY OTP
  // -----------------------------------------
  async function verifyOTP() {
    if (!otp || !confirmation) return;

    try {
      setLoading(true);
      const res = await confirmation.confirm(otp);

      localStorage.setItem("logged_in", "yes");
      localStorage.setItem("role", "user");

      localStorage.setItem("user_phone", res.user.phoneNumber || "");

      window.dispatchEvent(new Event("authChanged"));
      router.push("/dashboard/user");
    } catch (err) {
      alert("Wrong OTP");
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------------------
  // UI
  // -----------------------------------------
  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 20, background: "#fff",
      borderRadius: 12, boxShadow: "0 6px 20px rgba(0,0,0,0.08)" }}>

      <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 12 }}>
        User Login
      </h2>

      {/* EMAIL LOGIN */}
      <form onSubmit={loginEmail}>
        <input
          style={input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={input}
          type="password"
          placeholder="Password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />

        <button style={btn} disabled={loading}>Login with Email</button>
      </form>

      <div style={{ textAlign: "center", margin: "18px 0" }}>— OR —</div>

      {/* GOOGLE LOGIN */}
      <button
        style={{ ...btn, background: "#de5246" }}
        onClick={loginGoogle}
        disabled={loading}
      >
        Login with Google
      </button>

      <div style={{ textAlign: "center", margin: "18px 0" }}>— OR —</div>

      {/* PHONE OTP LOGIN */}
      {!otpSent ? (
        <>
          <input
            style={input}
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <div id="recaptcha-user"></div>

          <button style={btn} onClick={sendOTP} disabled={loading}>
            Send OTP
          </button>
        </>
      ) : (
        <>
          <input
            style={input}
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button style={btn} onClick={verifyOTP} disabled={loading}>
            Verify OTP
          </button>
        </>
      )}
    </div>
  );
}

const input = {
  width: "100%",
  padding: 12,
  border: "1px solid #ccc",
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
  fontWeight: 600,
};
