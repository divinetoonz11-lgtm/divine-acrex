import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "../../../lib/mongodb";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

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
    async session({ session, token }) {
      session.user.email = token.email;
      session.user.role = token.role || "user";
      return session;
    },

    async jwt({ token, account }) {
      if (account && token.email) {
        const client = await clientPromise;
        const db = client.db();
        const users = db.collection("users");

        const email = token.email.toLowerCase();
        const existing = await users.findOne({ email });

        if (existing) {
          token.role = existing.role;
        } else {
          // default user create (as before)
          await users.insertOne({
            email,
            role: "user",
            createdAt: new Date(),
          });
          token.role = "user";
        }
      }
      return token;
    },
  },

  pages: {
    signIn: "/",
  },
};

export default NextAuth(authOptions);
