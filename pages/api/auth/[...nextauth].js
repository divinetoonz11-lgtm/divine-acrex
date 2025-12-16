import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),

  providers: [
    /* ================= GOOGLE LOGIN ================= */
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    /* ================= PHONE LOGIN ================= */
    CredentialsProvider({
      name: "Phone",
      credentials: {
        phone: { label: "Phone", type: "text" },
        role: { label: "Role", type: "text" },
        referralCode: { label: "Referral", type: "text" },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db();
        const users = db.collection("users");

        const phone = credentials.phone;
        const role = credentials.role || "user";
        const referralCode = credentials.referralCode || null;

        if (!phone || phone.length !== 10) return null;

        let user = await users.findOne({ phone });

        /* FIRST LOGIN */
        if (!user) {
          const ins = await users.insertOne({
            phone,
            role,
            referralUsed: referralCode, // ✅ SAVE REFERRAL
            createdAt: new Date(),
          });
          user = await users.findOne({ _id: ins.insertedId });
        }

        return {
          id: user._id.toString(),
          phone: user.phone,
          role: user.role,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    /* ================= JWT ================= */
    async jwt({ token, user, account }) {
      const client = await clientPromise;
      const db = client.db();
      const users = db.collection("users");

      /* ---------- GOOGLE LOGIN ---------- */
      if (user?.email) {
        token.email = user.email;
        token.name = user.name || "";

        const state =
          account?.state && JSON.parse(account.state || "{}");

        const referralCode = state?.ref || null;
        const roleFromUI =
          state?.role === "dealer" ? "dealer" : "user";

        let dbUser = await users.findOne({ email: user.email });

        if (!dbUser) {
          await users.insertOne({
            email: user.email,
            name: user.name,
            role: roleFromUI,
            referralUsed: referralCode, // ✅ SAVE REFERRAL
            createdAt: new Date(),
          });
          token.role = roleFromUI;
        } else {
          token.role = dbUser.role;
        }
      }

      /* ---------- PHONE LOGIN ---------- */
      if (user?.phone) {
        token.phone = user.phone;
        token.role = user.role;
      }

      return token;
    },

    /* ================= SESSION ================= */
    async session({ session, token }) {
      session.user = {
        email: token.email || null,
        phone: token.phone || null,
        role: token.role,
      };
      return session;
    },
  },
};

export default NextAuth(authOptions);
