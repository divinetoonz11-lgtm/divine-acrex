import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "../../../lib/mongodb";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true, // ✅ Railway fix (already required)

  basePath: "/api/auth", // ✅ CRITICAL FIX for Railway + custom domain

  session: { strategy: "jwt" },

  providers: [
    // 🔵 GOOGLE LOGIN (USER + DEALER)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account", // ✅ avoids stale session / redirect confusion
        },
      },
    }),

    // 🔐 PHONE / OTP (disabled safely)
    CredentialsProvider({
      id: "credentials",
      name: "Phone",
      credentials: {},
      async authorize() {
        return null;
      },
    }),
  ],

  callbacks: {
    // ===== SESSION CALLBACK =====
    async session({ session, token }) {
      session.user.email = token.email;
      session.user.role = token.role || "user";
      return session;
    },

    // ===== JWT CALLBACK =====
    async jwt({ token, account, profile }) {
      // 🔒 SAFE GUARD — SAME LOGIC, CRASH-FREE
      if (account && (token.email || profile?.email)) {
        const client = await clientPromise;
        const db = client.db();
        const users = db.collection("users");

        const email = (token.email || profile.email).toLowerCase();

        const existing = await users.findOne({ email });

        if (existing) {
          token.role = existing.role;
        } else {
          await users.insertOne({
            email,
            role: "user",
            createdAt: new Date(),
          });
          token.role = "user";
        }

        token.email = email;
      }

      return token;
    },
  },

  pages: {
    signIn: "/", // landing page
  },
};

export default NextAuth(authOptions);
