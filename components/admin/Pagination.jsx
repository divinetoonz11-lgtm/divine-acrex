// components/admin/Pagination.jsx
export default function Pagination({ page, total, limit, onChange }) {
  const pages = Math.ceil(total / limit);
  if (pages <= 1) return null;

  return (
    <div className="pg-wrap">
      {Array.from({ length: pages }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i + 1)}
          className={page === i + 1 ? "pg-btn active" : "pg-btn"}
        >
          {i + 1}
        </button>
      ))}

      <style jsx>{`
        .pg-wrap {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding: 6px 0;
        }
        .pg-btn {
          min-width: 36px;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          background: #f8fafc;
          color: #0f172a;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
        }
        .pg-btn.active {
          background: #2563eb;
          color: #fff;
          border-color: #2563eb;
        }
      `}</style>
    </div>
  );
}
