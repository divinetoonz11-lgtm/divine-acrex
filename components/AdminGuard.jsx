import { useEffect, useState } from "react";

export default function AdminGuard({ children }) {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [inputKey, setInputKey] = useState("");

  // get key from sessionStorage or env fallback
  const getKey = () => {
    try {
      return sessionStorage.getItem("admin_key") || process.env.NEXT_PUBLIC_ADMIN_KEY || "";
    } catch (e) {
      return process.env.NEXT_PUBLIC_ADMIN_KEY || "";
    }
  };

  useEffect(() => {
    async function verify() {
      setChecking(true);
      const key = getKey();
      if (!key) {
        setShowPrompt(true);
        setChecking(false);
        return;
      }
      try {
        const res = await fetch("/api/admin/overview", {
          headers: { "x-admin-key": key },
        });
        if (res.ok) {
          // valid
          try { sessionStorage.setItem("admin_key", key); } catch(e){}
          setAuthorized(true);
        } else {
          // invalid
          setShowPrompt(true);
          sessionStorage.removeItem("admin_key");
        }
      } catch (err) {
        // network or server error — allow page but show warning
        // we keep user allowed to view UI but mark not-authorized
        console.warn("Admin verify failed:", err);
        setShowPrompt(true);
      } finally {
        setChecking(false);
      }
    }
    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitKey = async () => {
    const key = inputKey.trim();
    if (!key) return alert("Key required");
    setChecking(true);
    try {
      const res = await fetch("/api/admin/overview", { headers: { "x-admin-key": key } });
      if (res.ok) {
        sessionStorage.setItem("admin_key", key);
        setAuthorized(true);
        setShowPrompt(false);
      } else {
        alert("Invalid admin key");
      }
    } catch (err) {
      alert("Network error: " + err.message);
    } finally {
      setChecking(false);
    }
  };

  // UI
  if (checking) return <div style={{padding:20}}>Checking admin access…</div>;
  if (showPrompt && !authorized) {
    return (
      <div style={{padding:20, maxWidth:600, margin:"40px auto", border:"1px solid #eee", borderRadius:8}}>
        <h3>Admin Access Required</h3>
        <p>Enter admin key to continue (session will remember it):</p>
        <input value={inputKey} onChange={(e)=>setInputKey(e.target.value)} placeholder="Enter admin key" style={{width:"100%",padding:10,borderRadius:6,border:"1px solid #ddd"}} />
        <div style={{marginTop:12,display:"flex",gap:8,justifyContent:"flex-end"}}>
          <button onClick={()=>{setShowPrompt(false);}} style={{padding:"8px 12px"}}>Cancel</button>
          <button onClick={submitKey} style={{padding:"8px 12px",background:"#27457a",color:"#fff",borderRadius:6}}>Submit</button>
        </div>
        <p style={{marginTop:12,fontSize:13,color:"#777"}}>Tip: For local dev you can keep the same value as <code>NEXT_PUBLIC_ADMIN_KEY</code>.</p>
      </div>
    );
  }

  // allowed
  return <>{children}</>;
}
