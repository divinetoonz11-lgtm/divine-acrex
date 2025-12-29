import dynamic from "next/dynamic";
import React, { useEffect, useState, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

/* ================= LOCATION DATA ================= */
const LOCATION = {
  India: {
    code: "+91",
    states: {
      Delhi: ["New Delhi"],
      Maharashtra: ["Mumbai", "Pune", "Nagpur"],
      "Uttar Pradesh": ["Noida", "Lucknow", "Kanpur"],
      Rajasthan: ["Jaipur", "Udaipur"],
      Karnataka: ["Bengaluru", "Mysuru"],
      "Tamil Nadu": ["Chennai", "Coimbatore"],
      Gujarat: ["Ahmedabad", "Surat"],
      "West Bengal": ["Kolkata"],
      Punjab: ["Ludhiana", "Amritsar"],
      Haryana: ["Gurugram", "Faridabad"],
    },
  },
};

function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileRef = useRef(null);

  /* ================= STATE ================= */
  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    dob: "",
    country: "India",
    countryCode: "+91",
    phone: "",
    state: "",
    city: "",
    photo: "",
    profileCompleted: false,
  });

  const [listings, setListings] = useState([]);
  const [saved, setSaved] = useState([]);
  const [referralCode, setReferralCode] = useState("");

  const locked = !profile.profileCompleted;

  /* ================= MOBILE ================= */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ================= ROLE GUARD ================= */
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "dealer") {
      router.replace("/dealer/dashboard");
    }
  }, [status, session, router]);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (status !== "authenticated") return;

    (async () => {
      try {
        const pr = await fetch("/api/user/profile");
        const pj = pr.ok ? await pr.json() : {};

        setProfile((p) => ({
          ...p,
          name: pj.name || session.user.name || "",
          email: pj.email || session.user.email || "",
          dob: pj.dob || "",
          phone: pj.phone || "",
          country: pj.country || "India",
          countryCode: pj.countryCode || "+91",
          state: pj.state || "",
          city: pj.city || "",
          photo: pj.photo || "",
          profileCompleted: !!pj.profileCompleted,
        }));

        const lr = await fetch("/api/user/listings");
        setListings(lr.ok ? await lr.json() : []);

        const sr = await fetch("/api/user/saved");
        setSaved(sr.ok ? await sr.json() : []);

        const rr = await fetch("/api/user/referral");
        const rj = rr.ok ? await rr.json() : {};
        setReferralCode(rj.referralCode || "");
      } finally {
        setLoading(false);
      }
    })();
  }, [status, session]);

  /* ================= PHOTO AUTO SAVE ================= */
  async function uploadPhoto(e) {
    const file = e.target.files[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("photo", file);

    const res = await fetch("/api/user/profile-photo", {
      method: "POST",
      body: fd,
    });
    const j = await res.json();

    if (j.url) {
      setProfile((p) => ({ ...p, photo: j.url }));
      await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ photo: j.url }),
      });
    }
  }

  async function saveProfile() {
    await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...profile, profileCompleted: true }),
    });
    setProfile((p) => ({ ...p, profileCompleted: true }));
    setTab("overview");
  }

  if (loading) return <div style={{ padding: 40 }}>Loading dashboard…</div>;

  /* ================= SHARE ================= */
  const shareText = `Join Divine Acres using my referral code ${referralCode}`;
  const shareUrl = "https://divineacres.com/signup";

  return (
    <div style={wrap}>
      {/* ================= SIDEBAR ================= */}
      {!isMobile && (
        <aside style={sidebar}>
          <div style={{ textAlign: "center" }}>
            <img
              src={profile.photo || "/images/avatar.png"}
              style={avatar}
              onClick={() => fileRef.current.click()}
            />
            <div style={{ fontWeight: 800 }}>{profile.name}</div>
            <div style={{ fontSize: 12 }}>{profile.email}</div>
          </div>

          <Side active={tab === "overview"} onClick={() => setTab("overview")}>
            Overview
          </Side>
          <Side active={tab === "profile"} onClick={() => setTab("profile")}>
            Profile
          </Side>
          <Side disabled={locked}>My Properties</Side>
          <Side disabled={locked}>Saved</Side>

          <button style={logout} onClick={() => signOut({ callbackUrl: "/" })}>
            Logout
          </button>
        </aside>
      )}

      {/* ================= MAIN ================= */}
      <main style={main}>
        {/* ===== BECOME A DEALER CTA ===== */}
        {session?.user?.role === "user" && (
          <div
            onClick={() => router.push("/dealer/register")}
            style={{
              marginBottom: 18,
              padding: 16,
              borderRadius: 14,
              background: "linear-gradient(90deg,#e0ecff,#f5f9ff)",
              border: "1px solid #c7d2fe",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <div>
              <div style={{ fontWeight: 800, color: "#1e40af" }}>
                Are you a Real Estate Professional?
              </div>
              <div style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>
                Dealers & Builders get more leads, visibility & tools
              </div>
            </div>
            <div
              style={{
                padding: "8px 16px",
                borderRadius: 999,
                background: "#2563eb",
                color: "#fff",
                fontWeight: 700,
                fontSize: 13,
                whiteSpace: "nowrap",
              }}
            >
              Become a Dealer →
            </div>
          </div>
        )}

        {locked && tab === "overview" && (
          <div style={lockBox}>
            Complete your profile to unlock all features
            <button onClick={() => setTab("profile")}>Complete Profile</button>
          </div>
        )}

        {tab === "overview" && (
          <>
            <div style={kpiGrid}>
              <Kpi title="My Properties" value={listings.length} />
              <Kpi title="Saved" value={saved.length} />
              <Kpi
                title="Profile Status"
                value={profile.profileCompleted ? "Completed" : "Pending"}
                onClick={() => setTab("profile")}
              />
              <Kpi title="Referral Code" value={referralCode || "—"} />
            </div>

            <div style={refBox}>
              <b>Your Referral Code: {referralCode || "—"}</b>
              <div style={shareRow}>
                <a
                  style={{ ...shareBtn, background: "#25D366" }}
                  href={`https://wa.me/?text=${encodeURIComponent(
                    shareText + " " + shareUrl
                  )}`}
                  target="_blank"
                >
                  WhatsApp
                </a>
                <a
                  style={{ ...shareBtn, background: "#1877F2" }}
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                  target="_blank"
                >
                  Facebook
                </a>
                <button
                  style={{ ...shareBtn, background: "#E1306C" }}
                  onClick={() =>
                    navigator.clipboard.writeText(
                      shareText + " " + shareUrl
                    )
                  }
                >
                  Instagram
                </button>
              </div>
            </div>
          </>
        )}

        {tab === "profile" && (
          <div style={profileBox}>
            <h3>Complete Profile</h3>

            <Label>Full Name</Label>
            <Input
              value={profile.name}
              onChange={(v) => setProfile((p) => ({ ...p, name: v }))}
            />

            <Label>Date of Birth (DD/MM/YYYY)</Label>
            <Input
              value={profile.dob}
              onChange={(v) => setProfile((p) => ({ ...p, dob: v }))}
            />

            <Label>Country</Label>
            <select style={input} value={profile.country}>
              <option>India</option>
            </select>

            <Label>Mobile</Label>
            <div style={{ display: "flex", gap: 8 }}>
              <input value="+91" disabled style={{ ...input, width: 70 }} />
              <Input
                value={profile.phone}
                onChange={(v) =>
                  setProfile((p) => ({
                    ...p,
                    phone: v.replace(/[^0-9]/g, ""),
                  }))
                }
              />
            </div>

            <Label>State</Label>
            <select
              style={input}
              value={profile.state}
              onChange={(e) =>
                setProfile((p) => ({
                  ...p,
                  state: e.target.value,
                  city: "",
                }))
              }
            >
              <option value="">Select State</option>
              {Object.keys(LOCATION.India.states).map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            <Label>City</Label>
            <select
              style={input}
              value={profile.city}
              disabled={!profile.state}
              onChange={(e) =>
                setProfile((p) => ({ ...p, city: e.target.value }))
              }
            >
              <option value="">Select City</option>
              {(LOCATION.India.states[profile.state] || []).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <button onClick={saveProfile}>Save & Unlock</button>
          </div>
        )}
      </main>

      <input
        hidden
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={uploadPhoto}
      />
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

const Side = ({ children, active, disabled, onClick }) => (
  <div
    onClick={!disabled ? onClick : undefined}
    style={{
      padding: 10,
      marginTop: 6,
      borderRadius: 8,
      background: active ? "#1e40af" : "transparent",
      color: disabled ? "#94a3b8" : "#fff",
      cursor: disabled ? "not-allowed" : "pointer",
      fontWeight: 700,
    }}
  >
    {children}
  </div>
);

const Kpi = ({ title, value, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: "#fff",
      padding: 16,
      borderRadius: 14,
      cursor: onClick ? "pointer" : "default",
    }}
  >
    <div>{title}</div>
    <b>{value}</b>
  </div>
);

const Label = ({ children }) => (
  <label style={{ fontWeight: 700 }}>{children}</label>
);
const Input = ({ value, onChange }) => (
  <input
    style={input}
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
);

/* ================= STYLES ================= */

const wrap = { display: "flex", minHeight: "100vh", background: "#f1f5fb" };
const sidebar = {
  width: 260,
  background: "#0a2a5e",
  color: "#fff",
  padding: 18,
};
const main = { flex: 1, padding: 20 };

const avatar = { width: 72, height: 72, borderRadius: "50%", cursor: "pointer" };
const logout = { marginTop: 20 };

const lockBox = {
  background: "#fff3cd",
  padding: 14,
  borderRadius: 10,
  marginBottom: 20,
};

const kpiGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
  gap: 14,
};
const refBox = {
  marginTop: 16,
  background: "#eef2ff",
  padding: 14,
  borderRadius: 14,
};
const shareRow = {
  display: "flex",
  gap: 10,
  marginTop: 10,
  flexWrap: "wrap",
};
const shareBtn = {
  padding: "6px 14px",
  borderRadius: 20,
  color: "#fff",
  border: "none",
};

const profileBox = {
  background: "#fff",
  padding: 20,
  borderRadius: 14,
  maxWidth: 520,
};
const input = { width: "100%", padding: 8, marginBottom: 10 };

export default dynamic(() => Promise.resolve(UserDashboard), { ssr: false });
