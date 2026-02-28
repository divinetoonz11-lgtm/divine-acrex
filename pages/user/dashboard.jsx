import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

/* ================= SIDEBAR NAV ================= */
const Nav = ({ onClick, children }) => (
  <div
    onClick={onClick}
    style={{
      padding: "12px 16px",
      borderRadius: 12,
      cursor: "pointer",
      fontWeight: 700,
      color: "#e5e7eb",
      marginBottom: 6,
    }}
  >
    {children}
  </div>
);

function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    image: "/images/avatar.png",
  });

  const [dealerStatus, setDealerStatus] = useState(null);

  const [listings, setListings] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [saved, setSaved] = useState([]);
  const [referralCode, setReferralCode] = useState("");

  /* ================= MOBILE DETECT ================= */
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 900);
    fn();
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  /* ================= AUTH ================= */
  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.replace("/login");
    if (session?.user?.role === "dealer")
      router.replace("/dealer/dashboard");
  }, [status, session]);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (status !== "authenticated") return;

    (async () => {
      const pr = await fetch("/api/user/profile");
      const pj = pr.ok ? await pr.json() : {};

      setProfile({
        name: pj.name || session.user.name,
        email: pj.email || session.user.email,
        image: pj.image || session.user.image || "/images/avatar.png",
      });

      setDealerStatus(pj.status || null);

      const lr = await fetch("/api/user/my-properties");
      const lj = lr.ok ? await lr.json() : {};
      setListings(Array.isArray(lj) ? lj : lj.data || []);

      const er = await fetch("/api/user/enquiries");
      setEnquiries(er.ok ? await er.json() : []);

      const sr = await fetch("/api/user/saved");
      setSaved(sr.ok ? await sr.json() : []);

      const rr = await fetch("/api/user/referral");
      const rj = rr.ok ? await rr.json() : {};
      setReferralCode(rj.referralCode || "—");
    })();
  }, [status]);

  /* ================= KPI ================= */
  const Kpi = ({ title, value, color }) => (
    <div
      style={{
        background: color,
        padding: 18,
        borderRadius: 18,
        color: "#fff",
        boxShadow: "0 10px 24px rgba(0,0,0,0.15)",
      }}
    >
      <div style={{ fontSize: 13 }}>{title}</div>
      <div style={{ fontSize: 26, fontWeight: 900 }}>{value}</div>
    </div>
  );

  /* ================= CHART DATA ================= */
  const months = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return d.toLocaleString("default", { month: "short" });
  });

  function countByMonth(arr) {
    const map = {};
    arr.forEach((x) => {
      if (!x.createdAt) return;
      const m = new Date(x.createdAt).toLocaleString("default", {
        month: "short",
      });
      map[m] = (map[m] || 0) + 1;
    });
    return months.map((m) => map[m] || 0);
  }

  const chartData = months.map((m, i) => ({
    month: m,
    properties: countByMonth(listings)[i],
    enquiries: countByMonth(enquiries)[i],
  }));

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f1f5fb" }}>

      {/* MOBILE HEADER */}
      {isMobile && (
        <div style={mobileHeader}>
          <div style={hamburger} onClick={() => setMenuOpen(true)}>☰</div>
          <div style={{ fontWeight: 800 }}>User Dashboard</div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside style={{
        width: 260,
        background: "#0a2a5e",
        color: "#fff",
        padding: 18,
      }}>

        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <img
            src={profile.image}
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              border: "3px solid #fff",
            }}
          />
          <div style={{ marginTop: 10, fontWeight: 800 }}>
            {profile.name}
          </div>
          <div style={{ fontSize: 12 }}>{profile.email}</div>
        </div>

        <Nav onClick={() => router.push("/user/dashboard")}>Overview</Nav>
        <Nav onClick={() => router.push("/post-property")}>Free Listing</Nav>
        <Nav onClick={() => router.push("/user/enquiries")}>My Enquiries</Nav>
        <Nav onClick={() => router.push("/user/properties")}>My Properties</Nav>
        <Nav onClick={() => router.push("/user/saved")}>Saved</Nav>
        <Nav onClick={() => router.push("/user/profile")}>Profile</Nav>

        {/* Become Dealer Logic */}
        {session?.user?.role !== "dealer" && dealerStatus !== "pending" && (
          <Nav onClick={() => router.push("/dealer/register")}>
            Become a Dealer
          </Nav>
        )}

        {dealerStatus === "pending" && (
          <div style={{
            padding: "10px 16px",
            color: "#fbbf24",
            fontWeight: 700
          }}>
            Dealer Approval Pending
          </div>
        )}

        <button
          style={{
            marginTop: 20,
            width: "100%",
            padding: 12,
            background: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: 14,
            fontWeight: 800,
          }}
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, padding: 24 }}>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: 18,
        }}>
          <Kpi title="My Properties" value={listings.length} color="#2563eb" />
          <Kpi title="Saved" value={saved.length} color="#7c3aed" />
          <Kpi title="Enquiries" value={enquiries.length} color="#16a34a" />
          <Kpi title="Referral Code" value={referralCode} color="#f59e0b" />
        </div>

        <div style={{
          background: "#fff",
          padding: 24,
          borderRadius: 20,
          marginTop: 24,
        }}>
          <h3>Monthly Activity</h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="properties" stroke="#2563eb" strokeWidth={3} />
              <Line type="monotone" dataKey="enquiries" stroke="#16a34a" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </main>
    </div>
  );
}

/* MOBILE STYLES */
const mobileHeader = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: 60,
  background: "#0a2a5e",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  padding: "0 16px",
  zIndex: 1300,
};

const hamburger = {
  fontSize: 24,
  marginRight: 16,
  cursor: "pointer",
};

export default dynamic(() => Promise.resolve(UserDashboard), { ssr: false });