import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [tab, setTab] = useState("overview");
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    profileCompleted: false,
  });

  const [listings, setListings] = useState([]);
  const [saved, setSaved] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [recent, setRecent] = useState([]);
  const [referralCode, setReferralCode] = useState("");

  const locked = !profile.profileCompleted;

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
      setListings(lr.ok ? await lr.json() : []);

      const sr = await fetch("/api/user/saved");
      setSaved(sr.ok ? await sr.json() : []);

      const er = await fetch("/api/user/enquiries");
      setEnquiries(er.ok ? await er.json() : []);

      const rv = await fetch("/api/user/recently-viewed");
      setRecent(rv.ok ? await rv.json() : []);

      const rr = await fetch("/api/user/referral");
      const rj = rr.ok ? await rr.json() : {};
      setReferralCode(rj.referralCode || "");
    })();
  }, [status, session]);

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
      {/* ===== DESKTOP SIDEBAR ===== */}
      {!isMobile && (
        <aside style={sidebar}>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <b>{profile.name}</b>
            <div style={{ fontSize: 12 }}>{profile.email}</div>
          </div>

          <Nav active={tab === "overview"} onClick={() => setTab("overview")}>
            Overview
          </Nav>

          <Nav
            onClick={() => window.open("/post-property", "_blank")}
          >
            Free Listing (2 Left)
          </Nav>

          <Nav onClick={() => router.push("/user/enquiries")}>
            My Enquiries
          </Nav>

          <Nav active={tab === "properties"} onClick={() => setTab("properties")}>
            My Properties
          </Nav>

          <Nav active={tab === "saved"} onClick={() => setTab("saved")}>
            Saved
          </Nav>

          <Nav active={tab === "recent"} onClick={() => setTab("recent")}>
            Recently Viewed
          </Nav>

          <Nav active={tab === "profile"} onClick={() => setTab("profile")}>
            Profile
          </Nav>

          <button style={logout} onClick={() => signOut({ callbackUrl: "/" })}>
            Logout
          </button>
        </aside>
      )}

      {/* ===== MAIN ===== */}
      <main style={main}>
        {/* MOBILE TOP */}
        {isMobile && (
          <div style={mobileTop}>
            <b>User Dashboard</b>
            <button style={dotsBtn} onClick={() => setMobileMenu(true)}>
              ☰
            </button>
          </div>
        )}

        {/* ===== DEALER CTA (GREEN) ===== */}
        {session?.user?.role === "user" && (
          <div style={dealerCta} onClick={() => router.push("/dealer/register")}>
            <div>
              <b>Are you a Real Estate Professional?</b>
              <div style={{ fontSize: 13 }}>
                Become a Dealer & get more leads
              </div>
            </div>
            <div style={dealerBtn}>Become a Dealer →</div>
          </div>
        )}

        {/* ===== OVERVIEW ===== */}
        {tab === "overview" && (
          <>
            <div style={kpiGrid}>
              <Kpi
                title="My Properties"
                value={listings.length}
                onClick={() => setTab("properties")}
              />
              <Kpi
                title="Saved"
                value={saved.length}
                onClick={() => setTab("saved")}
              />
              <Kpi
                title="Profile Status"
                value={profile.profileCompleted ? "Completed" : "Pending"}
                onClick={() => setTab("profile")}
              />
              <Kpi title="Referral Code" value={referralCode || "—"} />
              <Kpi
                title="My Enquiries"
                value={enquiries.length}
                onClick={() => router.push("/user/enquiries")}
              />
              <Kpi
                title="Free Listings"
                value="2"
                onClick={() => window.open("/post-property", "_blank")}
              />
            </div>

            <div style={graphGrid}>
              <Graph title="My Activity" data={[2, 4, 3, 5]} />
              <Graph title="Saved Trend" data={[1, 3, 2, 4]} />
              <Graph title="Enquiry Flow" data={[0, 1, 3, 2]} />
            </div>
          </>
        )}

        {/* ===== PROPERTIES ===== */}
        {tab === "properties" && (
          <div style={box}>
            <h3>My Properties</h3>
            {listings.length === 0 ? (
              <div>No properties yet</div>
            ) : (
              listings.map((p, i) => <div key={i}>{p.title || "Property"}</div>)
            )}
          </div>
        )}

        {/* ===== SAVED ===== */}
        {tab === "saved" && (
          <div style={box}>
            <h3>Saved Properties</h3>
            {saved.length === 0 ? (
              <div>No saved properties</div>
            ) : (
              saved.map((p, i) => <div key={i}>{p.title || "Property"}</div>)
            )}
          </div>
        )}

        {/* ===== RECENT ===== */}
        {tab === "recent" && (
          <div style={recentGrid}>
            {recent.length === 0 ? (
              <div>No recently viewed properties</div>
            ) : (
              recent.map((r, i) => (
                <div key={i} style={recentCard}>
                  {r.title || "Property"}
                </div>
              ))
            )}
          </div>
        )}

        {/* ===== PROFILE ===== */}
        {tab === "profile" && (
          <div style={box}>
            <h3>Profile</h3>
            <div>Name: {profile.name}</div>
            <div>Email: {profile.email}</div>
            <div>Status: {profile.profileCompleted ? "Completed" : "Pending"}</div>
          </div>
        )}
      </main>

      {/* ===== MOBILE MENU ===== */}
      {isMobile && mobileMenu && (
        <div style={mobileOverlay} onClick={() => setMobileMenu(false)}>
          <div style={mobileMenuBlue} onClick={(e) => e.stopPropagation()}>
            <MobileItem onClick={() => setTab("overview")}>Overview</MobileItem>
            <MobileItem onClick={() => setTab("properties")}>My Properties</MobileItem>
            <MobileItem onClick={() => setTab("saved")}>Saved</MobileItem>
            <MobileItem onClick={() => router.push("/user/enquiries")}>My Enquiries</MobileItem>
            <MobileItem onClick={() => setTab("recent")}>Recently Viewed</MobileItem>
            <MobileItem onClick={() => setTab("profile")}>Profile</MobileItem>
            <MobileItem danger onClick={() => signOut({ callbackUrl: "/" })}>
              Logout
            </MobileItem>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== SMALL ===== */
const Nav = ({ children, active, onClick }) => (
  <div
    onClick={onClick}
    style={{
      padding: 10,
      borderRadius: 10,
      marginBottom: 6,
      background: active ? "#1e40af" : "transparent",
      color: "#fff",
      fontWeight: 700,
      cursor: "pointer",
    }}
  >
    {children}
  </div>
);

const MobileItem = ({ children, onClick, danger }) => (
  <div
    onClick={onClick}
    style={{
      padding: 14,
      fontWeight: 700,
      color: danger ? "#fecaca" : "#fff",
    }}
  >
    {children}
  </div>
);

/* ===== STYLES ===== */
const wrap = { display: "flex", minHeight: "100vh", background: "#f1f5fb" };
const sidebar = { width: 260, background: "#0a2a5e", color: "#fff", padding: 16 };
const main = { flex: 1, padding: 20 };

const logout = {
  marginTop: 20,
  width: "100%",
  padding: "12px 0",
  background: "#ef4444",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  fontWeight: 800,
  cursor: "pointer",
};

const kpiGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
  gap: 14,
};
const kpi = {
  background: "#fff",
  padding: 16,
  borderRadius: 14,
  cursor: "pointer",
};

const graphGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: 16,
  marginTop: 20,
};
const graphCard = { background: "#fff", padding: 16, borderRadius: 14 };
const barWrap = { display: "flex", gap: 14, alignItems: "flex-end", height: 140 };
const barCol = { textAlign: "center" };
const bar = { width: 16, background: "#2563eb", borderRadius: 6 };

const dealerCta = {
  marginBottom: 18,
  padding: 16,
  borderRadius: 14,
  background: "linear-gradient(90deg,#dcfce7,#f0fdf4)",
  border: "1px solid #86efac",
  display: "flex",
  justifyContent: "space-between",
  cursor: "pointer",
};
const dealerBtn = {
  padding: "8px 18px",
  background: "#16a34a",
  color: "#fff",
  borderRadius: 999,
  fontWeight: 800,
};

const mobileTop = { display: "flex", justifyContent: "space-between", marginBottom: 12 };
const dotsBtn = { fontSize: 22, background: "none", border: "none" };
const mobileOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,.4)",
  zIndex: 9999,
};
const mobileMenuBlue = {
  background: "#0a2a5e",
  borderRadius: 14,
  margin: 20,
};

const recentGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
  gap: 12,
};
const recentCard = { background: "#fff", padding: 12, borderRadius: 12 };
const box = { background: "#fff", padding: 20, borderRadius: 14 };

export default dynamic(() => Promise.resolve(UserDashboard), { ssr: false });
