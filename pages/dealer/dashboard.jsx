import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import DealerReferral from "./referral";

export default function DealerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  /* ================= ROLE GUARD ================= */
  useEffect(() => {
    if (status === "loading") return;
    if (!session) return router.replace("/");
    if (session.user.role !== "dealer") {
      router.replace("/user/dashboard");
    }
  }, [session, status]);

  /* ================= DATA ================= */
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [subscription, setSubscription] = useState({
    plan: "FREE",
    status: "ACTIVE",
  });

  /* ================= DUMMY PROPERTIES ================= */
  const dummyListings = [
    {
      id: "p1",
      title: "3 BHK Apartment",
      location: "Andheri West, Mumbai",
      price: "₹1.45 Cr",
      type: "Residential",
      postedOn: "12 Dec 2025",
      views: 124,
      status: "APPROVED",
      image: "/images/listing-example-1.png",
    },
    {
      id: "p2",
      title: "Commercial Office Space",
      location: "Noida Sector 62",
      price: "₹85 Lacs",
      type: "Commercial",
      postedOn: "10 Dec 2025",
      views: 89,
      status: "PENDING",
      image: "/images/listing-example-2.png",
    },
    {
      id: "p3",
      title: "Luxury Villa",
      location: "Lonavala",
      price: "₹3.2 Cr",
      type: "Villa",
      postedOn: "08 Dec 2025",
      views: 46,
      status: "REJECTED",
      image: "/images/listing-example-3.png",
    },
  ];

  useEffect(() => {
    if (!session) return;
    (async () => {
      try {
        const pr = await fetch("/api/dealer/profile");
        const pj = await pr.json();
        if (pj?.ok && pj.profile) setProfile(pj.profile);

        const sr = await fetch("/api/dealer/subscription");
        const sj = await sr.json();
        if (sj?.ok && sj.subscription) setSubscription(sj.subscription);
      } catch {}
      setLoading(false);
    })();
  }, [session]);

  if (loading) return <div style={{ padding: 40 }}>Loading dashboard…</div>;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f7fb" }}>
      {/* ================= SIDEBAR ================= */}
      <aside style={sb}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <img src="/images/avatar.png" style={avatar} />
          <div style={{ fontWeight: 800 }}>{profile.name || "Dealer"}</div>
          <div style={{ fontSize: 12, color: "#c7d2fe" }}>
            Plan: {subscription.plan}
          </div>
        </div>

        <Nav t="overview" tab={tab} setTab={setTab}>Overview</Nav>
        <Nav t="post" tab={tab} setTab={setTab}>Post Property</Nav>
        <Nav t="properties" tab={tab} setTab={setTab}>My Properties</Nav>
        <Nav t="leads" tab={tab} setTab={setTab}>Leads</Nav>
        <Nav t="subscription" tab={tab} setTab={setTab}>Subscription</Nav>
        <Nav t="referral" tab={tab} setTab={setTab}>Referral / Earn</Nav>
        <Nav t="profile" tab={tab} setTab={setTab}>Profile</Nav>
        <Nav t="support" tab={tab} setTab={setTab}>Support</Nav>

        <button style={logoutBtn} onClick={() => signOut({ callbackUrl: "/" })}>
          Logout
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <main style={{ flex: 1, padding: 28 }}>

        {tab === "overview" && (
          <div style={grid}>
            <Stat title="Total Properties" val={dummyListings.length} />
            <Stat title="Approved" val={dummyListings.filter(p => p.status === "APPROVED").length} />
            <Stat title="Pending" val={dummyListings.filter(p => p.status === "PENDING").length} />
            <Stat title="Plan" val={subscription.plan} />
          </div>
        )}

        {tab === "post" && (
          <div style={box}>
            <button style={btn} onClick={() => router.push("/post-property")}>
              Open Post Property Form
            </button>
          </div>
        )}

        {tab === "properties" && (
          <div style={cardGrid}>
            {dummyListings.map(p => (
              <div key={p.id} style={propertyCard}>
                <img src={p.image} style={propertyImg} />
                <div style={{ padding: 14 }}>
                  <div style={{ fontWeight: 800 }}>{p.title}</div>
                  <div style={muted}>{p.location}</div>
                  <div style={{ marginTop: 6, fontWeight: 800 }}>{p.price}</div>

                  <div style={row}>
                    <span style={chip}>{p.type}</span>
                    <span style={chip}>Views: {p.views}</span>
                  </div>

                  <div style={row}>
                    <span style={muted}>Posted: {p.postedOn}</span>
                    <span style={statusBadge(p.status)}>{p.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "leads" && <div style={box}>No leads yet</div>}

        {tab === "subscription" && (
          <div style={box}>
            <h3>Current Plan</h3>
            <p style={muted}>{subscription.plan}</p>
            <button style={btn} onClick={() => router.push("/dealer/subscription")}>
              Upgrade / Change Plan
            </button>
          </div>
        )}

        {tab === "referral" && <DealerReferral />}

        {tab === "profile" && (
          <div style={box}>
            <p><b>Name:</b> {profile.name}</p>
            <p><b>Email:</b> {profile.email}</p>
            <p><b>Phone:</b> {profile.phone}</p>
          </div>
        )}

        {/* ================= SUPPORT (FIXED) ================= */}
        {tab === "support" && (
          <div style={box}>
            <h3>Need Help?</h3>
            <p style={muted}>Our support team is available 7 days a week.</p>

            <a
              href="mailto:divinetoonz11@gmail.com"
              style={{ ...btn, display: "inline-block", marginTop: 10 }}
            >
              Email Support
            </a>
          </div>
        )}

      </main>
    </div>
  );
}

/* ================= COMPONENTS ================= */
const Nav = ({ t, tab, setTab, children }) => (
  <div style={nav(tab === t)} onClick={() => setTab(t)}>{children}</div>
);

const Stat = ({ title, val }) => (
  <div style={stat}>
    <div style={muted}>{title}</div>
    <div style={{ fontSize: 22, fontWeight: 900 }}>{val}</div>
  </div>
);

/* ================= STYLES ================= */
const sb = { width: 260, background: "#0a1f44", color: "#fff", padding: 18 };
const avatar = { width: 64, height: 64, borderRadius: "50%" };
const logoutBtn = { marginTop: 20, padding: 10, background: "#ef4444", color: "#fff", border: 0, borderRadius: 8 };

const nav = a => ({ padding: 12, marginTop: 6, borderRadius: 10, cursor: "pointer", background: a ? "rgba(255,255,255,.15)" : "" });

const grid = { display: "flex", gap: 14, marginBottom: 20 };
const stat = { background: "#fff", padding: 18, borderRadius: 14, minWidth: 180 };

const box = { background: "#fff", padding: 24, borderRadius: 16 };
const btn = { padding: "10px 18px", background: "#315DFF", color: "#fff", border: 0, borderRadius: 10 };

const cardGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 };

const propertyCard = { background: "#fff", borderRadius: 14, overflow: "hidden" };
const propertyImg = { width: "100%", height: 160, objectFit: "cover" };

const row = { display: "flex", justifyContent: "space-between", marginTop: 8 };
const chip = { background: "#eef2ff", padding: "4px 8px", borderRadius: 6, fontSize: 12, fontWeight: 700 };

const statusBadge = s => ({
  padding: "4px 10px",
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 800,
  background: s === "APPROVED" ? "#22c55e" : s === "PENDING" ? "#f59e0b" : "#ef4444",
  color: "#fff",
});

const muted = { fontSize: 13, color: "#6b7280" };
