import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "../../../lib/mongodb";

function generateReferralCode() {
  return (
    "DA" +
    Math.random().toString(36).substring(2, 5).toUpperCase() +
    Math.floor(100 + Math.random() * 900)
  );
}

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
        let code, exists = true;
        while (exists) {
          code = generateReferralCode();
          exists = await users.findOne({ referralCode: code });
        }

        await users.insertOne({
          name: user.name || "",
          email: user.email,
          role: "dealer",        // 🔒 HARD FIX
          referralCode: code,    // ✅ GUARANTEED
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

      session.user.role = u?.role || "dealer";
      session.user.referralCode = u?.referralCode || null;
      return session;
    },
  },
});
