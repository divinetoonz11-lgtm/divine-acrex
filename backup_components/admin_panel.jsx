import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AdminPanel() {
  return (
    <>
      <Header />

      <main style={{
        maxWidth: 1200,
        margin: "30px auto",
        padding: "20px",
        display: "flex",
        gap: 20
      }}>
        {/* LEFT: sidebar */}
        <aside style={{
          width: 260,
          minWidth: 220,
          border: "1px solid #e6e6e6",
          padding: 16,
          borderRadius: 8,
          height: "fit-content",
          background: "#fff",
          boxShadow: "0 6px 20px rgba(2,6,23,0.03)"
        }}>
          <h3 style={{marginTop:0}}>Admin Menu</h3>
          <ul style={{paddingLeft:14, color:"#374151"}}>
            <li style={{margin:"8px 0"}}>Users</li>
            <li style={{margin:"8px 0"}}>Dealers</li>
            <li style={{margin:"8px 0"}}>Listings</li>
            <li style={{margin:"8px 0"}}>Reports</li>
            <li style={{margin:"8px 0"}}>Settings</li>
          </ul>
        </aside>

        {/* RIGHT: main content */}
        <section style={{
          flex:1,
          border: "1px solid #e6e6e6",
          borderRadius: 8,
          padding: 20,
          background: "#fff",
          boxShadow: "0 6px 20px rgba(2,6,23,0.03)"
        }}>
          <h1 style={{marginTop:0}}>Admin Panel</h1>
          <p style={{color:"#6b7280", marginBottom:18}}>Admin-only dashboard (demo)</p>

          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:12}}>
            <div style={{padding:16, borderRadius:8, background:"#f8fafc", border:"1px solid #e6eefb"}}>
              <strong>Users</strong>
              <div style={{marginTop:8, color:"#374151"}}>Total: 123 (demo)</div>
            </div>

            <div style={{padding:16, borderRadius:8, background:"#f8fafc", border:"1px solid #e6eefb"}}>
              <strong>Listings</strong>
              <div style={{marginTop:8, color:"#374151"}}>Active: 56 (demo)</div>
            </div>

            <div style={{padding:16, borderRadius:8, background:"#f8fafc", border:"1px solid #e6eefb"}}>
              <strong>Leads</strong>
              <div style={{marginTop:8, color:"#374151"}}>Today: 8 (demo)</div>
            </div>
          </div>

          <div style={{marginTop:18}}>
            <h3>Recent actions</h3>
            <ul>
              <li>Approved property ID #234</li>
              <li>Removed spam user @spam123</li>
              <li>Updated banner image</li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
