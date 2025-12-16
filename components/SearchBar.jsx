import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const CATEGORY_OPTIONS = {
  Residential: [
    "Flat / Apartment",
    "Villa / House",
    "Plot / Land",
    "Studio / 1RK"
  ],
  Commercial: [
    "Office",
    "Shop",
    "Showroom",
    "Warehouse",
    "Factory"
  ],
  Hotel: [
    "Hotel",
    "Resort",
    "Guest House",
    "Hostel"
  ]
};

export default function SearchBar() {
  const router = useRouter();

  const [transaction, setTransaction] = useState("Buy");
  const [category, setCategory] = useState("Residential");
  const [subType, setSubType] = useState("");
  const [keyword, setKeyword] = useState("");

  // category change पर subtype reset
  useEffect(() => {
    setSubType("");
  }, [category]);

  function handleSearch() {
    router.push({
      pathname: "/listings",
      query: {
        t: transaction,
        c: category,
        type: subType,
        q: keyword
      }
    });
  }

  return (
    <div className="sbWrap">
      <div className="sbBox">

        {/* Buy / Rent / Lease */}
        <select
          className="sbSelect small"
          value={transaction}
          onChange={(e) => setTransaction(e.target.value)}
        >
          <option>Buy</option>
          <option>Rent</option>
          <option>Lease</option>
        </select>

        {/* Category */}
        <select
          className="sbSelect"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Residential</option>
          <option>Commercial</option>
          <option>Hotel</option>
        </select>

        {/* Sub Category (Dynamic) */}
        <select
          className="sbSelect"
          value={subType}
          onChange={(e) => setSubType(e.target.value)}
        >
          <option value="">All Types</option>
          {CATEGORY_OPTIONS[category].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>

        {/* Search input */}
        <input
          className="sbInput"
          placeholder={
            category === "Hotel"
              ? "Hotel / Resort name, City…"
              : "City, Locality, Project…"
          }
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />

        {/* Button */}
        <button className="sbBtn" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* CSS */}
      <style jsx>{`
        .sbWrap {
          background: linear-gradient(180deg, #1e3a8a, #274a9d);
          padding: 18px 12px;
        }

        .sbBox {
          max-width: 1100px;
          margin: auto;
          background: #fff;
          border-radius: 999px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.15);
        }

        .sbSelect {
          border: none;
          background: #f1f5ff;
          padding: 10px 12px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 600;
          color: #0f2a66;
          outline: none;
        }

        .sbSelect.small {
          min-width: 90px;
          text-align: center;
        }

        .sbInput {
          flex: 1;
          border: none;
          outline: none;
          padding: 10px 14px;
          font-size: 14px;
        }

        .sbBtn {
          background: #0039c9;
          color: #fff;
          border: none;
          padding: 10px 22px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }

        .sbBtn:hover {
          background: #002b9e;
        }

        /* Mobile */
        @media (max-width: 768px) {
          .sbBox {
            flex-wrap: wrap;
            border-radius: 14px;
          }

          .sbSelect,
          .sbInput,
          .sbBtn {
            width: 100%;
            border-radius: 10px;
          }
        }
      `}</style>
    </div>
  );
}
