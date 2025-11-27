// pages/login/admin.jsx
import { useRouter } from "next/router";
import { useState } from "react";
import {
  auth,
  signInWithGooglePopup,
  signInWithEmail,
  logout // make sure utils/firebaseClient exports logout (signOut)
} from "../../utils/firebaseClient";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  // helper: clear any previous localStorage/auth state
  const clearState = async () => {
    try {
      // firebase sign out if any
      await logout().catch(()=>{});
    } catch(e){}
    localStorage.removeItem("logged_in");
    localStorage.removeItem("role");
    localStorage.removeItem("user_email");
    localStorage.removeItem("dealer_email");
    localStorage.removeItem("admin_email");
    localStorage.removeItem("user_phone");
    localStorage.removeItem("dealer_phone");
  };

  // Email Login
  const adminEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !pass) return alert("Enter email & password");

    try {
      setLoading(true);
      // clear previous state first
      await clearState();

      // OPTIONAL: Hardcoded admin check 
      const allowedAdminEmail = "admin@divine.com";
      if (email !== allowedAdminEmail) {
        alert("Unauthorized admin email");
        setLoading(false);
        return;
      }

      const res = await signInWithEmail(email, pass);

      // only set role AFTER successful sign-in
      localStorage.setItem("logged_in", "yes");
      localStorage.setItem("role", "admin");
      localStorage.setItem("admin_email", res.user.email || email);

      router.push("/dashboard/admin");
    } catch (err) {
      console.error("adminEmailLogin error:", err);
      alert("Admin login failed: " + (err.message || err.code));
      // ensure no leftover session
      await clearState();
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const adminGoogle = async () => {
    try {
      setLoading(true);
      // clear previous state first
      await clearState();

      const res = await signInWithGooglePopup();

      // OPTIONAL admin check:
      const allowedAdminEmail = "admin@divine.com";

      if (!res?.user?.email || res.user.email !== allowedAdminEmail) {
        alert("Not an admin account");
        // sign out the just-signed-in user to avoid leftover session
        await clearState();
        setLoading(false);
        return;
      }

      // success -> set role
      localStorage.setItem("logged_in", "yes");
      localStorage.setItem("role", "admin");
      localStorage.setItem("admin_email", res.user.email);

      router.push("/dashboard/admin");
    } catch (err) {
      console.error("adminGoogle error:", err);
      alert("Google admin login failed: " + (err.message || err.code));
      await clearState();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={box}>
      <h2 style={title}>Admin Login</h2>

      <form onSubmit={adminEmailLogin}>
        <input
          style={input}
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />
        <input
          style={input}
          type="password"
          placeholder="Password"
          value={pass}
          onChange={(e)=>setPass(e.target.value)}
        />
        <button style={btn} disabled={loading}>
          Login with Email
        </button>
      </form>

      <div style={{textAlign:"center", marginTop:15}}>— OR —</div>

      <button
        style={{...btn,background:"#de5246"}}
        onClick={adminGoogle}
        disabled={loading}
      >
        Login with Google
      </button>

    </div>
  );
}

const box = { maxWidth:460, margin:"40px auto", padding:18, background:"#fff", borderRadius:8, boxShadow:"0 6px 20px rgba(0,0,0,0.08)" };
const title = { fontSize:26, fontWeight:700, marginBottom:12 };
const input = { width:"100%", padding:12, border:"1px solid #ddd", borderRadius:8, marginBottom:12 };
const btn = { width:"100%", padding:14, background:"#6b21a8", color:"#fff", border:"none", borderRadius:8, cursor:"pointer" };
