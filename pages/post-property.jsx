// pages/post-property.jsx
import React, { useState, useEffect } from "react";
import Router from "next/router";

const MAX_PHOTOS = 8;
const MAX_VIDEO_MB = 5;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm"];

const RESIDENTIAL_TYPES = ["Flat / Apartment", "House / Villa", "Studio Apartment", "Row House", "Plot / Land", "Penthouse"];
const COMMERCIAL_TYPES = ["Office", "Shop / Showroom", "Godown / Warehouse", "Factory", "Industrial Unit", "Retail Space"];
const HOTEL_TYPES = ["Hotel", "Resort", "Guest House", "Hostel", "Service Apartment"];

const HOTEL_ROOM_OPTIONS = ["1-10", "10-20", "20-40", "40-80", "80-150", "150+"];
const HOTEL_STAR_OPTIONS = ["Any", "2", "3", "4", "5"];
const PEOPLE_CAPACITY_OPTIONS = ["Any", "50-100", "100-200", "200-300", "300-500", "500+"];

export default function PostProperty() {
  // common
  const [postedBy, setPostedBy] = useState("");
  const [category, setCategory] = useState(""); // residential / commercial / hotel
  const [propertyType, setPropertyType] = useState("");
  const [furnishing, setFurnishing] = useState("");
  const [price, setPrice] = useState("");
  const [bhk, setBhk] = useState("");
  const [area, setArea] = useState("");
  const [stateName, setStateName] = useState("");
  const [city, setCity] = useState("");
  const [locality, setLocality] = useState("");
  const [society, setSociety] = useState("");
  const [floor, setFloor] = useState("");
  const [vastu, setVastu] = useState("");
  const [description, setDescription] = useState("");
  const [mobile, setMobile] = useState("");

  // commercial
  const [commBuiltUp, setCommBuiltUp] = useState("");
  const [commCarpet, setCommCarpet] = useState("");
  const [commFrontage, setCommFrontage] = useState("");
  const [commFloorLevel, setCommFloorLevel] = useState("");
  const [commParkingCapacity, setCommParkingCapacity] = useState("");

  // hotel
  const [hotelType, setHotelType] = useState("");
  const [hotelRooms, setHotelRooms] = useState("Any");
  const [hotelStarMin, setHotelStarMin] = useState("Any");
  const [hotelStarMax, setHotelStarMax] = useState("5");
  const [hasBanquet, setHasBanquet] = useState(false);
  const [banquetArea, setBanquetArea] = useState("");
  const [hasLawn, setHasLawn] = useState(false);
  const [lawnArea, setLawnArea] = useState("");
  const [peopleCapacity, setPeopleCapacity] = useState("Any");
  const [restaurantOnSite, setRestaurantOnSite] = useState(false);
  const [barOnSite, setBarOnSite] = useState(false);
  const [hasSwimmingPool, setHasSwimmingPool] = useState(false);
  const [hasAdventurePark, setHasAdventurePark] = useState(false);
  const [hasWaterPark, setHasWaterPark] = useState(false);
  const [hotelParkingCapacity, setHotelParkingCapacity] = useState("");

  // amenities
  const AMENITIES = [
    "Parking","Lift","Swimming Pool","Power Backup","Security","CCTV","Gym","Garden",
    "Play Area","Club House","Internet","Furnished","Balcony","Water Supply",
    "Maintenance Staff","Visitor Parking","Gas Pipeline","Intercom","Fire Safety",
  ];
  const [amenities, setAmenities] = useState([]);

  // media
  const [photos, setPhotos] = useState([]);
  const [photoPreview, setPhotoPreview] = useState([]);
  const [video, setVideo] = useState(null);
  const [videoName, setVideoName] = useState("");

  // UI
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    // reset propertyType when category changes
    setPropertyType("");
    setHotelType("");
    setMsg("");
    // clear previews when switching category optionally
    // setPhotoPreview([]);
    // setPhotos([]);
  }, [category]);

  function toggleAmenity(a) {
    setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  }

  // photo handler (max 8)
  function handlePhotos(e) {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > MAX_PHOTOS) {
      setMsg(`Maximum ${MAX_PHOTOS} photos allowed.`);
      return;
    }
    const valid = files.filter(f => ACCEPTED_IMAGE_TYPES.includes(f.type));
    if (valid.length !== files.length) setMsg("कुछ फ़ाइल्स स्वीकार्य नहीं (jpg/png/webp)।");
    else setMsg("");

    const add = valid.slice(0, MAX_PHOTOS - photos.length);
    setPhotos(prev => [...prev, ...add]);

    add.forEach(f => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhotoPreview(prev => [...prev, { id: Date.now() + Math.random(), src: ev.target.result }]);
      };
      reader.readAsDataURL(f);
    });
  }

  function removePhoto(i) {
    setPhotos(prev => prev.filter((_, idx) => idx !== i));
    setPhotoPreview(prev => prev.filter((_, idx) => idx !== i));
  }

  // video handler (only 1 allowed)
  function handleVideo(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!ACCEPTED_VIDEO_TYPES.includes(f.type)) { setMsg("Video type mp4/webm ही स्वीकार्य है."); return; }
    if (f.size / 1024 / 1024 > MAX_VIDEO_MB) { setMsg(`Video ${MAX_VIDEO_MB}MB से बड़ा नहीं होना चाहिए.`); return; }
    setVideo(f);
    setVideoName(f.name);
    setMsg("");
  }

  function removeVideo() {
    setVideo(null);
    setVideoName("");
  }

  // basic validation
  function validate() {
    if (!postedBy) { setMsg("Posted by चुने (Owner/Dealer/Builder/Broker)।"); return false; }
    if (!category) { setMsg("Category चुने।"); return false; }
    if (!propertyType && category !== "") { setMsg("Property Type चुने।"); return false; }
    if (!price) { setMsg("Price भरें।"); return false; }
    if (!city) { setMsg("City भरें।"); return false; }
    if (!mobile) { setMsg("Contact mobile डालें।"); return false; }
    // hotel-specific checks
    if (category === "hotel" && !hotelType) { setMsg("Hotel type चुनें।"); return false; }
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setMsg("");

    try {
      // NOTE: file uploads not implemented here (use multipart/S3). This sends metadata only.
      const payload = {
        postedBy, category, propertyType, furnishing, price: Number(price || 0),
        bhk, area: Number(area || 0), state: stateName, city, locality, society,
        floor, vastu, description, mobile, amenities,
        commercial: category === "commercial" ? { commBuiltUp, commCarpet, commFrontage, commFloorLevel, commParkingCapacity } : null,
        hotel: category === "hotel" ? { hotelType, hotelRooms, hotelStarMin, hotelStarMax, hasBanquet, banquetArea, hasLawn, lawnArea, peopleCapacity, restaurantOnSite, barOnSite, hasSwimmingPool, hasAdventurePark, hasWaterPark, hotelParkingCapacity } : null,
        photosCount: photos.length,
        videoName: videoName || null,
      };

      // demo POST — replace endpoint as needed
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Save failed");

      setMsg("Property posted successfully!");
      // reset if needed
      setTimeout(() => Router.push("/"), 900);
    } catch (err) {
      console.error(err);
      setMsg("Error saving property. Console देखें.");
    } finally {
      setSaving(false);
    }
  }

  // determine type options
  const typeOptions = category === "residential" ? RESIDENTIAL_TYPES
    : category === "commercial" ? COMMERCIAL_TYPES
    : category === "hotel" ? HOTEL_TYPES : [];

  return (
    <div style={{ minHeight: "100vh", background: "#e6f0ff", padding: 18, fontFamily: "Inter, Arial, sans-serif" }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", background: "#fff",
        padding: 20, borderRadius: 12, boxShadow: "0 6px 30px rgba(2,12,45,0.08)"
      }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h2 style={{ margin: 0, color: "#002b80" }}>Post Your Property</h2>
          <div style={{ fontSize: 13, color: "#666" }}>Free listing • Quick publish</div>
        </header>

        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 18 }}>
          {/* LEFT */}
          <div>
            <div style={{ background: "#f9fbff", padding: 12, borderRadius: 10, border: "1px solid #e3ebff", marginBottom: 12 }}>
              <h3 style={{ margin: "0 0 8px 0", color: "#002b80" }}>Basic Details</h3>

              <label style={lbl}>Posted By *</label>
              <select value={postedBy} onChange={e => setPostedBy(e.target.value)} style={inpt}>
                <option value="">Select</option>
                <option>Owner</option><option>Dealer</option><option>Builder</option><option>Broker</option>
              </select>

              <label style={lbl}>Property Category *</label>
              <select value={category} onChange={e => { setCategory(e.target.value); setPropertyType(""); }} style={inpt}>
                <option value="">Select</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="hotel">Hotel / Resort</option>
              </select>

              {category && (
                <>
                  <label style={lbl}>Property Type *</label>
                  <select value={propertyType} onChange={e => setPropertyType(e.target.value)} style={inpt}>
                    <option value="">Select</option>
                    {typeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </>
              )}

              <label style={lbl}>Furnishing</label>
              <select value={furnishing} onChange={e => setFurnishing(e.target.value)} style={inpt}>
                <option value="">Select</option>
                <option>Fully Furnished</option>
                <option>Semi Furnished</option>
                <option>Unfurnished</option>
              </select>

              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={lbl}>Budget / Price (₹) *</label>
                  <input value={price} onChange={e => setPrice(e.target.value)} style={inpt} />
                </div>
                <div style={{ width: 110 }}>
                  <label style={lbl}>BHK</label>
                  <input value={bhk} onChange={e => setBhk(e.target.value)} style={inptSmall} />
                </div>
                <div style={{ width: 140 }}>
                  <label style={lbl}>Area (sqft)</label>
                  <input value={area} onChange={e => setArea(e.target.value)} style={inptSmall} />
                </div>
              </div>
            </div>

            {/* Category specific cards */}
            {category === "residential" && (
              <div style={sectionCardStyle}>
                <h3 style={cardTitle}>Residential Details</h3>
                <label style={lbl}>Floor</label>
                <input value={floor} onChange={e => setFloor(e.target.value)} style={inpt} placeholder="e.g. Ground / 1st / 10th" />

                <label style={lbl}>Vastu Direction</label>
                <select value={vastu} onChange={e => setVastu(e.target.value)} style={inpt}>
                  <option value="">Select</option>
                  {["East","West","North","South","North-East","North-West","South-East","South-West"].map(v => <option key={v}>{v}</option>)}
                </select>

                <label style={lbl}>Society (optional)</label>
                <input value={society} onChange={e => setSociety(e.target.value)} style={inpt} />
              </div>
            )}

            {category === "commercial" && (
              <div style={sectionCardStyle}>
                <h3 style={cardTitle}>Commercial Details</h3>

                <label style={lbl}>Built-up Area (sqft)</label>
                <input value={commBuiltUp} onChange={e => setCommBuiltUp(e.target.value)} style={inpt} placeholder="e.g. 1500" />

                <label style={lbl}>Carpet Area (sqft)</label>
                <input value={commCarpet} onChange={e => setCommCarpet(e.target.value)} style={inpt} placeholder="e.g. 1200" />

                <label style={lbl}>Frontage (ft)</label>
                <input value={commFrontage} onChange={e => setCommFrontage(e.target.value)} style={inpt} placeholder="e.g. 20" />

                <label style={lbl}>Floor Level</label>
                <select value={commFloorLevel} onChange={e => setCommFloorLevel(e.target.value)} style={inpt}>
                  <option>Any</option><option>Ground</option><option>Lower</option><option>Middle</option><option>High</option>
                </select>

                <label style={lbl}>Parking Capacity</label>
                <input value={commParkingCapacity} onChange={e => setCommParkingCapacity(e.target.value)} style={inpt} placeholder="e.g. 5 cars" />
              </div>
            )}

            {category === "hotel" && (
              <div style={sectionCardStyle}>
                <h3 style={cardTitle}>Hotel / Resort Details</h3>

                <label style={lbl}>Hotel Type</label>
                <select value={hotelType} onChange={e => setHotelType(e.target.value)} style={inpt}>
                  <option value="">Select</option>
                  {HOTEL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>

                <label style={lbl}>Rooms</label>
                <select value={hotelRooms} onChange={e => setHotelRooms(e.target.value)} style={inpt}>
                  {HOTEL_ROOM_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>

                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <label style={lbl}>Star Rating Min</label>
                    <select value={hotelStarMin} onChange={e => setHotelStarMin(e.target.value)} style={inpt}>
                      {HOTEL_STAR_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div style={{ width: 120 }}>
                    <label style={lbl}>Star Max</label>
                    <select value={hotelStarMax} onChange={e => setHotelStarMax(e.target.value)} style={inptSmall}>
                      {HOTEL_STAR_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <label style={lbl}>Banquet Hall</label>
                <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input type="checkbox" checked={hasBanquet} onChange={e => setHasBanquet(e.target.checked)} /> Has Banquet
                </label>
                {hasBanquet && (
                  <>
                    <label style={lbl}>Banquet Area (sqft)</label>
                    <input value={banquetArea} onChange={e => setBanquetArea(e.target.value)} style={inpt} />
                  </>
                )}

                <label style={lbl}>Lawn</label>
                <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input type="checkbox" checked={hasLawn} onChange={e => setHasLawn(e.target.checked)} /> Has Lawn
                </label>
                {hasLawn && (
                  <>
                    <label style={lbl}>Lawn Area (sqft)</label>
                    <input value={lawnArea} onChange={e => setLawnArea(e.target.value)} style={inpt} />
                  </>
                )}

                <label style={lbl}>People Capacity</label>
                <select value={peopleCapacity} onChange={e => setPeopleCapacity(e.target.value)} style={inpt}>
                  {PEOPLE_CAPACITY_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>

                <label style={lbl}>Restaurant / Bar / Pool / Parks</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <label style={chip}><input type="checkbox" checked={restaurantOnSite} onChange={e => setRestaurantOnSite(e.target.checked)} /> Restaurant</label>
                  <label style={chip}><input type="checkbox" checked={barOnSite} onChange={e => setBarOnSite(e.target.checked)} /> Bar</label>
                  <label style={chip}><input type="checkbox" checked={hasSwimmingPool} onChange={e => setHasSwimmingPool(e.target.checked)} /> Swimming Pool</label>
                  <label style={chip}><input type="checkbox" checked={hasAdventurePark} onChange={e => setHasAdventurePark(e.target.checked)} /> Adventure Park</label>
                  <label style={chip}><input type="checkbox" checked={hasWaterPark} onChange={e => setHasWaterPark(e.target.checked)} /> Water Park</label>
                </div>

                <label style={lbl}>Parking Capacity</label>
                <input value={hotelParkingCapacity} onChange={e => setHotelParkingCapacity(e.target.value)} style={inpt} placeholder="e.g. 50 cars" />
              </div>
            )}

            {/* Amenities */}
            <div style={sectionCardStyle}>
              <h3 style={cardTitle}>Amenities</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                {AMENITIES.map(a => (
                  <label key={a} style={amenityLabelStyle(amenities.includes(a))}>
                    <input type="checkbox" checked={amenities.includes(a)} onChange={() => toggleAmenity(a)} />
                    {a}
                  </label>
                ))}
              </div>
            </div>

            {/* Description & Contact */}
            <div style={sectionCardStyle}>
              <h3 style={cardTitle}>Description & Contact</h3>
              <label style={lbl}>Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} style={inpt} />

              <label style={lbl}>Contact Mobile *</label>
              <input value={mobile} onChange={e => setMobile(e.target.value)} style={inpt} placeholder="e.g. 9867402515" />
            </div>

            <div style={{ marginTop: 8 }}>
              <button type="submit" disabled={saving} style={submitBtn}>
                {saving ? "Saving..." : "Post Property"}
              </button>
              {msg && <div style={{ marginTop: 10, color: "#0039c9", fontWeight: 700 }}>{msg}</div>}
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <div style={sectionCardStyle}>
              <h3 style={cardTitle}>Location</h3>
              <label style={lbl}>State</label>
              <input value={stateName} onChange={e => setStateName(e.target.value)} style={inpt} placeholder="Maharashtra, Delhi…" />

              <label style={lbl}>City</label>
              <input value={city} onChange={e => setCity(e.target.value)} style={inpt} placeholder="Mumbai, Pune…" />

              <label style={lbl}>Locality / Landmark</label>
              <input value={locality} onChange={e => setLocality(e.target.value)} style={inpt} placeholder="Andheri East, Malad…" />
            </div>

            <div style={sectionCardStyle}>
              <h3 style={cardTitle}>Photos (Max {MAX_PHOTOS})</h3>
              <input type="file" accept="image/*" multiple onChange={handlePhotos} />
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                {photoPreview.map((p, i) => (
                  <div key={p.id} style={{ width: 92, height: 68, position: "relative", borderRadius: 6, overflow: "hidden", border: "1px solid #e9f0ff" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.src} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button type="button" onClick={() => removePhoto(i)} style={removeBtn}>x</button>
                  </div>
                ))}
              </div>
            </div>

            <div style={sectionCardStyle}>
              <h3 style={cardTitle}>Video (Max {MAX_VIDEO_MB} MB)</h3>
              <input type="file" accept="video/*" onChange={handleVideo} />
              {videoName && (
                <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: 13 }}>{videoName}</div>
                  <button type="button" onClick={removeVideo} style={smallRemoveBtn}>Remove</button>
                </div>
              )}
              <div style={{ marginTop: 8, fontSize: 12, color: "#666" }}>Tip: Prefer mp4, size &lt; {MAX_VIDEO_MB}MB</div>
            </div>

            <div style={sectionCardStyle}>
              <h3 style={cardTitle}>Preview</h3>
              <div style={{ fontSize: 13, color: "#333" }}>
                <div><strong>{propertyType || "—"}</strong></div>
                <div>{city ? `${city} • ${locality || ""}` : "Location not set"}</div>
                <div style={{ marginTop: 8 }}>{price ? `₹ ${price}` : "Price not set"}</div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Styles (single block) */}
      <style jsx>{`
        /* page bg */
        :global(body) { margin:0; }
        .inpt { width:100%; padding:10px 12px; border-radius:8px; border:1px solid #d6eaff; margin-top:6px; box-sizing:border-box; background:#fbfdff; }
        .inpt:focus { outline: none; box-shadow: 0 0 0 3px rgba(0,57,201,0.08); border-color:#0039c9; }

        /* layout helpers (used inline too) */
        @media (max-width: 900px) {
          form { grid-template-columns: 1fr !important; }
        }

        /* remove default select tick / arrow (keep visual caret) */
        select {
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          appearance: none !important;
          background-image: none !important;
        }
        select {
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 36px;
        }
        select {
          background-image:
            linear-gradient(45deg, transparent 50%, #0a2a66 50%),
            linear-gradient(135deg, #0a2a66 50%, transparent 50%);
          background-size: 8px 8px;
          background-position: calc(100% - 16px) center, calc(100% - 10px) center;
          background-repeat: no-repeat;
        }

        /* small responsive tweaks */
        @media (max-width: 520px) {
          .inpt { padding: 9px; }
        }

        /* keep file input visible and consistent */
        input[type="file"] { font-size: 13px; }

      `}</style>
    </div>
  );
}

/* ---------- Inline JS styles (for reuse in JSX) ---------- */
const lbl = { display: "block", marginTop: 12, fontSize: 13, fontWeight: 600, color: "#01315c" };
const inpt = { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #d6eaff", marginTop: 6, boxSizing: "border-box", background: "#fbfdff" };
const inptSmall = { width: "100%", padding: "9px 10px", borderRadius: 8, border: "1px solid #d6eaff", marginTop: 6, boxSizing: "border-box", background: "#fbfdff" };
const sectionCardStyle = { background: "#fff", padding: 12, borderRadius: 10, border: "1px solid #eef4ff", marginBottom: 12 };
const cardTitle = { margin: "0 0 8px 0", color: "#002b80" };
const chip = { display: "inline-flex", gap: 8, alignItems: "center", padding: "6px 8px", borderRadius: 8, border: "1px solid #e6edff", cursor: "pointer" };
const submitBtn = { marginTop: 8, padding: "12px", width: "100%", background: "#0039c9", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" };
const removeBtn = { position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: 4, padding: "2px 6px", cursor: "pointer" };
const smallRemoveBtn = { background: "red", color: "#fff", border: "none", padding: "6px 8px", borderRadius: 6, cursor: "pointer" };
function amenityLabelStyle(active) {
  return {
    display: "flex",
    gap: 8,
    alignItems: "center",
    background: active ? "#e9f2ff" : "#fbfdff",
    border: "1px solid #e6edff",
    padding: "6px",
    borderRadius: 6,
    fontSize: 13,
    cursor: "pointer"
  };
}
