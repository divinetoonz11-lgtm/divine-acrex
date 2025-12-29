import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

/* ================= MOBILE NAV HELPER ================= */
function go(path, router) {
  if (typeof window !== "undefined" && window.innerWidth < 900) {
    router.push(path);
  }
}

function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    photo: "/images/avatar.png",
    profileCompleted: false,
    dealerRequest: null,
  });

  const [kpi, setKpi] = useState({
    properties: 0,
    saved: 0,
    referralCode: "",
  });

  /* ================= ROLE GUARD ================= */
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "dealer") {
      router.replace("/dealer/dashboard");
    }
  }, [status, session]);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (status !== "authenticated") return;

    (async () => {
      try {
        const r1 = await fetch("/api/user/profile");
        const p = await r1.json();

        const r2 = await fetch("/api/user/kpi");
        const k = await r2.json();

        setProfile({
          name: p.name || session.user.name,
          email: p.email || session.user.email,
          photo: p.photo || "/images/avatar.png",
          profileCompleted: !!p.profileCompleted,
          dealerRequest: p.dealerRequest || null,
        });

        setKpi({
          properties: k.properties || 0,
          saved: k.saved || 0,
          referralCode: k.referralCode || "—",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [status]);

  if (loading) return <div style={{ padding: 40 }}>Loading dashboard…</div>;

  const showDealerCTA =
    session.user.role === "user" && profile.dealerRequest !== "pending";

  return (
    <div style={wrap}>
      {/* ================= DESKTOP SIDEBAR (UNCHANGED) ================= */}
      <aside style={sidebar}>
        <div style={{ textAlign: "center" }}>
          <img src={profile.photo} style={avatar} />
          <div style={{ fontWeight: 800 }}>{profile.name}</div>
          <div style={{ fontSize: 12 }}>{profile.email}</div>
        </div>

        <Side active={tab === "overview"} onClick={() => setTab("overview")}>
          Overview
        </Side>
        <Side onClick={() => setTab("profile")}>Profile</Side>

        <button style={logout} onClick={() => signOut({ callbackUrl: "/" })}>
          Logout
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <main style={main}>
        {/* ===== DEALER PENDING ===== */}
        {profile.dealerRequest === "pending" && (
          <div style={pendingBox}>
            ⏳ <b>Your Dealer application is under review</b>
            <br />
            Approval usually takes <b>24–48 business hours</b>.
          </div>
        )}

        {/* ===== BECOME DEALER (ALREADY OK) ===== */}
        {showDealerCTA && (
          <div
            style={ctaBox}
            onClick={() => router.push("/dealer/register")}
          >
            <div>
              <div style={{ fontWeight: 800, color: "#1e40af" }}>
                Are you a Real Estate Professional?
              </div>
              <div style={{ fontSize: 13, color: "#475569" }}>
                Dealers & Builders get more leads & tools
              </div>
            </div>
            <div style={ctaBtn}>Become a Dealer →</div>
          </div>
        )}

        {/* ===== KPI GRID (MOBILE CLICKABLE) ===== */}
        <div style={kpiGrid}>
          <Kpi
            title="My Properties"
            value={kpi.properties}
            onClick={() => go("/user/properties", router)}
          />
          <Kpi
            title="Saved"
            value={kpi.saved}
            onClick={() => go("/user/saved", router)}
          />
          <Kpi
            title="Profile Status"
            value={profile.profileCompleted ? "Completed" : "Pending"}
            onClick={() => go("/user/profile", router)}
          />
          <Kpi
            title="Referral Code"
            value={kpi.referralCode}
            onClick={() => go("/user/referral", router)}
          />
        </div>

        {/* ===== OVERVIEW CONTENT ===== */}
        {tab === "overview" && (
          <div style={card}>
            <h3>Welcome to Divine Acres</h3>
            <p>Your account is active.</p>
          </div>
        )}

        {/* ===== PROFILE ===== */}
        {tab === "profile" && (
          <div style={card}>
            <h3>Profile</h3>
            <p>Profile section already implemented.</p>
          </div>
        )}
      </main>
    </div>
  );
}

/* ================= SMALL UI ================= */

const Side = ({ children, active, onClick }) => (
  <div
    onClick={onClick}
    style={{
      padding: 10,
      marginTop: 6,
      borderRadius: 8,
      background: active ? "#1e40af" : "transparent",
      cursor: "pointer",
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
      cursor: "pointer",
    }}
  >
    <div style={{ fontSize: 13, color: "#64748b" }}>{title}</div>
    <b style={{ fontSize: 18 }}>{value}</b>
  </div>
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

const avatar = { width: 72, height: 72, borderRadius: "50%" };
const logout = { marginTop: 20 };

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 14,
  marginTop: 16,
};

const pendingBox = {
  marginBottom: 16,
  padding: 14,
  borderRadius: 12,
  background: "#fff7ed",
  border: "1px solid #fed7aa",
  color: "#7c2d12",
};

const ctaBox = {
  marginBottom: 18,
  padding: 16,
  borderRadius: 14,
  background: "linear-gradient(90deg,#e0ecff,#f5f9ff)",
  border: "1px solid #c7d2fe",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer",
};

const ctaBtn = {
  padding: "8px 16px",
  borderRadius: 999,
  background: "#2563eb",
  color: "#fff",
  fontWeight: 700,
};

const kpiGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
  gap: 14,
};

export default dynamic(() => Promise.resolve(UserDashboard), { ssr: false });
