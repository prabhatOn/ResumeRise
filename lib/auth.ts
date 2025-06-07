import { compare } from "bcryptjs"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import { prisma } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  // Remove adapter when using JWT strategy to avoid conflicts
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  useSecureCookies: process.env.NODE_ENV === "production",
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login", // Error code passed in query string as ?error=
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials")
            return null
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          })

          if (!user || !user.passwordHash) {
            console.log("User not found or no password hash")
            return null
          }

          const isPasswordValid = await compare(credentials.password, user.passwordHash)

          if (!isPasswordValid) {
            console.log("Invalid password")
            return null
          }

          console.log("User authenticated successfully")
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          console.error("Authorization error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
        },
      }
    },
    jwt: ({ token, user }) => {
      if (user) {
        return {
          ...token,
          id: user.id,
        }
      }
      return token
    },
  },
  // Increase security in production
  cookies:
    process.env.NODE_ENV === "production"
      ? {
          sessionToken: {
            name: `__Secure-next-auth.session-token`,
            options: {
              httpOnly: true,
              sameSite: "lax",
              path: "/",
              secure: true,
            },
          },
        }
      : undefined,
  secret: process.env.NEXTAUTH_SECRET,
  debug: false, // Disable debug in production to reduce logs
}
