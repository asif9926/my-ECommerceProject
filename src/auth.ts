import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
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

        // 🔥 FIX 1: jodi user Google diye account khule thake
        if (!user.password) {
          throw new Error("Please login with Google.");
        }

        const isMatch = await bcrypt.compare(credentials?.password as string, user.password);
        if (!isMatch) throw new Error("Invalid password");

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
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // 🔥 FIX 2: Google diye login korle database-e user save kora
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDB();
        const existingUser = await User.findOne({ email: user.email });
        
        if (!existingUser) {
          await User.create({
            name: user.name,
            email: user.email,
            role: "user",
          });
        }
      }
      return true;
    },
    
    async jwt({ token, user, account }) {
      if (user) {
        // Google diye login korle database theke ID ebong Role ana
        if (account?.provider === "google") {
          await connectDB();
          const dbUser = await User.findOne({ email: user.email });
          if (dbUser) {
            token.id = dbUser._id.toString();
            token.role = dbUser.role || "user";
          }
        } else {
          token.id = user.id;
          token.role = (user as any).role; 
        }
      }
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    }
  }
});