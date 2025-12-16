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
const FACING = ["East", "West", "North", "South"];
const PARKING = ["Yes", "No"];

/* Hotel specific */
const HOTEL_CAPACITY = ["50", "100", "300", "500", "1000", "3000+"];
const HOTEL_LAWN_AREA = ["1000", "3000", "5000", "10000", "20000+"];

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

  const [facing, setFacing] = useState("");
  const [parking, setParking] = useState("");

  /* Hotel only */
  const [capacity, setCapacity] = useState("");
  const [lawnArea, setLawnArea] = useState("");

  const [amenities, setAmenities] = useState({});

  /* Reset on transaction/category change */
  useEffect(() => {
    setBudgetMin("");
    setBudgetMax("");
  }, [transaction, category]);

  useEffect(() => {
    setPropertyType("");
    setAreaMin("");
    setAreaMax("");
    setBedrooms("");
    setCapacity("");
    setLawnArea("");
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
    setFacing("");
    setParking("");
    setCapacity("");
    setLawnArea("");
    setAmenities({});
  }

  return (
    <aside className={styles.filterBox}>
      <div className={styles.filterBoxInner}>
        <div className={styles.sectionTitle}>Filters</div>

        {/* Transaction */}
        <div className={styles.subLabel}>Transaction</div>
        <select className={styles.select} value={transaction} onChange={e=>setTransaction(e.target.value)}>
          {TRANSACTIONS.map(t => <option key={t}>{t}</option>)}
        </select>

        {/* Category */}
        <div className={styles.subLabel}>Property Category</div>
        <select className={styles.select} value={category} onChange={e=>setCategory(e.target.value)}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>

        {/* Property Type */}
        <div className={styles.subLabel}>Property Type</div>
        <select className={styles.select} value={propertyType} onChange={e=>setPropertyType(e.target.value)}>
          <option value="">Any</option>
          {PROPERTY_TYPES[category].map(p => <option key={p}>{p}</option>)}
        </select>

        {/* Bedrooms */}
        {category === "Residential" && (
          <>
            <div className={styles.subLabel}>Bedrooms</div>
            <select className={styles.select} value={bedrooms} onChange={e=>setBedrooms(e.target.value)}>
              <option value="">Any</option>
              {BEDROOMS.map(b => <option key={b}>{b}</option>)}
            </select>
          </>
        )}

        {/* Budget */}
        <div className={styles.subLabel}>Budget</div>
        <div className={styles.rowGrid}>
          <select className={styles.selectSmall} value={budgetMin} onChange={e=>setBudgetMin(e.target.value)}>
            <option value="">Min</option>
            {budgetPresets[category][transaction].map(b => <option key={b}>{b}</option>)}
          </select>
          <select className={styles.selectSmall} value={budgetMax} onChange={e=>setBudgetMax(e.target.value)}>
            <option value="">Max</option>
            {budgetPresets[category][transaction].map(b => <option key={b}>{b}</option>)}
          </select>
        </div>

        {/* Area */}
        <div className={styles.subLabel}>Area (sq.ft.)</div>
        <div className={styles.rowGrid}>
          <select className={styles.selectSmall} value={areaMin} onChange={e=>setAreaMin(e.target.value)}>
            <option value="">Min</option>
            {AREA[category].map(a => <option key={a}>{a}</option>)}
          </select>
          <select className={styles.selectSmall} value={areaMax} onChange={e=>setAreaMax(e.target.value)}>
            <option value="">Max</option>
            {AREA[category].map(a => <option key={a}>{a}</option>)}
          </select>
        </div>

        {/* Hotel extra filters */}
        {category === "Hotel" && (
          <>
            <div className={styles.subLabel}>Capacity (People)</div>
            <select className={styles.select} value={capacity} onChange={e=>setCapacity(e.target.value)}>
              <option value="">Any</option>
              {HOTEL_CAPACITY.map(c => <option key={c}>{c}</option>)}
            </select>

            <div className={styles.subLabel}>Lawn Area (sq.ft.)</div>
            <select className={styles.select} value={lawnArea} onChange={e=>setLawnArea(e.target.value)}>
              <option value="">Any</option>
              {HOTEL_LAWN_AREA.map(l => <option key={l}>{l}</option>)}
            </select>
          </>
        )}

        {/* Facing */}
        <div className={styles.subLabel}>Facing</div>
        <select className={styles.select} value={facing} onChange={e=>setFacing(e.target.value)}>
          <option value="">Any</option>
          {FACING.map(f => <option key={f}>{f}</option>)}
        </select>

        {/* Parking */}
        <div className={styles.subLabel}>Parking</div>
        <select className={styles.select} value={parking} onChange={e=>setParking(e.target.value)}>
          <option value="">Any</option>
          {PARKING.map(p => <option key={p}>{p}</option>)}
        </select>

        {/* Amenities */}
        <div className={styles.subLabel}>Amenities</div>
        <div className={styles.amenitiesList}>
          {AMENITIES[category].map(a => (
            <label key={a} className={styles.checkbox}>
              <input type="checkbox" checked={!!amenities[a]} onChange={()=>toggleAmenity(a)} />
              {a}
            </label>
          ))}
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button className={styles.reset} onClick={resetAll}>Reset</button>
          <button className={styles.apply}>Apply</button>
        </div>
      </div>
    </aside>
  );
}
