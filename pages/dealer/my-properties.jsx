import { useEffect, useState } from "react";
import { useRouter } from "next/router";

/* ================= SAFE DUMMY IMAGES ================= */
const DUMMY_IMAGES = [
  "/images/listing-example-1.png",
  "/images/listing-example-2.png",
  "/images/listing-example-3.png",
  "/images/listing-example-4.png",
];

/* ================= MAIN ================= */
export default function MyProperties() {
  const router = useRouter();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===== LOAD DATA (LIVE + FALLBACK DUMMY SAFE) ===== */
  useEffect(() => {
    let alive = true;

    fetch("/api/dealer/listings")
      .then(r => r.json())
      .then(j => {
        if (!alive) return;

        const data = Array.isArray(j?.data) ? j.data : [];
        setList(data);
        setLoading(false);
      })
      .catch(() => {
        if (alive) setLoading(false);
      });

    return () => (alive = false);
  }, []);

  /* ===== DELETE (OPTIMISTIC, SAFE) ===== */
  const deleteProperty = async (id) => {
    if (!confirm("Delete property?")) return;

    setList(p => p.filter(x => x._id !== id)); // instant UI
    try {
      await fetch(`/api/properties/${id}`, { method: "DELETE" });
    } catch {}
  };

  /* ===== IMAGE RESOLVER ===== */
  const getImage = (p, index) => {
    if (Array.isArray(p?.images) && p.images[0]) return p.images[0];
    return DUMMY_IMAGES[index % DUMMY_IMAGES.length];
  };

  /* ===== VERIFY BADGE (LIVE + DUMMY SUPPORT) ===== */
  const VerifyBadge = ({ p }) => {
    if (p?.verificationStatus === "VERIFIED_LIVE") {
      return <span style={badgeGreen}>✔ Verified</span>;
    }
    return <span style={badgeYellow}>Unverified</span>;
  };

  if (loading) return <div style={page}>Loading…</div>;

  return (
    <div style={page}>
      <h2 style={title}>My Properties</h2>

      {list.length === 0 ? (
        <div style={empty}>No properties found</div>
      ) : (
        <div style={grid}>
          {list.map((p, i) => (
            <div key={p._id || i} style={card}>
              <img src={getImage(p, i)} style={img} loading="lazy" />

              <div style={body}>
                <div style={row}>
                  <div style={name}>{p.title || "Property"}</div>
                  <VerifyBadge p={p} />
                </div>

                <div style={location}>
                  {p.city || p.location || "Location not set"}
                </div>

                <div style={price}>₹ {p.price || "—"}</div>

                {p.verificationStatus !== "VERIFIED_LIVE" && (
                  <div style={hint}>
                    Live photo upload karke verified banaye
                  </div>
                )}

                <div style={actions}>
                  <button
                    style={edit}
                    onClick={() =>
                      router.push(`/dealer/add-property?id=${p._id}`)
                    }
                  >
                    Edit
                  </button>
                  <button
                    style={del}
                    onClick={() => deleteProperty(p._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= PERFORMANCE SAFE STYLES ================= */

const page = {
  padding: "16px",
  background: "#f7f7f7",
  minHeight: "100vh",
};

const title = {
  fontSize: 22,
  fontWeight: 900,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))",
  gap: 16,
  marginTop: 16,
};

const card = {
  background: "#fff",
  borderRadius: 14,
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0,0,0,.08)",
};

const img = {
  width: "100%",
  height: 170,
  objectFit: "cover",
};

const body = {
  padding: 12,
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  gap: 8,
  alignItems: "center",
};

const name = {
  fontWeight: 800,
  fontSize: 14,
};

const location = {
  fontSize: 12,
  color: "#6b7280",
  marginTop: 4,
};

const price = {
  fontSize: 16,
  fontWeight: 900,
  marginTop: 6,
};

const hint = {
  marginTop: 6,
  fontSize: 11,
  color: "#92400e",
  fontWeight: 700,
};

const actions = {
  display: "flex",
  gap: 8,
  marginTop: 10,
};

const edit = {
  flex: 1,
  padding: "8px",
  background: "#16a34a",
  color: "#fff",
  border: 0,
  borderRadius: 8,
  fontWeight: 700,
};

const del = {
  flex: 1,
  padding: "8px",
  background: "#ef4444",
  color: "#fff",
  border: 0,
  borderRadius: 8,
  fontWeight: 700,
};

const badgeGreen = {
  background: "#dcfce7",
  color: "#166534",
  fontSize: 11,
  padding: "4px 8px",
  borderRadius: 999,
  fontWeight: 800,
};

const badgeYellow = {
  background: "#fef3c7",
  color: "#92400e",
  fontSize: 11,
  padding: "4px 8px",
  borderRadius: 999,
  fontWeight: 800,
};

const empty = {
  color: "#6b7280",
  marginTop: 20,
};
