// pages/listings.jsx
import React, { useState, useMemo, useEffect } from "react"; // ← ADD useEffect
import ListingSearchAndFilters from "../components/ListingSearchAndFilters";
import PropertyCard from "../components/PropertyCard";
import SearchBar from "../components/SearchBar";
import styles from "../styles/ListingsPage.module.css";

const PAGE_SIZE = 10;

export default function ListingsPage() {
  // duplicate dummy data to reach 20 so pagination visible
  const base = [
    {
      image: "/images/listing-example-1.png",
      title: "Premium Property 1",
      subtitle: "Mahalaxmi — 3 BHK Apartment",
      price: "₹85 Lacs",
      badges: ["Verified", "RERA"],
      amenities: ["Parking", "Lift", "Gym"],
    },
    {
      image: "/images/listing-example-2.png",
      title: "Premium Property 2",
      subtitle: "Malad West — 2 BHK Apartment",
      price: "₹1.1 Cr",
      badges: ["Verified"],
      amenities: ["Parking", "Swimming Pool", "Power Backup"],
    },
    {
      image: "/images/listing-example-3.png",
      title: "Premium Property 3",
      subtitle: "Juhu — 3 BHK Apartment",
      price: "₹1.6 Cr",
      badges: ["Verified", "RERA"],
      amenities: ["Gym", "Lift", "CCTV"],
    },
    {
      image: "/images/listing-example-4.png",
      title: "Premium Property 4",
      subtitle: "Goregaon East — 4 BHK Apartment",
      price: "₹2.1 Cr",
      badges: ["RERA"],
      amenities: ["Parking", "Club House", "Gym"],
    },
    {
      image: "/images/listing-example-5.png",
      title: "Premium Property 5",
      subtitle: "Bandra West — 2 BHK Apartment",
      price: "₹1.8 Cr",
      badges: [],
      amenities: ["CCTV", "Lift"],
    },
    {
      image: "/images/listing-example-6.png",
      title: "Premium Property 6",
      subtitle: "Lower Parel — 3 BHK Apartment",
      price: "₹2.5 Cr",
      badges: ["Verified"],
      amenities: ["Swimming Pool", "Gym"],
    },
    {
      image: "/images/featured-1.png",
      title: "Featured Property 1",
      subtitle: "Juhu — 4 BHK Villa",
      price: "₹4.5 Cr",
      badges: ["Featured"],
      amenities: ["Parking", "Garden", "Lift"],
    },
    {
      image: "/images/featured-2.png",
      title: "Featured Property 2",
      subtitle: "Malad — 3 BHK Apartment",
      price: "₹1.9 Cr",
      badges: ["Featured"],
      amenities: ["Gym", "Club House", "CCTV"],
    },
    {
      image: "/images/featured-3.png",
      title: "Featured Property 3",
      subtitle: "Andheri West — 2 BHK Apartment",
      price: "₹1.3 Cr",
      badges: [],
      amenities: ["Parking", "Power Backup"],
    },
    {
      image: "/images/featured-4.png",
      title: "Featured Property 4",
      subtitle: "Santacruz — Luxury 3 BHK",
      price: "₹3.7 Cr",
      badges: ["RERA"],
      amenities: ["Gym", "Parking", "Swimming Pool"],
    },
  ];

  // duplicate to 20
  const properties = [...base, ...base.map((p,i)=>({...p, title: p.title + " (More)"}))];

  // ---------- ADD: LIVE DATA ----------
  const [live, setLive] = useState([]);

  useEffect(() => {
    fetch("/api/properties?role=PUBLIC")
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d)) {
          const mapped = d.map(p => ({
            image: "/images/listing-example-1.png", // dummy image use
            title: p.title,
            subtitle: `${p.location} — ${p.propertyType}`,
            price: p.price >= 10000000
              ? `₹${(p.price/10000000).toFixed(2)} Cr`
              : `₹${(p.price/100000).toFixed(0)} Lacs`,
            badges: ["Live"],
            amenities: ["Verified"],
          }));
          setLive(mapped);
        }
      })
      .catch(()=>setLive([]));
  }, []);
  // ---------- ADD END ----------

  // ---------- ADD: MERGE (LIVE + DUMMY) ----------
  const renderProperties = [...live, ...properties];
  // ---------- ADD END ----------

  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(renderProperties.length / PAGE_SIZE);

  const paged = useMemo(() => {
    const start = (page-1)*PAGE_SIZE;
    return renderProperties.slice(start, start + PAGE_SIZE);
  }, [page, renderProperties]);

  return (
    <div className={styles.pageWrapper}>
      <SearchBar />

      <div className={styles.listingsGrid}>
        <ListingSearchAndFilters />

        <div className={styles.resultsColumn}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
            <h2 className={styles.resultsTitle}>
              {renderProperties.length} results | Property in City
            </h2>
            <div style={{color:'#6b7280'}}>
              Showing {(page-1)*PAGE_SIZE + 1} - {Math.min(page*PAGE_SIZE, renderProperties.length)} of {renderProperties.length}
            </div>
          </div>

          <div className={styles.cardsList}>
            {paged.map((p,i) => (
              <PropertyCard key={i} {...p} />
            ))}
          </div>

          <div className={styles.pagination} style={{marginTop:20}}>
            <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}>Prev</button>
            <span>Page {page} of {totalPages}</span>
            <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
