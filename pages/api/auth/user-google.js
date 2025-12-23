import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "../../../lib/mongodb";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async signIn({ user }) {
      const client = await clientPromise;
      const db = client.db();
      const users = db.collection("users");

      let dbUser = await users.findOne({ email: user.email });

      if (!dbUser) {
        await users.insertOne({
          name: user.name || "",
          email: user.email,
          role: "user",        // 🔒 HARD FIX
          createdAt: new Date(),
        });
      }

      return true;
    },

    async session({ session }) {
      const client = await clientPromise;
      const db = client.db();

      const u = await db.collection("users").findOne({
        email: session.user.email,
      });

      session.user.role = u?.role || "user";
      return session;
    },
  },
});
