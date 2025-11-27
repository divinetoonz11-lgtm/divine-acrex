import React, { useState } from "react";

export default function SearchBar({ onSearch = () => {} }) {
  const [q, setQ] = useState("");

  const submit = (e) => {
    e?.preventDefault();
    onSearch(q);
  };

  return (
    <form
      onSubmit={submit}
      style={{
        display: "flex",
        gap: 15,                  
        alignItems: "center",
        background: "#ffffff",
        padding: "18px 20px",     
        borderRadius: 15,
        boxShadow: "0 8px 24px rgba(16,24,40,0.12)",
        border: "1px solid rgba(0,0,0,0.05)",
        width: "100%",
        maxWidth: 960,            
        margin: "0 auto",
        position: "relative",
        zIndex: 9999,
      }}
    >
      {/* Buy / Rent */}
      <select
        style={{
          padding: "15px 17px",
          borderRadius: 12,
          border: "1px solid #e6e6e6",
          background: "#fff",
        }}
      >
        <option>Buy</option>
        <option>Rent</option>
      </select>

      {/* FINAL 6 OPTIONS */}
      <select
        style={{
          padding: "15px 17px",
          borderRadius: 12,
          border: "1px solid #e6e6e6",
          background: "#fff",
        }}
      >
        <option>All Residential</option>
        <option>Apartment</option>
        <option>Plot</option>
        <option>Commercial</option>
        <option>Projects</option>
        <option>New Launch</option>
      </select>

      {/* Search Input */}
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search city, locality or project (eg. Malad West)"
        style={{
          flex: 1,
          padding: "18px 20px",
          borderRadius: 12,
          border: "1px solid #e6e6e6",
          outline: "none",
          fontSize: 16.5,
          background: "#fff",
        }}
      />

      {/* Search Button */}
      <button
        type="submit"
        style={{
          padding: "15px 25px",
          borderRadius: 999,
          background: "#6b21a8",
          color: "#fff",
          border: "none",
          fontWeight: 600,
          cursor: "pointer",
          fontSize: 15.5,
        }}
      >
        Search
      </button>
    </form>
  );
}
