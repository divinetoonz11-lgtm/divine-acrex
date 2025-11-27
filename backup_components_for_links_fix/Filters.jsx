import { useState } from "react";
import styles from "./Filters.module.css";

export default function Filters() {
  const [activeTab, setActiveTab] = useState("buy");

  return (
    <div className={styles.filterContainer}>

      {/* Top Tabs */}
      <div className={styles.tabRow}>
        <button
          className={activeTab === "buy" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("buy")}
        >
          Buy
        </button>

        <button
          className={activeTab === "rent" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("rent")}
        >
          Rent
        </button>

        <button
          className={activeTab === "commercial" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("commercial")}
        >
          Commercial
        </button>
      </div>

      {/* Filters Section */}
      <div className={styles.filtersGrid}>

        <select><option>City</option></select>
        <select><option>Locality</option></select>
        <select><option>Property Type</option></select>

        {/* Budget */}
        <select><option>Budget Min</option></select>
        <select><option>Budget Max</option></select>

        {/* Area */}
        <select><option>Area Min (sqft)</option></select>
        <select><option>Area Max (sqft)</option></select>

        {/* BHK */}
        <select>
          <option>BHK</option>
          <option>1 BHK</option>
          <option>2 BHK</option>
          <option>3 BHK</option>
          <option>4 BHK</option>
          <option>5 BHK</option>
        </select>

        <select><option>Furnishing</option></select>
        <select><option>Status (New/Resale)</option></select>
        <select><option>Ownership</option></select>
        <select><option>Floor</option></select>
        <select><option>Facing</option></select>
        <select><option>Amenities</option></select>
        <select><option>Bathrooms</option></select>
        <select><option>Balcony</option></select>
        <select><option>Parking</option></select>
        <select><option>Water Supply</option></select>
        <select><option>Power Backup</option></select>
        <select><option>Gated Security</option></select>

      </div>

      <div className={styles.searchBtnWrap}>
        <button className={styles.searchButton}>Search</button>
      </div>
    </div>
  );
}
