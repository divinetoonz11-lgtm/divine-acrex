// pages/listings.jsx
import React, { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import FilterPanel from "../components/FilterPanel";
import PropertyCard from "../components/PropertyCard";
import SearchHeader from "../components/SearchHeader";
import { LISTING_IMAGES } from "./listings-images";

// SAMPLE DATA (50 properties)
const SAMPLE_LISTINGS = Array.from({ length: 50 }).map((_, i) => {
  const img = LISTING_IMAGES[i % LISTING_IMAGES.length];
  return {
    id: i + 1,
    title: `Premium Property ${i + 1}`,
    subtitle: `${["Mahalaxmi","Bandra","Andheri","Juhu","Lower Parel","Powai"][i % 6]} — ${
      i % 3 === 0 ? "3 BHK" : i % 3 === 1 ? "2 BHK" : "4 BHK"
    } Apartment`,
    priceLakh: i % 3 === 0 ? 85 : i % 3 === 1 ? 160 : 320,
    price: i % 3 === 0 ? "₹85 Lacs" : i % 3 === 1 ? "₹1.6 Cr" : "₹3.2 Cr",
    image: img.publicPath,
    status: i % 2 === 0 ? "Under Construction" : "Ready to move",
    beds: i % 3 === 0 ? "3 BHK" : i % 3 === 1 ? "2 BHK" : "4 BHK",
    nearby: ["Mahalaxmi Railway Station", "Wockhardt Hospital", "Andheri West"][i % 3],
    amenities: ["Parking","Lift","Gymnasium","Swimming Pool","CCTV","Power Backup"],
    verified: i % 3 === 0,
    area: i % 3 === 0 ? 850 : i % 3 === 1 ? 1200 : 1600,
  };
});

export default function ListingsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const resultsRef = useRef(null);

  // LOAD FILTERS + SEARCH + PAGE FROM URL
  useEffect(() => {
    if (!router.isReady) return;

    const q = (router.query.q || "").toString();
    const mode = (router.query.mode || "").toString();
    const category = (router.query.category || "").toString();
    const pageFromUrl = parseInt(router.query.page || "1");

    setSearchQuery(q);
    setPage(pageFromUrl);

    const init = {};
    if (category && category !== "All Residential") init.type = [category];
    if (mode) init.mode = [mode];

    setSelected((prev) => ({ ...prev, ...init }));
  }, [router.isReady, router.query]);

  // HANDLE TOGGLES
  const handleToggle = useCallback(
    (key, val) => {
      if (key === "__reset_all__") {
        setSelected({});
        setSearchQuery("");
        router.replace("/listings", undefined, { shallow: true });
        return;
      }

      if (key === "priceRange" || key === "areaRange") {
        setSelected((p) => ({ ...p, [key]: val }));
        setPage(1);
        return;
      }

      setSelected((prev) => {
        const cur = Array.isArray(prev[key]) ? prev[key] : [];
        const exists = cur.includes(val);
        const next = exists ? cur.filter((x) => x !== val) : [...cur, val];
        return { ...prev, [key]: next };
      });

      setPage(1);
    },
    [router]
  );

  // FILTER LOGIC
  function matchFilter(listing, filters) {
    if (!filters || Object.keys(filters).length === 0) {
      if (!searchQuery) return true;
      const t = searchQuery.toLowerCase();
      return (
        listing.title.toLowerCase().includes(t) ||
        listing.subtitle.toLowerCase().includes(t) ||
        listing.nearby.toLowerCase().includes(t)
      );
    }

    if (searchQuery) {
      const t = searchQuery.toLowerCase();
      if (
        !(
          listing.title.toLowerCase().includes(t) ||
          listing.subtitle.toLowerCase().includes(t) ||
          listing.nearby.toLowerCase().includes(t)
        )
      )
        return false;
    }

    for (const key of Object.keys(filters)) {
      const sel = filters[key];
      if (!sel || (Array.isArray(sel) && sel.length === 0)) continue;

      if (key === "bhk" && !sel.includes(listing.beds)) return false;
      if (key === "status" && !sel.includes(listing.status)) return false;

      if (key === "amenities") {
        if (!sel.some((s) => listing.amenities.includes(s))) return false;
      }

      if (key === "verified" && sel.includes("Verified") && !listing.verified) return false;

      if (key === "priceRange" && sel.low != null) {
        if (listing.priceLakh < sel.low || listing.priceLakh > sel.high) return false;
      }

      if (key === "areaRange" && sel.low != null) {
        if (listing.area < sel.low || listing.area > sel.high) return false;
      }
    }
    return true;
  }

  // FILTER + PAGINATION
  const filteredAll = useMemo(
    () => SAMPLE_LISTINGS.filter((l) => matchFilter(l, selected)),
    [selected, searchQuery]
  );

  const totalPages = Math.ceil(filteredAll.length / perPage);
  const filtered = filteredAll.slice((page - 1) * perPage, page * perPage);

  // SAFE URL UPDATE (NO LOOP / NO THROTTLING)
  useEffect(() => {
    if (!router.isReady) return;

    const params = {};
    if (searchQuery) params.q = searchQuery;
    if (selected.mode?.length) params.mode = selected.mode[0];
    if (selected.type?.length) params.category = selected.type[0];
    if (page > 1) params.page = page;

    const current = router.query || {};

    if (JSON.stringify(current) !== JSON.stringify(params)) {
      router.replace({ pathname: "/listings", query: params }, undefined, { shallow: true });
    }
  }, [router.isReady, searchQuery, selected, page]);

  // SCROLL FIX
  useEffect(() => {
    const t = setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 150);
    return () => clearTimeout(t);
  }, [searchQuery, selected, page]);

  return (
    <div className="listings-page" style={{ paddingBottom: 40 }}>
      <SearchHeader initialLocation="Mahalaxmi" />

      <header className="listings-topbar" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <button
              onClick={() => (window.location.href = "/")}
              style={{ background: "transparent", border: "none", color: "#0064c8", cursor: "pointer" }}
            >
              Home
            </button>
            &nbsp;›&nbsp; Property in City
          </div>
          <div>{filteredAll.length} results | Property in City</div>
        </div>
      </header>

      <div style={{ display: "flex", gap: 20 }}>
        <aside style={{ width: 320 }}>
          <FilterPanel selectedFilters={selected} onToggle={handleToggle} />
        </aside>

        <section style={{ flex: 1 }}>
          <div ref={resultsRef} style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 18 }}>Results</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(1,1fr)", gap: 16 }}>
            {filtered.map((p) => (
              <PropertyCard key={p.id} item={p} />
            ))}
          </div>

          {/* PAGINATION */}
          <div style={{ marginTop: 30, display: "flex", justifyContent: "center", gap: 12 }}>
            <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}>Prev</button>
            <span>Page {page} of {totalPages}</span>
            <button onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}>Next</button>
          </div>
        </section>
      </div>
    </div>
  );
}
