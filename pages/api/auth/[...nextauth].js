import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "../../../lib/mongodb";

export const authOptions = {
  // 🔐 Core security
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  basePath: "/api/auth",

  // 🔒 FORCE cookies to custom domain (CRITICAL FIX)
  cookies: {
    sessionToken: {
      name: "__Secure-next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
        domain: ".divineacres.in",
      },
    },
  },

  // 🔑 Session strategy
  session: {
    strategy: "jwt",
  },

  // ======================
  // AUTH PROVIDERS
  // ======================
  providers: [
    // 🔵 GOOGLE LOGIN
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
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

  // ======================
  // CALLBACKS
  // ======================
  callbacks: {
    // 🔁 SESSION CALLBACK
    async session({ session, token }) {
      session.user.email = token.email;
      session.user.role = token.role || "user";
      return session;
    },

    // 🔁 JWT CALLBACK
    async jwt({ token, account, profile }) {
      // 🛡️ SAFE LOGIN (NO CRASH)
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

  // ======================
  // PAGES
  // ======================
  pages: {
    signIn: "/",
  },
};

export default NextAuth(authOptions);
