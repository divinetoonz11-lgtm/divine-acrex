// pages/saved-properties.jsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function SavedPropertiesPage() {
  const router = useRouter();
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem("da_saved") || "[]");
      setSaved(Array.isArray(s) ? s : []);
    } catch (e) {
      setSaved([]);
    }
  }, []);

  function removeOne(index) {
    const copy = [...saved];
    copy.splice(index, 1);
    setSaved(copy);
    localStorage.setItem("da_saved", JSON.stringify(copy));
  }

  function clearAll() {
    if (!confirm("Remove all saved properties?")) return;
    setSaved([]);
    localStorage.setItem("da_saved", "[]");
  }

  function viewDetails(item) {
    // open listings with query = title
    router.push(`/listings?query=${encodeURIComponent(item.title)}`);
  }

  if (!saved.length) {
    return (
      <div style={{ padding: 28 }}>
        <h2>Saved Properties</h2>
        <p>No saved properties yet. Save from listings to see them here.</p>
        <button onClick={() => router.push("/")} style={btnStyle}>Back to home</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <h2 style={{ margin: 0 }}>Saved Properties</h2>
        <div>
          <button onClick={clearAll} style={{ ...btnStyle, background:"#ef4444" }}>Clear All</button>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
        {saved.map((p, i) => (
          <div key={i} style={{ background:"#fff", borderRadius:10, overflow:"hidden", boxShadow:"0 2px 6px rgba(0,0,0,0.06)" }}>
            <img src={p.image || "/images/listing-example-1.png"} alt={p.title} style={{ width:"100%", height:160, objectFit:"cover" }} />
            <div style={{ padding:12 }}>
              <h3 style={{ margin:"0 0 8px" }}>{p.title}</h3>
              <div style={{ color:"#6b7280", marginBottom:8 }}>{p.location || ""}</div>
              <div style={{ fontWeight:700, marginBottom:12 }}>{p.price || ""}</div>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={() => viewDetails(p)} style={btnStyle}>View</button>
                <button onClick={() => removeOne(i)} style={{ ...btnStyle, background:"#fff", border:"1px solid #e5e7eb", color:"#111" }}>Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const btnStyle = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "none",
  background: "#4f46e5",
  color: "#fff",
  cursor: "pointer"
};
