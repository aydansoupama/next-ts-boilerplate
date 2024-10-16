import NextAuth, { NextAuthConfig, Session } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcrypt"
import prisma from "@/lib/database"

export const authOptions: NextAuthConfig = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Mot de passe", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string }
                })

                if (!user || !user.hashedPassword) return null

                const isPasswordValid = await compare(credentials.password as string, user.hashedPassword)
                if (!isPasswordValid) return null

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
            }
            if (trigger === "update" && session?.name) {
                token.name = session.name;
                token.email = session.email;
            }
            return token;
        },
        async session({ session, token }): Promise<Session> {
            if (token) {
                session.user = {
                    id: token.id as string,
                    name: token.name,
                    email: token.email as string,
                    emailVerified: token.emailVerified as Date | null,
                };
            }
            return session;
        }
    },
    pages: {
        signIn: '/signin',
    },
    debug: process.env.NODE_ENV === "development",
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)