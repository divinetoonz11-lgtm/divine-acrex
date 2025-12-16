import { useRouter } from "next/router";
import { useEffect } from "react";

export default function GoogleCallback() {
  const router = useRouter();

  useEffect(() => {
    const token = router.query.token;
    const role = router.query.role || "user";

    if (!token) return; // कोई token नहीं → यह पेज कुछ नहीं करेगा

    try {
      localStorage.setItem("da_user_token", token);
      localStorage.setItem("da_user_role", role);
    } catch (e) {}

    router.replace(role === "dealer" ? "/dashboard/dealer" : "/dashboard/user");
  }, [router.query]);

  return (
    <div style={{ padding: 40, textAlign: "center", fontSize: 18 }}>
      Redirecting…
    </div>
  );
}
