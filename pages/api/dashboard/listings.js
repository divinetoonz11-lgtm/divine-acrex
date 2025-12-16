// pages/api/dashboard/listings.js
let listings = [
  {
    id: 1,
    title: "3 BHK Apartment – Malad West",
    price: "₹ 25,000 / mo",
    city: "Mumbai",
    status: "Live",
    img: "/images/listing-example-1.png",
  },
  {
    id: 2,
    title: "2 BHK – Goregaon East",
    price: "₹ 32,000 / mo",
    city: "Mumbai",
    status: "Live",
    img: "/images/listing-example-2.png",
  },
  {
    id: 3,
    title: "Furnished PG – Kandivali",
    price: "₹ 11,000 / mo",
    city: "Mumbai",
    status: "Draft",
    img: "/images/listing-example-3.png",
  },
  {
    id: 4,
    title: "Office Space – Andheri",
    price: "₹ 55,000 / mo",
    city: "Mumbai",
    status: "Expired",
    img: "/images/listing-example-4.png",
  },
];

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ listings });
  }

  if (req.method === "POST") {
    try {
      const { title, price, city, status, img } = req.body || {};
      if (!title || !price) {
        return res.status(400).json({ error: "title and price are required" });
      }

      const newId = listings.length ? Math.max(...listings.map(l => l.id)) + 1 : 1;
      const newListing = {
        id: newId,
        title,
        price,
        city: city || "",
        status: status || "Draft",
        img: img || "/images/listing-example-1.png",
      };

      listings.unshift(newListing); // add to top
      return res.status(201).json({ success: true, listing: newListing });
    } catch (err) {
      console.error("listings POST error:", err);
      return res.status(500).json({ error: "server error" });
    }
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).end("Method Not Allowed");
}
