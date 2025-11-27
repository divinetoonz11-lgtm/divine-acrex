// components/FilterPanel.jsx
import React, { useState, useEffect } from "react";

/**
 * FilterPanel - Applied + Verified + Budget at top; RERA last.
 */

const BUDGET_OPTIONS = [
  { label: "No min", value: "" },
  { label: "Below 50L", value: 50 },
  { label: "50L - 1Cr", value: 100 },
  { label: "1Cr - 2Cr", value: 200 },
  { label: "2Cr - 5Cr", value: 500 },
  { label: "5Cr+", value: 1000 },
];

const AREA_OPTIONS = [
  { label: "No min", value: "" },
  { label: "300 sq.ft.", value: 300 },
  { label: "500 sq.ft.", value: 500 },
  { label: "800 sq.ft.", value: 800 },
  { label: "1000 sq.ft.", value: 1000 },
  { label: "1500 sq.ft.", value: 1500 },
  { label: "2000 sq.ft.", value: 2000 },
  { label: "3000 sq.ft.", value: 3000 },
  { label: "5000 sq.ft.", value: 5000 },
];

export default function FilterPanel({
  selectedFilters = {},
  onToggle = () => {},
  onFiltersChange = () => {},
}) {
  // dropdowns
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [areaMin, setAreaMin] = useState("");
  const [areaMax, setAreaMax] = useState("");

  // toggles
  const [propertiesWithPhotos, setPropertiesWithPhotos] = useState(false);
  const [propertiesWithVideos, setPropertiesWithVideos] = useState(false);

  // push changes up
  useEffect(() => {
    onFiltersChange({
      budget: { min: budgetMin === "" ? null : Number(budgetMin), max: budgetMax === "" ? null : Number(budgetMax) },
      area: { min: areaMin === "" ? null : Number(areaMin), max: areaMax === "" ? null : Number(areaMax) },
      photos: propertiesWithPhotos,
      videos: propertiesWithVideos,
    });
  }, [budgetMin, budgetMax, areaMin, areaMax, propertiesWithPhotos, propertiesWithVideos]);

  // define all groups but we will control render order
  const ALL_GROUPS = [
    { key: "applied", title: "Applied Filters", items: ["Mahalaxmi"] },
    { key: "verified", title: "Verified properties", items: ["Verified"] },
    { key: "type", title: "Type of property", items: ["Residential Apartment","Independent/Builder Floor","Independent House/Villa","Residential Land","Studio/1RK"] },
    { key: "bhk", title: "No. of Bedrooms", items: ["1 BHK","2 BHK","3 BHK","4 BHK","5+ BHK"] },
    { key: "status", title: "Construction Status", items: ["New Launch","Under Construction","Ready to move"] },
    { key: "posted", title: "Posted by", items: ["Owner","Builder","Dealer","Featured Dealer"] },
    { key: "furnish", title: "Furnishing Status", items: ["Furnished","Semi-Furnished","Unfurnished"] },
    { key: "amenities", title: "Amenities", items: ["Swimming Pool","Gymnasium","Lift","Club House","Park","CCTV","Power Backup"] },
    { key: "parking", title: "Parking", items: ["Car","Two-wheeler","No parking"] },
    { key: "brokerage", title: "Brokerage", items: ["Zero Brokerage","With Brokerage"] },
    { key: "loan", title: "Loan Available", items: ["Yes","No"] },
    { key: "availability", title: "Availability", items: ["Ready to move","Under Construction"] },
    { key: "pets", title: "Pets Allowed", items: ["Yes","No"] },
    // RERA kept separate to render last
    { key: "rera", title: "RERA Approved", items: ["Yes"] },
  ];

  // groups except applied/verified/rera (we'll render these in middle)
  const middleGroups = ALL_GROUPS.filter(g => !["applied","verified","rera"].includes(g.key));
  const appliedGroup = ALL_GROUPS.find(g => g.key === "applied");
  const verifiedGroup = ALL_GROUPS.find(g => g.key === "verified");
  const reraGroup = ALL_GROUPS.find(g => g.key === "rera");

  // helper to render a group
  const renderGroup = (group) => (
    <div key={group.key} className="filter-group">
      <div className="filter-title">{group.title}</div>
      <div className="filter-items">
        {group.items.map(option => {
          const checked = selectedFilters[group.key] && selectedFilters[group.key].includes(option);
          return (
            <label key={option} className="filter-chip">
              <input type="checkbox" checked={!!checked} onChange={() => onToggle(group.key, option)} />
              <span className="chip-label">{option}</span>
            </label>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className="filter-panel">
      {/* 1) Applied */}
      {appliedGroup && renderGroup(appliedGroup)}

      {/* 2) Verified */}
      {verifiedGroup && renderGroup(verifiedGroup)}

      {/* 3) Budget (dropdowns) */}
      <div className="filter-group top-dropdowns">
        <div className="filter-title">Budget</div>
        <div className="budget-row">
          <select value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)}>
            {BUDGET_OPTIONS.map(o => <option key={"min-"+o.label} value={o.value}>{o.label}</option>)}
          </select>
          <select value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)}>
            {BUDGET_OPTIONS.map(o => <option key={"max-"+o.label} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div style={{ height: 12 }} />

        <div className="filter-title">Area (sq.ft.)</div>
        <div className="budget-row">
          <select value={areaMin} onChange={(e) => setAreaMin(e.target.value)}>
            {AREA_OPTIONS.map(o => <option key={"amin-"+o.label} value={o.value}>{o.label}</option>)}
          </select>
          <select value={areaMax} onChange={(e) => setAreaMax(e.target.value)}>
            {AREA_OPTIONS.map(o => <option key={"amax-"+o.label} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* middle groups */}
      {middleGroups.map(g => renderGroup(g))}

      {/* toggles */}
      <div className="filter-group">
        <div className="filter-title">Properties with photos</div>
        <label className="toggle">
          <input type="checkbox" checked={propertiesWithPhotos} onChange={(e)=>setPropertiesWithPhotos(e.target.checked)} />
          <span className="toggle-label">{propertiesWithPhotos ? "On":"Off"}</span>
        </label>
      </div>

      <div className="filter-group">
        <div className="filter-title">Properties with videos</div>
        <label className="toggle">
          <input type="checkbox" checked={propertiesWithVideos} onChange={(e)=>setPropertiesWithVideos(e.target.checked)} />
          <span className="toggle-label">{propertiesWithVideos ? "On":"Off"}</span>
        </label>
      </div>

      {/* RERA last */}
      {reraGroup && renderGroup(reraGroup)}

      <style jsx>{`
        .filter-panel { padding:18px; background:#fff; border-radius:6px; box-shadow:0 0 0 1px #eee; }
        .filter-group { margin-bottom:16px; }
        .filter-title { font-weight:600; margin-bottom:8px; font-size:14px; color:#222; }
        .filter-items { display:flex; flex-direction:column; gap:8px; }
        .filter-chip { display:flex; align-items:center; gap:10px; font-size:14px; color:#333; }
        .filter-chip input { width:16px; height:16px; }
        .budget-row { display:flex; gap:10px; }
        select { padding:8px 12px; border-radius:20px; border:1px solid #ddd; min-width:140px; background:#fff; }
        .toggle { display:flex; align-items:center; gap:10px; }
        .toggle input { width:18px; height:18px; }
        .toggle-label { font-size:13px; color:#666; }
        .rera-bottom { margin-top: 8px; border-top: 1px solid #f0f0f0; padding-top: 12px; }
      `}</style>
    </aside>
  );
}
