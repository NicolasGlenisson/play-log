import type { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import GoogleProvider from "next-auth/providers/google";

// Extend session type with user id
declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: number;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
  }
}
// Next auths options: https://next-auth.js.org/configuration/options
export const options: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Mail",
        },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // If user doesn't exists or doesn't have password (google account)
        if (!user || !user.password) return null;

        const passwordsMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (passwordsMatch) {
          return {
            ...user,
            id: user.id.toString(), // Convert id to string
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      console.log(account);
      if (account?.provider === "google" && user?.email) {
        // If there is no user linked to this account, we create it
        try {
          const existingUser = await prisma.user.findUnique({
            where: { googleId: account.providerAccountId },
          });

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || "user_name",
                password: "",
                googleId: account.providerAccountId,
              },
            });
          }
        } catch (error) {
          console.error("Error creating user:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      // Add user id to jwt token when play login
      if (user?.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
        if (!existingUser) return token;
        token.userId = existingUser.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user id to session
      if (session.user && typeof token.userId === "number") {
        session.user.id = token.userId;
      }
      return session;
    },
  },
};
