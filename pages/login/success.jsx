import { getSession } from "next-auth/react";

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);

  if (!session || !session.user) {
    return { redirect: { destination: "/", permanent: false } };
  }

  return {
    redirect: {
      destination:
        session.user.role === "dealer"
          ? "/dealer/dashboard"
          : "/user/dashboard",
      permanent: false,
    },
  };
}

export default function Success() {
  return null;
}
