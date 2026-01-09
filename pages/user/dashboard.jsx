import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

/* ================= NAV ITEM ================= */
const Nav = ({ active, onClick, children }) => (
  <div
    onClick={onClick}
    style={{
      padding: "12px 14px",
      marginBottom: 6,
      borderRadius: 10,
      cursor: "pointer",
      fontWeight: 700,
      background: active ? "#ffffff" : "transparent",
      color: active ? "#0a2a5e" : "#e5e7eb",
    }}
  >
    {children}
  </div>
);

function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [tab, setTab] = useState("overview");
  const [isMobile, setIsMobile] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    profileCompleted: false,
  });

  const [listings, setListings] = useState([]);
  const [saved, setSaved] = useState([]);
  const [recent, setRecent] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [referralCode, setReferralCode] = useState("");

  /* ✅ 3-dot menu state */
  const [openMenu, setOpenMenu] = useState(null);

  const isDealer = session?.user?.role === "dealer";

  /* ===== MOBILE CHECK ===== */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ===== LOAD DATA ===== */
  useEffect(() => {
    if (status !== "authenticated") return;

    (async () => {
      const pr = await fetch("/api/user/profile");
      const pj = pr.ok ? await pr.json() : {};
      setProfile({
        name: pj.name || session.user.name,
        email: pj.email || session.user.email,
        profileCompleted: !!pj.profileCompleted,
      });

      const lr = await fetch("/api/user/listings");
      const lj = lr.ok ? await lr.json() : {};
      setListings(Array.isArray(lj.data) ? lj.data : []);

      const sr = await fetch("/api/user/saved");
      setSaved(sr.ok ? await sr.json() : []);

      const rr = await fetch("/api/user/recently-viewed");
      setRecent(rr.ok ? await rr.json() : []);

      const er = await fetch("/api/user/enquiries");
      setEnquiries(er.ok ? await er.json() : []);

      const rc = await fetch("/api/user/referral");
      const rj = rc.ok ? await rc.json() : {};
      setReferralCode(rj.referralCode || "");
    })();
  }, [status, session]);

  /* ✅ PROPERTY IMAGE (Post Property wali photo) */
  const getPropertyImage = (p) =>
    p.images?.[0] ||
    p.photos?.[0] ||
    p.coverImage ||
    p.image ||
    "/no-property.jpg";

  /* ===== KPI ===== */
  const Kpi = ({ title, value, onClick }) => (
    <div onClick={onClick} style={kpi}>
      <div style={{ fontSize: 13 }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 900 }}>{value}</div>
    </div>
  );

  /* ===== GRAPH ===== */
  const Graph = ({ title, data }) => {
    const max = Math.max(...data, 5);
    return (
      <div style={graphCard}>
        <b>{title}</b>
        <div style={barWrap}>
          {data.map((v, i) => (
            <div key={i} style={barCol}>
              <div style={{ ...bar, height: (v / max) * 120 + 20 }} />
              <div style={{ fontSize: 10 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={wrap}>
      {/* ===== SIDEBAR ===== */}
      {!isMobile && (
        <aside style={sidebar}>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <b>{profile.name}</b>
            <div style={{ fontSize: 12 }}>{profile.email}</div>
          </div>

          <Nav active={tab === "overview"} onClick={() => setTab("overview")}>Overview</Nav>
          <Nav onClick={() => window.open("/post-property", "_blank")}>Free Listing</Nav>
          <Nav onClick={() => router.push("/user/enquiries")}>My Enquiries</Nav>
          <Nav active={tab === "properties"} onClick={() => setTab("properties")}>My Properties</Nav>
          <Nav active={tab === "saved"} onClick={() => setTab("saved")}>Saved</Nav>
          <Nav active={tab === "recent"} onClick={() => setTab("recent")}>Recently Viewed</Nav>
          <Nav active={tab === "profile"} onClick={() => setTab("profile")}>Profile</Nav>

          <button style={logout} onClick={() => signOut({ callbackUrl: "/" })}>
            Logout
          </button>
        </aside>
      )}

      {/* ===== MAIN ===== */}
      <main style={main}>
        {/* ===== TOP BAR ===== */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}>User Dashboard</h2>

          {!isDealer && (
            <button
              onClick={() => router.push("/dealer/register")}
              style={{
                background: "#16a34a",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: 999,
                border: "none",
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: "0 6px 14px rgba(22,163,74,0.35)",
              }}
            >
              Become a Dealer
            </button>
          )}
        </div>

        {/* ===== DEALER INFO CARD ===== */}
        {!isDealer && (
          <div style={{
            background: "linear-gradient(135deg,#16a34a,#22c55e)",
            color: "#fff",
            padding: 20,
            borderRadius: 16,
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <div>
              <h3 style={{ margin: 0 }}>Become a Dealer & Grow Faster</h3>
              <p style={{ margin: "6px 0 0", fontSize: 14 }}>
                Unlimited listings • Real buyer leads • Area-wise exposure
              </p>
            </div>
            <button
              onClick={() => router.push("/dealer/register")}
              style={{
                background: "#fff",
                color: "#166534",
                padding: "10px 16px",
                borderRadius: 999,
                border: "none",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              Apply Now
            </button>
          </div>
        )}

        {/* ===== OVERVIEW ===== */}
        {tab === "overview" && (
          <>
            <div style={kpiGrid}>
              <Kpi title="My Properties" value={listings.length} onClick={() => setTab("properties")} />
              <Kpi title="Saved" value={saved.length} onClick={() => setTab("saved")} />
              <Kpi title="My Enquiries" value={enquiries.length} />
              <Kpi title="Referral Code" value={referralCode || "—"} />
              <Kpi title="Profile Status" value={profile.profileCompleted ? "Completed" : "Pending"} onClick={() => setTab("profile")} />
            </div>

            <div style={graphGrid}>
              <Graph title="My Activity" data={[2, 4, 3, 5]} />
              <Graph title="Saved Trend" data={[1, 3, 2, 4]} />
              <Graph title="Enquiry Flow" data={[0, 1, 3, 2]} />
            </div>
          </>
        )}

        {/* ===== MY PROPERTIES (PHOTO + 3 DOT WORKING) ===== */}
        {tab === "properties" && (
          <div style={box}>
            <h3>My Properties</h3>

            {listings.length === 0 ? (
              <div style={{ color: "#6b7280" }}>No properties found</div>
            ) : (
              listings.map((p) => (
                <div
                  key={p._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: 12,
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {/* PHOTO */}
                  <img
                    src={getPropertyImage(p)}
                    alt={p.title}
                    style={{
                      width: 90,
                      height: 70,
                      borderRadius: 10,
                      objectFit: "cover",
                    }}
                  />

                  {/* DETAILS (same text) */}
                  <div style={{ flex: 1 }}>
                    <b>{p.title}</b>

                    <span
                      style={{
                        marginLeft: 8,
                        padding: "2px 8px",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 800,
                        background:
                          p.verificationStatus === "VERIFIED_LIVE"
                            ? "#dcfce7"
                            : "#fef3c7",
                        color:
                          p.verificationStatus === "VERIFIED_LIVE"
                            ? "#166534"
                            : "#92400e",
                      }}
                    >
                      {p.verificationStatus === "VERIFIED_LIVE"
                        ? "✔ Live Verified"
                        : "⚠ Pending Approval"}
                    </span>

                    <div style={{ fontSize: 12, marginTop: 4 }}>
                      Status: <b>{p.status}</b>
                    </div>
                  </div>

                  {/* 3 DOT MENU */}
                  <div style={{ position: "relative" }}>
                    <button
                      onClick={() =>
                        setOpenMenu(openMenu === p._id ? null : p._id)
                      }
                      style={{
                        fontSize: 20,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      ⋮
                    </button>

                    {openMenu === p._id && (
                      <div
                        style={{
                          position: "absolute",
                          right: 0,
                          top: 24,
                          background: "#fff",
                          borderRadius: 10,
                          boxShadow: "0 10px 30px rgba(0,0,0,.15)",
                          overflow: "hidden",
                          zIndex: 10,
                        }}
                      >
                        <div style={menuItem} onClick={() => router.push(`/post-property?id=${p._id}`)}>Edit</div>
                        <div
                          style={menuItem}
                          onClick={() =>
                            fetch(`/api/user/delete-property?id=${p._id}`, {
                              method: "DELETE",
                            })
                          }
                        >
                          Delete
                        </div>
                        <div style={menuItem} onClick={() => router.push(`/verify-property?id=${p._id}`)}>
                          Verify (Live Photo)
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

/* ===== STYLES ===== */
const wrap = { display: "flex", minHeight: "100vh", background: "#f1f5fb" };
const sidebar = { width: 260, background: "#0a2a5e", color: "#fff", padding: 16 };
const main = { flex: 1, padding: 20 };
const logout = { marginTop: 20, width: "100%", padding: "12px 0", background: "#ef4444", color: "#fff", border: "none", borderRadius: 12, fontWeight: 800 };
const kpiGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14 };
const kpi = { background: "#fff", padding: 16, borderRadius: 14, cursor: "pointer" };
const graphGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16, marginTop: 20 };
const graphCard = { background: "#fff", padding: 16, borderRadius: 14 };
const barWrap = { display: "flex", gap: 14, alignItems: "flex-end", height: 140 };
const barCol = { textAlign: "center" };
const bar = { width: 16, background: "#2563eb", borderRadius: 6 };
const box = { background: "#fff", padding: 20, borderRadius: 14 };
const menuItem = { padding: "10px 14px", cursor: "pointer", fontSize: 14 };

export default dynamic(() => Promise.resolve(UserDashboard), { ssr: false });
