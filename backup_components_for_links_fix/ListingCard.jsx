export default function ListingCard({ title, price, image }) {
  return (
    <div style={{
      border: "1px solid #eee",
      borderRadius: "10px",
      overflow: "hidden",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    }}>
      <img src={image} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
      <div style={{ padding: "15px" }}>
        <h3 style={{ margin: "0 0 10px" }}>{title}</h3>
        <p style={{ fontSize: "18px", color: "#007bff", margin: 0 }}>{price}</p>
      </div>
    </div>
  );
}
