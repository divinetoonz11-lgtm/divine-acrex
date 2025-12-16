// pages/recent-searches.jsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function RecentSearchesPage(){
  const router = useRouter();
  const [list, setList] = useState([]);

  useEffect(()=>{
    try{
      const s = JSON.parse(localStorage.getItem("da_recent") || "[]");
      setList(Array.isArray(s) ? s : []);
    }catch(e){
      setList([]);
    }
  },[]);

  function runSearch(q){
    if(!q) return;
    // push to listings page and also update recent (move clicked to top)
    const updated = [q, ...list.filter(x=>x!==q)].slice(0,20);
    setList(updated);
    localStorage.setItem("da_recent", JSON.stringify(updated));
    router.push(`/listings?query=${encodeURIComponent(q)}`);
  }

  function removeOne(idx){
    const copy = [...list];
    copy.splice(idx,1);
    setList(copy);
    localStorage.setItem("da_recent", JSON.stringify(copy));
  }

  function clearAll(){
    if(!confirm("Clear recent searches?")) return;
    setList([]);
    localStorage.setItem("da_recent", "[]");
  }

  // helper to add a demo search (for testing)
  function addDemo(){
    const q = prompt("Type demo search (e.g. Malad West)");
    if(!q) return;
    const updated = [q, ...list.filter(x=>x!==q)].slice(0,20);
    setList(updated);
    localStorage.setItem("da_recent", JSON.stringify(updated));
  }

  return (
    <div style={{ padding:28 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
        <h2 style={{ margin:0 }}>Recent Searches</h2>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={addDemo} style={btn}>Add demo</button>
          <button onClick={clearAll} style={{ ...btn, background:"#ef4444" }}>Clear All</button>
        </div>
      </div>

      {list.length===0 && <div style={{ color:"#6b7280" }}>No recent searches yet. Use search to add recent items.</div>}

      <ul style={{ listStyle:"none", padding:0, marginTop:12 }}>
        {list.map((q, i)=>(
          <li key={i} style={{ background:"#fff", borderRadius:8, padding:12, marginBottom:8, display:"flex", justifyContent:"space-between", alignItems:"center", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ display:"flex", gap:12, alignItems:"center" }}>
              <div style={{ width:44, height:44, borderRadius:8, background:"#eef2ff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, color:"#4f46e5" }}>S</div>
              <div>
                <div style={{ fontWeight:600 }}>{q}</div>
                <div style={{ color:"#6b7280", fontSize:13 }}>Searched earlier</div>
              </div>
            </div>

            <div style={{ display:"flex", gap:8 }}>
              <button onClick={()=>runSearch(q)} style={btn}>Search</button>
              <button onClick={()=>removeOne(i)} style={{ ...btn, background:"#fff", border:"1px solid #e5e7eb", color:"#111" }}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const btn = {
  padding:"8px 12px",
  borderRadius:8,
  border:"none",
  background:"#4f46e5",
  color:"#fff",
  cursor:"pointer"
};
