import { useState } from "react";

export default function AdminTabs({ tabs, defaultTab }) {
  const [active, setActive] = useState(defaultTab || tabs[0].key);

  return (
    <div>
      {/* TABS BAR */}
      <div className="admin-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={
              active === tab.key ? "admin-tab active" : "admin-tab"
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="admin-tab-content">
        {tabs.find((t) => t.key === active)?.content}
      </div>

      <style jsx>{`
        .admin-tabs {
          display: flex;
          gap: 10px;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 20px;
          overflow-x: auto;
        }

        .admin-tab {
          padding: 10px 16px;
          font-size: 14px;
          border-radius: 8px 8px 0 0;
          background: #e5e7eb;
          border: none;
          cursor: pointer;
          font-weight: 600;
          white-space: nowrap;
        }

        .admin-tab.active {
          background: #2563eb;
          color: #fff;
        }

        .admin-tab-content {
          background: #ffffff;
          padding: 20px;
          border-radius: 0 12px 12px 12px;
        }
      `}</style>
    </div>
  );
}
