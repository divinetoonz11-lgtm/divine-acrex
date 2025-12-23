import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const DUMMY_IMAGES = [
  "/images/listing-example-1.png",
  "/images/listing-example-2.png",
  "/images/listing-example-3.png",
  "/images/listing-example-4.png",
];

export default function MyProperties() {
  const router = useRouter();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dealer/listings")
      .then((r) => r.json())
      .then((j) => {
        setList(j.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const deleteProperty = async (id) => {
    if (!confirm("Delete property?")) return;
    await fetch(`/api/properties/${id}`, { method: "DELETE" });
    setList((p) => p.filter((x) => x._id !== id));
  };

  const getImage = (p, index) => {
    if (p.images && p.images.length > 0) return p.images[0];
    return DUMMY_IMAGES[index % DUMMY_IMAGES.length];
  };

  if (loading) return <div style={page}>Loading…</div>;

  return (
    <div style={page}>
      <h2 style={title}>My Properties</h2>

      <div style={grid}>
        {list.length === 0 ? (
          <div style={empty}>No properties found</div>
        ) : (
          list.map((p, i) => (
            <div key={p._id} style={card}>
              <img src={getImage(p, i)} style={img} />

              <div style={body}>
                <div style={name}>{p.title}</div>
                <div style={location}>{p.location}</div>
                <div style={price}>₹ {p.price}</div>

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
          ))
        )}
      </div>
    </div>
  );
}

/* ================= STYLES (99acres feel) ================= */

const page = {
  padding: 28,
  background: "#f7f7f7",
  minHeight: "100vh",
};

const title = {
  fontSize: 24,
  fontWeight: 900,
  color: "#111827",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
  gap: 20,
  marginTop: 20,
};

const card = {
  background: "#ffffff",
  borderRadius: 12,
  overflow: "hidden",
  boxShadow: "0 4px 14px rgba(0,0,0,.08)",
  transition: "transform .2s",
};

const img = {
  width: "100%",
  height: 180,
  objectFit: "cover",
};

const body = {
  padding: 14,
};

const name = {
  fontWeight: 800,
  fontSize: 15,
  lineHeight: "1.3",
};

const location = {
  fontSize: 13,
  color: "#6b7280",
  marginTop: 4,
};

const price = {
  fontWeight: 900,
  fontSize: 16,
  marginTop: 6,
  color: "#111827",
};

const actions = {
  display: "flex",
  gap: 10,
  marginTop: 12,
};

const edit = {
  flex: 1,
  padding: "8px 0",
  background: "#16a34a",
  color: "#fff",
  border: 0,
  borderRadius: 8,
  fontWeight: 700,
  cursor: "pointer",
};

const del = {
  flex: 1,
  padding: "8px 0",
  background: "#ef4444",
  color: "#fff",
  border: 0,
  borderRadius: 8,
  fontWeight: 700,
  cursor: "pointer",
};

const empty = {
  color: "#6b7280",
};
