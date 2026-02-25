import { getServerSession } from "next-auth/next";

/**
 * CENTRAL REDIRECT
 * Sabhi roles ko unke dashboard par hi bhejta hai
 */

export async function getServerSideProps({ req, res }) {
  const { authOptions } = await import("./api/auth/[...nextauth]");
  const session = await getServerSession(req, res, authOptions);

  // ❌ Login nahi → HOME
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const role = session.user?.role;

  // 🔐 ADMIN → ADMIN DASHBOARD
  if (role === "admin") {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  // 🧑‍💼 DEALER → DEALER DASHBOARD
  if (role === "dealer") {
    return {
      redirect: {
        destination: "/dealer",
        permanent: false,
      },
    };
  }

  // 👤 USER → USER DASHBOARD
  return {
    redirect: {
      destination: "/user",
      permanent: false,
    },
  };
}

export default function Redirect() {
  return null;
}
