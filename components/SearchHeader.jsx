// components/SearchHeader.jsx
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";   // ⭐ Needed for live search navigation

const TYPES = ["Buy", "Rent", "PG", "Projects", "Commercial"];

export default function SearchHeader({ initialLocation = "Mahalaxmi" }) {
  const router = useRouter();

  const [openTypes, setOpenTypes] = useState(false);
  const [type, setType] = useState("Buy");
  const [location, setLocation] = useState(initialLocation);
  const [editingLocation, setEditingLocation] = useState(false);
  const [query, setQuery] = useState("");

  const typeRef = useRef();
  const locInputRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    function onDoc(e) {
      if (!typeRef.current) return;
      if (!typeRef.current.contains(e.target)) setOpenTypes(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const selectType = (t) => {
    setType(t);
    setOpenTypes(false);
  };

  const startEditLocation = () => {
    setEditingLocation(true);
    setTimeout(() => {
      if (locInputRef.current) locInputRef.current.select();
    }, 40);
  };

  const clearSearch = () => setQuery("");

  // ⭐ SEARCH WORKING DIRECTLY WITH LISTINGS PAGE
  const onSearch = () => {
    const searchText = query.trim() || location.trim();
    if (!searchText) return;

    router.push(`/listings?q=${encodeURIComponent(searchText)}`);
  };

  return (
    <div className="search-header">
      <div className="search-inner">

        {/* TYPE DROPDOWN */}
        <div className="type-wrap" ref={typeRef}>
          <button className="type-btn" onClick={() => setOpenTypes(s => !s)}>
            <span className="type-label">{type}</span>
            <span className="caret">▾</span>
          </button>

          {openTypes && (
            <div className="type-menu">
              {TYPES.map((t) => (
                <button key={t} className="type-item" onClick={() => selectType(t)}>
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* LOCATION CHIP */}
        <div className="location-wrap">
          {!editingLocation ? (
            <div className="loc-chip" onClick={startEditLocation}>
              <svg width="14" height="14" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"
                />
              </svg>
              <span className="loc-text">{location}</span>
              <button className="loc-edit">✎</button>
            </div>
          ) : (
            <div className="loc-edit-wrap">
              <input
                ref={locInputRef}
                className="loc-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onBlur={() => setEditingLocation(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setEditingLocation(false);
                }}
              />
              <button className="loc-done" onClick={() => setEditingLocation(false)}>
                Done
              </button>
            </div>
          )}
        </div>

        {/* SEARCH BOX */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search location, project or builder"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button className="clear-btn" onClick={clearSearch}>✕</button>
          )}
          <button className="search-go" onClick={onSearch}>Search</button>
        </div>

        {/* ACTION ICONS */}
        <div className="small-actions">
          <button>🎤</button>
          <button>⚙️</button>
        </div>
      </div>

      {/* STYLES */}
      <style jsx>{`
        .search-header {
          background: linear-gradient(180deg, #f3fbff, #eef9ff);
          padding: 14px 16px;
          border-radius: 10px;
          margin: 14px 0;
        }
        .search-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          gap: 12px;
          align-items: center;
        }

        /* TYPE */
        .type-wrap { position: relative; }
        .type-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 20px;
          border: 1px solid #d4e9fb;
          background: #fff;
          cursor: pointer;
        }
        .type-menu {
          position: absolute;
          top: 44px;
          left: 0;
          background: #fff;
          border: 1px solid #e3eefb;
          padding: 6px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          z-index: 20;
        }
        .type-item {
          background: none;
          border: none;
          padding: 6px 10px;
          text-align: left;
          border-radius: 5px;
        }
        .type-item:hover { background: #f2f5f9; }

        /* LOCATION */
        .location-wrap { display: flex; align-items: center; }
        .loc-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 20px;
          border: 1px solid #dde7f0;
          background: #fff;
          cursor: pointer;
        }

        .loc-edit-wrap {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .loc-input {
          padding: 8px 10px;
          border-radius: 8px;
          border: 1px solid #d6e7f6;
          width: 140px;
          max-width: 140px;
        }

        .loc-done {
          padding: 8px 10px;
          border-radius: 8px;
          background: #1e73be;
          color: #fff;
          border: none;
          cursor: pointer;
        }

        /* SEARCH BOX */
        .search-box {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .search-box input {
          flex: 1;
          padding: 10px 12px;
          border-radius: 24px;
          border: 1px solid #dcdfe3;
        }
        .search-go {
          padding: 10px 14px;
          border-radius: 20px;
          background: #0064c8;
          color: #fff;
          border: none;
          cursor: pointer;
          font-weight: 600;
        }

        @media (max-width: 900px) {
          .search-inner {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
}
