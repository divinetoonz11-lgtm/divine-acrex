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
       JWT CALLBACK (SOURCE OF TRUTH)
    ========================= */
    async jwt({ token, user }) {
      // first hit (login)
      if (user?.email) {
        const email = user.email.toLowerCase();

        const client = await clientPromise;
        const db = client.db();
        const users = db.collection("users");

        // 🔒 ADMIN HARD LOCK
        if (ADMIN_EMAILS.includes(email)) {
          token.email = email;
          token.role = "admin";
          token.name = user.name || "";
          return token;
        }

        const dbUser = await users.findOne({ email });

        // 🆕 FIRST LOGIN → CREATE USER (SAFE DEFAULT)
        if (!dbUser) {
          await users.insertOne({
            name: user.name || "",
            email,
            mobile: "",
            role: "user",        // 🔹 default
            kycStatus: "pending",
            createdAt: new Date(),
          });

          token.email = email;
          token.role = "user";
          token.name = user.name || "";
          return token;
        }

        // 🔁 EXISTING USER (USER / DEALER / SUB-ADMIN)
        token.email = email;
        token.role = dbUser.role || "user";
        token.name = dbUser.name || user.name || "";
        return token;
      }

      return token;
    },

    /* =========================
       SESSION CALLBACK
    ========================= */
    async session({ session, token }) {
      session.user = {
        email: token.email,
        role: token.role,
        name: token.name,
      };
      return session;
    },
  },
};

export default NextAuth(authOptions);
