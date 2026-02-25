import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "../../../lib/mongodb";

/* ======================================================
   🔒 HARD LOCKED ADMINS (LOWERCASE)
====================================================== */
const ADMIN_EMAILS = [
  "inder.ambalika@gmail.com",
  "divinetoonz11@gmail.com",
].map(e => e.toLowerCase());

/* ======================================================
   🔐 AUTH OPTIONS
====================================================== */
export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    /* =========================
       🔑 JWT CALLBACK
       (LOGIN TIME ONLY)
    ========================= */
    async jwt({ token, user }) {
      // ✅ normal page refresh / logout time
      if (!user?.email) return token;

      const email = user.email.toLowerCase();
      const name = user.name || "";

      const client = await clientPromise;
      const db = client.db();
      const users = db.collection("users");

      // 🔒 ADMIN HARD LOCK
      if (ADMIN_EMAILS.includes(email)) {
        token.email = email;
        token.role = "admin";
        token.name = name;
        return token;
      }

      const dbUser = await users.findOne({ email });

      // 🆕 FIRST LOGIN → CREATE USER
      if (!dbUser) {
        await users.insertOne({
          name,
          email,
          role: "user",
          createdAt: new Date(),
        });

        token.email = email;
        token.role = "user";
        token.name = name;
        return token;
      }

      // 🔁 EXISTING USER / DEALER
      token.email = email;
      token.role = dbUser.role || "user";
      token.name = dbUser.name || name;
      return token;
    },

    /* =========================
       🧾 SESSION CALLBACK
    ========================= */
    async session({ session, token }) {
      session.user = {
        email: token.email,
        role: token.role,
        name: token.name,
      };
      return session;
    },

    /* =========================
       🔁 REDIRECT CALLBACK
       ⚠️ LOGIN ONLY
       ❌ LOGOUT SE KOI MATLAB NAHI
    ========================= */
    async redirect({ baseUrl, url }) {
      // ✅ logout ke baad signOut callbackUrl use hota hai
      // ✅ login ke baad sab users auth/redirect par jayenge
      if (url.startsWith(baseUrl)) return url;
      return baseUrl + "/auth/redirect";
    },
  },
};

/* ======================================================
   🔥 DEFAULT EXPORT
====================================================== */
export default NextAuth(authOptions);
