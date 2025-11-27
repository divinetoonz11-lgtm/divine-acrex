import React, { useState } from "react";

export default function ListingSearchAndFilters() {
  const priceOptions = [
    { label: "₹5 Lakh", value: 500000 },
    { label: "₹10 Lakh", value: 1000000 },
    { label: "₹20 Lakh", value: 2000000 },
    { label: "₹30 Lakh", value: 3000000 },
    { label: "₹50 Lakh", value: 5000000 },
    { label: "₹1 Crore", value: 10000000 },
    { label: "₹2 Crore", value: 20000000 },
    { label: "₹5 Crore", value: 50000000 },
  ];

  const areaOptions = [200,300,500,750,1000,1200,1500,1800,2000];

  const [tab, setTab] = useState("rent");
  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");

  function onSearch(e) {
    e.preventDefault();
    const q = { tab, query, minPrice, maxPrice, minArea, maxArea };
    console.log("Search:", q);
    alert("Search parameters printed to console.");
  }

  return (
    <div style={{fontFamily:'Arial, sans-serif'}}>
      <header style={{background:'#0f172a',color:'white',padding:20}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',maxWidth:1100,margin:'0 auto'}}>
          <h1 style={{margin:0}}>Divine99acres</h1>
          <div>
            <button style={{marginRight:8}}>Post Property</button>
            <button>Login</button>
          </div>
        </div>
      </header>

      <div style={{maxWidth:1100,margin:'20px auto',display:'flex',gap:20}}>
        <aside style={{width:280,background:'white',padding:16,borderRadius:8}}>
          <h3>Filters</h3>

          <div style={{marginTop:12}}>
            <label style={{display:'block',fontSize:13,color:'#374151'}}>Budget</label>
            <div style={{display:'flex',gap:8,marginTop:8}}>
              <select value={minPrice} onChange={e=>setMinPrice(e.target.value)} style={{flex:1,padding:8}}>
                <option value="">No min</option>
                {priceOptions.map(p=> <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
              <select value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} style={{flex:1,padding:8}}>
                <option value="">No max</option>
                {priceOptions.map(p=> <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
          </div>

          <div style={{marginTop:12}}>
            <label style={{display:'block',fontSize:13,color:'#374151'}}>Area (sqft)</label>
            <div style={{display:'flex',gap:8,marginTop:8}}>
              <select value={minArea} onChange={e=>setMinArea(e.target.value)} style={{flex:1,padding:8}}>
                <option value="">No min</option>
                {areaOptions.map(a=> <option key={a} value={a}>{a} sqft</option>)}
              </select>
              <select value={maxArea} onChange={e=>setMaxArea(e.target.value)} style={{flex:1,padding:8}}>
                <option value="">No max</option>
                {areaOptions.map(a=> <option key={a} value={a}>{a} sqft</option>)}
              </select>
            </div>
          </div>
        </aside>

        <main style={{flex:1}}>
          <div style={{background:'white',padding:16,borderRadius:8,marginBottom:12}}>
            <form onSubmit={onSearch} style={{display:'flex',gap:8,alignItems:'center'}}>
              <div>
                <button type="button" onClick={()=>setTab('buy')} style={{marginRight:6,padding:8,background:tab==='buy'?'#0369a1':'#e6e7eb'}}>Buy</button>
                <button type="button" onClick={()=>setTab('rent')} style={{padding:8,background:tab==='rent'?'#0369a1':'#e6e7eb'}}>Rent</button>
              </div>

              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder='Search "Hyderabad"' style={{flex:1,padding:10}} />

              <button type="submit" style={{padding:'8px 12px',background:'#0369a1',color:'white'}}>Search</button>
            </form>
          </div>

          <div>
            {[1,2,3].map(i=>(
              <div key={i} style={{display:'flex',gap:12,background:'white',padding:12,borderRadius:8,marginBottom:12}}>
                <div style={{width:140,height:100,background:'#f3f4f6'}}></div>
                <div style={{flex:1}}>
                  <h4 style={{margin:0}}>2 BHK Apartment, 3 Baths</h4>
                  <div style={{color:'#6b7280'}}>Malad West</div>
                  <div style={{marginTop:8,fontWeight:700,color:'#0ea5a4'}}>₹ 80,000 /month</div>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  <button>View Number</button>
                  <button style={{background:'#0369a1',color:'white'}}>Contact</button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
