import { getSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);

  if (!session?.user) {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }

  return {
    props: {
      role: ctx.query.role || "user",
    },
  };
}

export default function Redirect({ role }) {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      if (role === "dealer") {
        // 🔥 THIS MAKES DEALER JUST LIKE USER
        await fetch("/api/set-dealer", { method: "POST" });
        router.replace("/dealer/dashboard");
      } else {
        router.replace("/user/dashboard");
      }
    };

    run();
  }, [role, router]);

  return null;
}
