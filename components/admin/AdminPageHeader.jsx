export default function AdminPageHeader({ title, actions }) {
  return (
    <div className="admin-page-header">
      <h1>{title}</h1>
      <div>{actions}</div>

      <style jsx>{`
        .admin-page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        h1 {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
        }
      `}</style>
    </div>
  );
}
