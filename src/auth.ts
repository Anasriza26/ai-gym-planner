import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { sql } from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },

  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string"
            ? credentials.email.trim().toLowerCase()
            : "";

        const password =
          typeof credentials?.password === "string" ? credentials.password : "";

        if (!email || !password) {
          return null;
        }

        try {
          const users = await sql`
            SELECT
              id,
              name,
              email,
              password_hash,
              email_verified
            FROM users
            WHERE email = ${email}
            LIMIT 1
          `;

          const user = users[0];

          if (!user) {
            return null;
          }

          const passwordMatches = await compare(
            password,
            String(user.password_hash),
          );

          if (!passwordMatches) {
            return null;
          }

          if (user.email_verified !== true) {
            return null;
          }

          return {
            id: String(user.id),
            name: String(user.name),
            email: String(user.email),
          };
        } catch (error) {
          console.error("Login verification failed:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      return session;
    },
  },
});
