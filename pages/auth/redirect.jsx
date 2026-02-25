import { getServerSession } from "next-auth/next";

export async function getServerSideProps({ req, res, query }) {
  const { authOptions } = await import("../api/auth/[...nextauth]");
  const session = await getServerSession(req, res, authOptions);

  /* ❌ NOT LOGGED IN → LOGIN ONLY (HOME NEVER) */
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  /* ⏳ FIRST GOOGLE HIT (ROLE NOT YET IN TOKEN)
     → SAME PAGE ONCE, THEN JWT FILLS ROLE */
  if (!session.user?.role) {
    return {
      redirect: {
        destination: "/auth/redirect",
        permanent: false,
      },
    };
  }

  const role = session.user.role;
  const intent = query.as; // dealer intent from login

  /* 🔐 ADMIN */
  if (role === "admin") {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  /* 🧑‍💼 DEALER (approved OR intent) */
  if (role === "dealer" || intent === "dealer") {
    return {
      redirect: {
        destination: "/dealer/dashboard",
        permanent: false,
      },
    };
  }

  /* 👤 USER (DEFAULT) */
  return {
    redirect: {
      destination: "/user/dashboard",
      permanent: false,
    },
  };
}

/* UI NEVER RENDERS */
export default function Redirect() {
  return null;
}
