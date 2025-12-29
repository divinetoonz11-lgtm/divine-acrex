import React, { useState, useEffect } from "react";
import styles from "../styles/ListingFilters.module.css";
import budgetPresets from "../lib/config/budgetPresets";

/* ================= CONFIG ================= */

const TRANSACTIONS = ["Buy", "Rent", "Lease"];
const CATEGORIES = ["Residential", "Commercial", "Hotel"];

const AREA = {
  Residential: ["300", "500", "750", "1000", "1500", "2000+"],
  Commercial: ["200", "500", "1000", "2000", "5000", "10000+"],
  Hotel: ["1000", "5000", "10000", "25000", "50000", "1 Lac+"],
};

const PROPERTY_TYPES = {
  Residential: ["Flat", "Villa", "Plot", "Independent House", "Studio"],
  Commercial: ["Office", "Shop", "Showroom", "Warehouse", "Factory"],
  Hotel: ["Hotel", "Resort", "Guest House", "Hostel"],
};

const BEDROOMS = ["1", "2", "3", "4", "5+"];

const AMENITIES = {
  Residential: ["Lift", "Parking", "Gym", "Garden", "Security", "Swimming Pool"],
  Commercial: ["Parking", "Power Backup", "Lift", "Security"],
  Hotel: ["Restaurant", "Banquet Hall", "Swimming Pool", "Parking", "Bar"],
};

/* ================= COMPONENT ================= */

export default function ListingSearchAndFilters() {
  const [transaction, setTransaction] = useState("Buy");
  const [category, setCategory] = useState("Residential");
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [areaMin, setAreaMin] = useState("");
  const [areaMax, setAreaMax] = useState("");
  const [amenities, setAmenities] = useState({});

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
  }, [category]);

  function toggleAmenity(a) {
    setAmenities((p) => ({ ...p, [a]: !p[a] }));
  }

  function resetAll() {
    setTransaction("Buy");
    setCategory("Residential");
    setPropertyType("");
    setBedrooms("");
    setBudgetMin("");
    setBudgetMax("");
    setAreaMin("");
    setAreaMax("");
    setAmenities({});
  }

  return (
    <aside className={styles.filterBox}>
      <div className={styles.filterBoxInner}>
        <div className={styles.sectionTitle}>Filters</div>

        <div className={styles.subLabel}>Transaction</div>
        <select className={styles.select} value={transaction} onChange={(e) => setTransaction(e.target.value)}>
          {TRANSACTIONS.map((t) => <option key={t}>{t}</option>)}
        </select>

        <div className={styles.subLabel}>Property Category</div>
        <select className={styles.select} value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>

        <div className={styles.subLabel}>Property Type</div>
        <select className={styles.select} value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
          <option value="">Any</option>
          {PROPERTY_TYPES[category].map((p) => <option key={p}>{p}</option>)}
        </select>

        {category === "Residential" && (
          <>
            <div className={styles.subLabel}>Bedrooms</div>
            <select className={styles.select} value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}>
              <option value="">Any</option>
              {BEDROOMS.map((b) => <option key={b}>{b}</option>)}
            </select>
          </>
        )}

        <div className={styles.subLabel}>Budget</div>
        <div className={styles.rowGrid}>
          <select className={styles.selectSmall} value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)}>
            <option value="">Min</option>
            {budgetPresets[category][transaction].map((b) => <option key={b}>{b}</option>)}
          </select>
          <select className={styles.selectSmall} value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)}>
            <option value="">Max</option>
            {budgetPresets[category][transaction].map((b) => <option key={b}>{b}</option>)}
          </select>
        </div>

        <div className={styles.subLabel}>Area (sq.ft.)</div>
        <div className={styles.rowGrid}>
          <select className={styles.selectSmall} value={areaMin} onChange={(e) => setAreaMin(e.target.value)}>
            <option value="">Min</option>
            {AREA[category].map((a) => <option key={a}>{a}</option>)}
          </select>
          <select className={styles.selectSmall} value={areaMax} onChange={(e) => setAreaMax(e.target.value)}>
            <option value="">Max</option>
            {AREA[category].map((a) => <option key={a}>{a}</option>)}
          </select>
        </div>

        <div className={styles.subLabel}>Amenities</div>
        <div className={styles.amenitiesList}>
          {AMENITIES[category].map((a) => (
            <label key={a} className={styles.checkbox}>
              <input type="checkbox" checked={!!amenities[a]} onChange={() => toggleAmenity(a)} />
              {a}
            </label>
          ))}
        </div>

        <div className={styles.actions}>
          <button className={styles.reset} onClick={resetAll}>Reset</button>
          <button className={styles.apply}>Apply</button>
        </div>
      </div>
    </aside>
  );
}
