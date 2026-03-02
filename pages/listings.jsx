import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import ListingSearchAndFilters from "../components/ListingSearchAndFilters";
import PropertyCard from "../components/PropertyCard";
import SearchBar from "../components/SearchBar";
import styles from "../styles/ListingsPage.module.css";

const PAGE_SIZE = 20;

export default function ListingsPage() {
  const router = useRouter();

  const {
    transaction,
    category,
    propertyType,
    search,
    bedrooms,
    budgetMin,
    budgetMax,
    areaMin,
    areaMax,
    amenities
  } = router.query;

  const [realProperties, setRealProperties] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  /* ================= REAL FETCH ================= */

  useEffect(() => {
    if (!router.isReady) return;

    setLoading(true);

    const hasFilter =
      transaction || category || propertyType || search ||
      bedrooms || budgetMin || budgetMax ||
      areaMin || areaMax || amenities;

    let url;

    if (hasFilter) {
      const query = new URLSearchParams({
        role: "PUBLIC",
        page,
        limit: PAGE_SIZE,
        ...(transaction && { transaction }),
        ...(category && { category }),
        ...(propertyType && { propertyType }),
        ...(search && { search }),
        ...(bedrooms && { bedrooms }),
        ...(budgetMin && { budgetMin }),
        ...(budgetMax && { budgetMax }),
        ...(areaMin && { areaMin }),
        ...(areaMax && { areaMax }),
        ...(amenities && { amenities })
      }).toString();

      url = `/api/properties?${query}`;
    } else {
      url = `/api/properties?role=PUBLIC&page=${page}&limit=${PAGE_SIZE}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(res => {
        const list = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
          ? res.data
          : [];

        const mapped = list.map(p => {
          let firstImage = null;

          if (Array.isArray(p.photos) && p.photos.length > 0) {
            const valid = p.photos.find(img => typeof img === "string" && img.trim());
            if (valid) firstImage = valid;
          }

          if (!firstImage && Array.isArray(p.images) && p.images.length > 0) {
            firstImage = p.images[0];
          }

          return {
            id: p._id || p.id,
            title: p.title || "Property",
            location: `${p.locality || ""}${p.city ? ", " + p.city : ""}`,
            price: formatPrice(p.price),
            description: p.description || "",
            images: firstImage ? [firstImage] : [],
            video: p.video || (Array.isArray(p.videos) ? p.videos[0] : null),
            bhk: p.bhk,
            area: p.area,
            baths: p.baths,
            amenities: p.amenities || [],
            postedBy: p.postedBy || "Owner",
            dealerName: p.dealerName || "",
            companyName: p.companyName || "",
            ownerName: p.ownerName || "",
            isApproved: true,
            isDummy: false
          };
        });

        setRealProperties(mapped);
        setTotalPages(res?.totalPages || 1);
      })
      .catch(() => setRealProperties([]))
      .finally(() => setLoading(false));

  }, [
    router.isReady,
    page,
    transaction,
    category,
    propertyType,
    search,
    bedrooms,
    budgetMin,
    budgetMax,
    areaMin,
    areaMax,
    amenities
  ]);

  /* ================= FINAL DATA ================= */

  const merged = useMemo(() => {
    return Array.isArray(realProperties) ? realProperties : [];
  }, [realProperties]);

  return (
    <div className={styles.pageWrapper}>
      <SearchBar />

      <div className={styles.listingsGrid}>
        <ListingSearchAndFilters />

        <div className={styles.resultsColumn}>
          {loading && (
            <div style={{ padding: 20 }}>Loading properties...</div>
          )}

          {!loading && merged.length === 0 && (
            <div style={{ padding: 20 }}>
              No properties found.
            </div>
          )}

          <div className={styles.cardsList}>
            {merged.map(p => (
              <PropertyCard key={p.id} {...p} />
            ))}
          </div>

          {/* ================= PAGINATION ================= */}

          {totalPages > 1 && (
            <div
              style={{
                marginTop: 25,
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                justifyContent: "center"
              }}
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pn => (
                <button
                  key={pn}
                  onClick={() => setPage(pn)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 6,
                    border: pn === page ? "2px solid #0039c9" : "1px solid #ccc",
                    background: pn === page ? "#0039c9" : "#fff",
                    color: pn === page ? "#fff" : "#000",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  {pn}
                </button>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function formatPrice(price) {
  const num = Number(price);

  if (!num || num <= 0) return "Price on Request";

  if (num >= 10000000)
    return `₹${(num / 10000000).toFixed(2)} Cr`;

  if (num >= 100000)
    return `₹${(num / 100000).toFixed(2)} Lakh`;

  return `₹${num.toLocaleString("en-IN")}`;
}
