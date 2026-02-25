import { useEffect, useState } from "react";
import Link from "next/link";

export default function PropertyControlIndex() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    loadData();
  }, [page]);

  const loadData = async () => {
    setLoading(true);

    const params = new URLSearchParams({
      page,
      limit: 12,
      search,
      city,
      type,
    });

    try {
      const res = await fetch(
        `/api/admin/property-control?${params.toString()}`
      );
      const data = await res.json();

      if (data.ok) {
        setProperties(data.properties || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (e) {
      console.error("Property control load error", e);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    setPage(1);
    loadData();
  };

  const hideProperty = async (id) => {
    if (!confirm("Hide this property from admin & site?")) return;

    await fetch("/api/admin/properties/hide", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    setProperties((prev) => prev.filter((p) => p._id !== id));
  };

  if (loading) {
    return <p style={{ padding: 20 }}>Loading...</p>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>Property Control</h2>

      {/* FILTER BAR */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <input
          placeholder="Search title / user / dealer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={input}
        />

        <input
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={input}
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={input}
        >
          <option value="">All Types</option>
          <option value="Flat / Apartment">Flat / Apartment</option>
          <option value="Industrial Unit">Industrial Unit</option>
          <option value="Hotel">Hotel</option>
        </select>

        <button onClick={applyFilter} style={btn}>
          Search
        </button>
      </div>

      {/* PROPERTY GRID */}
      {properties.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        <div style={grid}>
          {properties.map((p) => (
            <div key={p._id} style={card}>
              <div style={imgBox}>
                {Array.isArray(p.images) && p.images.length > 0 ? (
                  <img
                    src={p.images[0]}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      color: "#9ca3af",
                      fontSize: 12,
                    }}
                  >
                    No Image
                  </div>
                )}
              </div>

              <div style={{ padding: 12 }}>
                <strong>{p.title}</strong>

                <div style={muted}>
                  {p.city} • {p.propertyType}
                </div>

                <div style={{ marginTop: 4 }}>
                  ₹ {Number(p.price).toLocaleString("en-IN")}
                </div>

                <div style={actions}>
                  {/* ✅ Correct Edit Route */}
                  <Link href={`/admin/properties/${p._id}`}>
                    <button
                      style={{ ...btn, background: "#2563eb" }}
                    >
                      Edit
                    </button>
                  </Link>

                  <button
                    onClick={() => hideProperty(p._id)}
                    style={{ ...btn, background: "#dc2626" }}
                  >
                    Hide
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      <div style={{ marginTop: 24, display: "flex", gap: 8 }}>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          style={btn}
        >
          Prev
        </button>

        <span style={{ padding: "6px 10px" }}>
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          style={btn}
        >
          Next
        </button>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
  gap: 16,
};

const card = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  background: "#fff",
  overflow: "hidden",
};

const imgBox = {
  height: 160,
  background: "#f3f4f6",
};

const actions = {
  display: "flex",
  gap: 6,
  marginTop: 10,
};

const btn = {
  padding: "6px 10px",
  fontSize: 13,
  borderRadius: 8,
  border: "none",
  background: "#111827",
  color: "#fff",
  cursor: "pointer",
};

const input = {
  padding: "6px 10px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  fontSize: 13,
};

const muted = {
  fontSize: 12,
  color: "#6b7280",
};
