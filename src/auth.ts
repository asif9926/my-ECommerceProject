import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import connectDB from "./lib/db";
import User from "./models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectDB();
        
        const user = await User.findOne({ email: credentials?.email });
        if (!user) throw new Error("User not found");

        const isMatch = await bcrypt.compare(credentials?.password as string, user.password);
        if (!isMatch) throw new Error("Invalid password");

        // ডাটাবেস থেকে role এবং id সহ অবজেক্ট রিটার্ন করা হচ্ছে
        return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // TypeScript এরর দূর করতে 'as any' যুক্ত করা হলো
        token.role = (user as any).role; 
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // TypeScript এরর দূর করতে 'as any' যুক্ত করা হলো
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    }
  }
});