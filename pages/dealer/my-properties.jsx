import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const DUMMY_IMAGES = [
  "/images/listing-example-1.png",
  "/images/listing-example-2.png",
  "/images/listing-example-3.png",
  "/images/listing-example-4.png",
];

const PAGE_SIZE = 8;

export default function MyProperties() {
  const router = useRouter();
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  /* ===== LOAD DATA ===== */
  useEffect(() => {
    setLoading(true);

    fetch(`/api/dealer/listings?page=${page}&limit=${PAGE_SIZE}`)
      .then(r => r.json())
      .then(j => {
        setList(Array.isArray(j?.data) ? j.data : []);
        setTotalPages(j.totalPages || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page]);

  /* ===== DELETE ===== */
  async function deleteProperty(id) {
    if (!confirm("Delete property?")) return;

    setList(p => p.filter(x => x._id !== id));
    await fetch(`/api/dealer/listings?id=${id}`, { method: "DELETE" });
  }

  const getImage = (p, i) =>
    p?.images?.[0] || DUMMY_IMAGES[i % DUMMY_IMAGES.length];

  const isVerified = p => p?.verificationStatus === "VERIFIED_LIVE";

  if (loading) return <div style={pageStyle}>Loading…</div>;

  return (
    <div style={pageStyle}>
      <h2 style={title}>My Properties</h2>

      {list.length === 0 ? (
        <div style={empty}>No properties found</div>
      ) : (
        <>
          <div style={grid}>
            {list.map((p, i) => (
              <div key={p._id} style={card}>
                <img src={getImage(p, i)} style={img} />

                <div style={body}>
                  <div style={row}>
                    <b>{p.title}</b>
                    {isVerified(p) ? (
                      <span style={badgeGreen}>✔ Live Verified</span>
                    ) : (
                      <span style={badgeYellow}>⚠ Unverified</span>
                    )}
                  </div>

                  <div style={location}>{p.city}</div>
                  <div style={price}>₹ {p.price}</div>
                  <div style={{ fontSize: 12 }}>Status: {p.status}</div>

                  <div style={actions}>
                    <button
                      style={edit}
                      onClick={() =>
                        router.push(`/dealer/add-property?id=${p._id}`)
                      }
                    >
                      Edit
                    </button>

                    {!isVerified(p) && (
                      <button
                        style={verify}
                        onClick={() =>
                          router.push(`/verify-property?id=${p._id}`)
                        }
                      >
                        Verify
                      </button>
                    )}

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

          {/* PAGINATION */}
          <div style={pagination}>
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              Prev
            </button>
            <b>Page {page} / {totalPages}</b>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ===== STYLES ===== */
const pageStyle = { padding: 16, background: "#f7f7f7", minHeight: "100vh" };
const title = { fontSize: 22, fontWeight: 900 };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 };
const card = { background: "#fff", borderRadius: 12, overflow: "hidden" };
const img = { width: "100%", height: 170, objectFit: "cover" };
const body = { padding: 12 };
const row = { display: "flex", justifyContent: "space-between" };
const location = { fontSize: 12, color: "#666" };
const price = { fontSize: 16, fontWeight: 800 };
const actions = { display: "flex", gap: 8, marginTop: 10 };
const edit = { flex: 1, background: "#16a34a", color: "#fff", border: 0 };
const verify = { flex: 1, background: "#2563eb", color: "#fff", border: 0 };
const del = { flex: 1, background: "#ef4444", color: "#fff", border: 0 };
const badgeGreen = { background: "#dcfce7", padding: "4px 8px", borderRadius: 999 };
const badgeYellow = { background: "#fef3c7", padding: "4px 8px", borderRadius: 999 };
const empty = { marginTop: 20, color: "#666" };
const pagination = { display: "flex", justifyContent: "center", gap: 12, marginTop: 20 };
