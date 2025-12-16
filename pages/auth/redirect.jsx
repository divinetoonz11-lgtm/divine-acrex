import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import clientPromise from "../../lib/mongodb";

export async function getServerSideProps(ctx) {
  // 1️⃣ Session check
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session?.user) {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }

  // 2️⃣ DB connect
  const client = await clientPromise;
  const db = client.db();

  // 3️⃣ EMAIL + PHONE both supported
  const user = await db.collection("users").findOne({
    $or: [
      session.user.email ? { email: session.user.email } : null,
      session.user.phone ? { phone: session.user.phone } : null,
    ].filter(Boolean),
  });

  // 4️⃣ ROLE BASED REDIRECT (LOCKED)
  if (user?.role === "dealer") {
    return {
      redirect: { destination: "/dealer/dashboard", permanent: false },
    };
  }

  return {
    redirect: { destination: "/user/dashboard", permanent: false },
  };
}

export default function RedirectPage() {
  return null;
}
