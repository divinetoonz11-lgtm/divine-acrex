import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function RecentlyViewed() {
  const [items, setItems] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const d = JSON.parse(localStorage.getItem("recently_viewed_props") || "[]");
    setItems(d);
  }, []);

  if (!items.length) return null;

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Recently Viewed</h3>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
        gap: 12
      }}>
        {items.map(p => (
          <div
            key={p._id}
            onClick={() => router.push(`/property/${p._id}`)}
            style={{
              cursor: "pointer",
              background: "#fff",
              borderRadius: 12,
              padding: 10
            }}
          >
            <img
              src={p.image || "/images/placeholder.png"}
              style={{
                width: "100%",
                height: 120,
                objectFit: "cover",
                borderRadius: 8
              }}
            />
            <div style={{ fontWeight: 700, marginTop: 6 }}>{p.title}</div>
            <div style={{ fontSize: 13 }}>{p.city}</div>
            <div style={{ color: "#1e40af", fontWeight: 800 }}>
              ₹ {p.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
