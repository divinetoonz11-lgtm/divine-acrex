// components/AdminGuard.jsx
import { useEffect, useState } from "react";

export default function AdminGuard({ children }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // TEMP ADMIN ACCESS (BUILD MODE)
    setReady(true);
  }, []);

  if (!ready) {
    return <div style={{ padding: 20 }}>Loading admin…</div>;
  }

  return <>{children}</>;
}
