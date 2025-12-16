// Demo saved and recent data filler
localStorage.setItem("da_saved", JSON.stringify([
  { image: "/images/featured-1.png", title: "2 BHK Luxury Apartment", location: "Sector 75, Noida", price: "₹ 82 Lac" },
  { image: "/images/featured-2.png", title: "3 BHK Premium Flat", location: "Indirapuram, Ghaziabad", price: "₹ 1.15 Cr" },
  { image: "/images/featured-3.png", title: "1 BHK Affordable Home", location: "Alpha 2, Greater Noida", price: "₹ 32 Lac" }
]));

localStorage.setItem("da_recent", JSON.stringify([
  "2 bhk in Noida",
  "Flat in Ghaziabad",
  "Luxury Apartment sector 75",
  "Affordable home greater noida"
]));

alert("Demo data added!");
