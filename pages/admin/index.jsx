import { useEffect } from "react";
import { useRouter } from "next/router";

export default function RedirectToAdminLogin() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login/admin");
  }, []);

  return null;
}
