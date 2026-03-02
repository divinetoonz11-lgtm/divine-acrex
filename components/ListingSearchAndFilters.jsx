import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/ListingFilters.module.css";
import budgetPresets from "../lib/config/budgetPresets";

/* ================= CONFIG ================= */

const TRANSACTIONS = ["Buy", "Rent", "Lease"];

const CATEGORIES = ["Residential", "Commercial", "Hotel", "Agricultural"];

const FACING_OPTIONS = [
  "North", "South", "East", "West",
  "North-East", "North-West",
  "South-East", "South-West"
];

const AREA = {
  Residential: ["300", "500", "750", "1000", "1500", "2000+"],
  Commercial: ["200", "500", "1000", "2000", "5000", "10000+"],
  Hotel: ["1000", "5000", "10000", "25000", "50000", "1 Lac+"],
  Agricultural: ["1000", "2000", "5000", "10000", "20000", "50000+"],
};

const PROPERTY_TYPES = {
  Residential: ["Flat", "Villa", "Plot", "Independent House", "Studio"],
  Commercial: ["Office", "Shop", "Showroom", "Warehouse", "Factory"],
  Hotel: ["Hotel", "Resort", "Guest House", "Hostel"],
  Agricultural: [
    "Agricultural Land",
    "Farm Land",
    "Orchard",
    "Dairy Farm",
    "Plantation Land"
  ],
};

const FURNISHING = {
  Residential: ["Fully Furnished", "Semi Furnished", "Unfurnished"],
  Commercial: ["Fully Furnished", "Semi Furnished", "Bare Shell", "Warm Shell"],
  Hotel: ["Fully Operational", "Running Business", "Lease Model", "Management Contract"],
  Agricultural: ["Irrigated", "Non-Irrigated", "With Borewell", "With Electricity", "Road Access"]
};

const BEDROOMS = ["1", "2", "3", "4", "5+"];

const AMENITIES = {
  Residential: [
    "Lift", "Parking", "Gym", "Garden",
    "Security", "Swimming Pool", "Power Backup"
  ],
  Commercial: [
    "Parking", "Power Backup",
    "Lift", "Security", "CCTV"
  ],
  Hotel: [
    "Restaurant", "Banquet Hall",
    "Swimming Pool", "Parking", "Bar"
  ],
  Agricultural: [
    "Borewell", "Irrigation",
    "Electricity", "Road Access", "Fencing"
  ],
};

/* ================= COMPONENT ================= */

export default function ListingSearchAndFilters() {

  const router = useRouter();

  const [transaction, setTransaction] = useState("Buy");
  const [category, setCategory] = useState("Residential");
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [areaMin, setAreaMin] = useState("");
  const [areaMax, setAreaMax] = useState("");
  const [facing, setFacing] = useState("");
  const [furnishing, setFurnishing] = useState("");
  const [amenities, setAmenities] = useState({});

  /* ================= RESET LOGIC ================= */

  useEffect(() => {
    setBudgetMin("");
    setBudgetMax("");
  }, [transaction, category]);

  useEffect(() => {
    setPropertyType("");
    setBedrooms("");
    setAreaMin("");
    setAreaMax("");
    setAmenities({});
    setFacing("");
    setFurnishing("");
  }, [category]);

  const toggleAmenity = (a) =>
    setAmenities((prev) => ({ ...prev, [a]: !prev[a] }));

  const resetAll = () => {
    setTransaction("Buy");
    setCategory("Residential");
    setPropertyType("");
    setBedrooms("");
    setBudgetMin("");
    setBudgetMax("");
    setAreaMin("");
    setAreaMax("");
    setFacing("");
    setFurnishing("");
    setAmenities({});
    router.push("/listings");
  };

  const handleApply = () => {

    const selectedAmenities = Object.keys(amenities)
      .filter(a => amenities[a])
      .join(",");

    router.push({
      pathname: "/listings",
      query: {
        transaction,
        category,
        ...(propertyType && { propertyType }),
        ...(bedrooms && { bedrooms }),
        ...(budgetMin && { budgetMin }),
        ...(budgetMax && { budgetMax }),
        ...(areaMin && { areaMin }),
        ...(areaMax && { areaMax }),
        ...(facing && { facing }),
        ...(furnishing && { furnishing }),
        ...(selectedAmenities && { amenities: selectedAmenities })
      }
    });
  };

  return (
    <aside className={styles.filterBox}>
      <div className={styles.filterBoxInner}>

        <div className={styles.sectionTitle}>Filters</div>

        <div className={styles.subLabel}>Transaction</div>
        <select className={styles.select} value={transaction}
          onChange={(e) => setTransaction(e.target.value)}>
          {TRANSACTIONS.map(t => <option key={t}>{t}</option>)}
        </select>

        <div className={styles.subLabel}>Property Category</div>
        <select className={styles.select} value={category}
          onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>

        <div className={styles.subLabel}>Property Type</div>
        <select className={styles.select}
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}>
          <option value="">Any</option>
          {PROPERTY_TYPES[category].map(p =>
            <option key={p}>{p}</option>
          )}
        </select>

        <div className={styles.subLabel}>Facing</div>
        <select className={styles.select}
          value={facing}
          onChange={(e) => setFacing(e.target.value)}>
          <option value="">Any</option>
          {FACING_OPTIONS.map(f =>
            <option key={f}>{f}</option>
          )}
        </select>

        <div className={styles.subLabel}>Furnishing</div>
        <select className={styles.select}
          value={furnishing}
          onChange={(e) => setFurnishing(e.target.value)}>
          <option value="">Any</option>
          {FURNISHING[category].map(f =>
            <option key={f}>{f}</option>
          )}
        </select>

        {category === "Residential" && (
          <>
            <div className={styles.subLabel}>Bedrooms</div>
            <select className={styles.select}
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}>
              <option value="">Any</option>
              {BEDROOMS.map(b =>
                <option key={b}>{b}</option>
              )}
            </select>
          </>
        )}

        <div className={styles.subLabel}>Budget</div>
        <div className={styles.rowGrid}>
          <select className={styles.selectSmall}
            value={budgetMin}
            onChange={(e) => setBudgetMin(e.target.value)}>
            <option value="">Min</option>
            {budgetPresets[category]?.[transaction]?.map(b =>
              <option key={b}>{b}</option>
            )}
          </select>

          <select className={styles.selectSmall}
            value={budgetMax}
            onChange={(e) => setBudgetMax(e.target.value)}>
            <option value="">Max</option>
            {budgetPresets[category]?.[transaction]?.map(b =>
              <option key={b}>{b}</option>
            )}
          </select>
        </div>

        <div className={styles.subLabel}>Area (sq.ft.)</div>
        <div className={styles.rowGrid}>
          <select className={styles.selectSmall}
            value={areaMin}
            onChange={(e) => setAreaMin(e.target.value)}>
            <option value="">Min</option>
            {AREA[category].map(a =>
              <option key={a}>{a}</option>
            )}
          </select>

          <select className={styles.selectSmall}
            value={areaMax}
            onChange={(e) => setAreaMax(e.target.value)}>
            <option value="">Max</option>
            {AREA[category].map(a =>
              <option key={a}>{a}</option>
            )}
          </select>
        </div>

        <div className={styles.subLabel}>Amenities</div>
        <div className={styles.amenitiesList}>
          {AMENITIES[category].map(a =>
            <label key={a} className={styles.checkbox}>
              <input
                type="checkbox"
                checked={!!amenities[a]}
                onChange={() => toggleAmenity(a)}
              />
              {a}
            </label>
          )}
        </div>

        <div className={styles.actions}>
          <button className={styles.reset} onClick={resetAll}>
            Reset
          </button>
          <button className={styles.apply} onClick={handleApply}>
            Apply
          </button>
        </div>

      </div>
    </aside>
  );
}