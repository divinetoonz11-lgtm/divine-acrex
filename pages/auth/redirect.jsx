import { getServerSession } from "next-auth/next";

/**
 * NOTE:
 * - authOptions ko top-level par import NAHI kiya gaya
 * - Build time par MongoDB access avoid karne ke liye
 * - authOptions ko runtime par dynamically import kiya gaya hai
 */

export async function getServerSideProps({ req, res }) {
  // 🔑 authOptions ko runtime par load karo
  const { authOptions } = await import("../api/auth/[...nextauth]");

  const session = await getServerSession(req, res, authOptions);

  // ❌ Login nahi hai
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const role = session.user?.role;

  // 🔐 ADMIN
  if (role === "admin") {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  // 🧑‍💼 DEALER
  if (role === "dealer") {
    return {
      redirect: {
        destination: "/dealer/dashboard",
        permanent: false,
      },
    };
  }

  // 👤 USER (default)
  return {
    redirect: {
      destination: "/user/dashboard",
      permanent: false,
    },
  };
}

// 👇 Ye page kabhi UI render nahi karta
export default function Redirect() {
  return null;
}
