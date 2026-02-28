import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import ListingSearchAndFilters from "../components/ListingSearchAndFilters";
import PropertyCard from "../components/PropertyCard";
import SearchBar from "../components/SearchBar";
import styles from "../styles/ListingsPage.module.css";

const PAGE_SIZE = 12;

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

  /* ================= REAL FETCH ================= */

  useEffect(() => {

    if (!router.isReady) return;

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
      .catch(() => setRealProperties([]));

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

  /* ================= 10 DUMMY PROPERTIES ================= */

  const dummyProperties = [

    {
      id: "listing-1",
      title: "2 BHK Flat for Sale in Bandra West",
      location: "Bandra West, Mumbai",
      price: "₹1.95 Cr",
      images: ["/images/listing-example-1.png"],
      bhk: 2,
      area: 980,
      baths: 2,
      amenities: ["Lift", "Parking", "Security", "Power Backup"],
      postedBy: "Dealer",
      companyName: "Divine Acres Realty",
      isApproved: true,
      isDummy: true
    },

    {
      id: "listing-2",
      title: "3 BHK Premium in Powai",
      location: "Powai, Mumbai",
      price: "₹2.75 Cr",
      images: ["/images/listing-example-2.png"],
      bhk: 3,
      area: 1350,
      baths: 2,
      amenities: ["Swimming Pool", "Gym", "Club House"],
      postedBy: "Owner",
      isApproved: true,
      isDummy: true
    },

    {
      id: "listing-3",
      title: "2 BHK Rent in Andheri West",
      location: "Andheri West, Mumbai",
      price: "₹65,000 / month",
      images: ["/images/listing-example-3.png"],
      bhk: 2,
      area: 850,
      baths: 2,
      amenities: ["Lift", "Parking", "Security"],
      postedBy: "Dealer",
      companyName: "Metro Homes",
      isApproved: true,
      isDummy: true
    },

    {
      id: "listing-4",
      title: "4 BHK Luxury in Juhu",
      location: "Juhu, Mumbai",
      price: "₹5.00 Cr",
      images: ["/images/listing-example-4.png"],
      bhk: 4,
      area: 1800,
      baths: 3,
      amenities: ["Swimming Pool", "Gym", "Lift"],
      postedBy: "Dealer",
      companyName: "Sudocaz India Pvt Ltd",
      isApproved: true,
      isDummy: true
    },

    {
      id: "listing-5",
      title: "3 BHK in Malad West",
      location: "Malad West, Mumbai",
      price: "₹1.85 Cr",
      images: ["/images/listing-example-5.png"],
      bhk: 3,
      area: 1200,
      baths: 2,
      amenities: ["Club House", "Gym", "Lift"],
      postedBy: "Owner",
      isApproved: true,
      isDummy: true
    },

    {
      id: "listing-6",
      title: "2 BHK in Goregaon East",
      location: "Goregaon East, Mumbai",
      price: "₹1.55 Cr",
      images: ["/images/listing-example-6.png"],
      bhk: 2,
      area: 900,
      baths: 2,
      amenities: ["Lift", "Security", "Power Backup"],
      postedBy: "Dealer",
      companyName: "Urban Living Realty",
      isApproved: true,
      isDummy: true
    }

  ];

  /* ================= MERGED ================= */

  const merged = useMemo(() => {
    return [
      ...(Array.isArray(realProperties) ? realProperties : []),
      ...dummyProperties
    ];
  }, [realProperties]);

  return (
    <div className={styles.pageWrapper}>
      <SearchBar />

      <div className={styles.listingsGrid}>
        <ListingSearchAndFilters />

        <div className={styles.resultsColumn}>
          <div className={styles.cardsList}>
            {merged.map(p => (
              <PropertyCard key={p.id} {...p} />
            ))}
          </div>
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