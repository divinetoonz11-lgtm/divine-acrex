import React from "react";

const DEALERS = [
  { id: 1, name: "Dealer One", company: "ABC Realty", img: "" },
  { id: 2, name: "Dealer Two", company: "XYZ Estates", img: "" },
  { id: 3, name: "Dealer Three", company: "City Homes", img: "" }
];

function Avatar({ src, name }) {
  const short = name.slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: 80,
      height: 80,
      borderRadius: "50%",
      background: "#f3f4f6",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 22,
      fontWeight: 700,
      color: "#333",
      overflow: "hidden"
    }}>
      {src ? (
        <img
          src={src}
          alt={name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        short
      )}
    </div>
  );
}

export default function DealersBlock() {
  return (
    <section className="max-w-[1100px] mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-3">Featured Dealers</h2>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {DEALERS.map(d => (
          <div
            key={d.id}
            className="bg-white shadow-sm rounded-xl p-4 flex flex-col items-center"
          >
            <Avatar src={d.img} name={d.name} />

            <div className="mt-3 text-center">
              <div className="font-semibold">{d.name}</div>
              <div className="text-sm text-gray-500">{d.company}</div>
            </div>

            <button className="mt-4 px-4 py-1 bg-blue-600 text-white rounded-md text-sm">
              Contact Dealer
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
