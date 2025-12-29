import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";

export async function getServerSideProps({ req, res }) {
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

// 👇 Ye page kabhi render nahi hota
export default function Redirect() {
  return null;
}
