import CredentialsProvider from "next-auth/providers/credentials"
import NextAuth, { User } from "next-auth"
import type { NextAuthOptions } from "next-auth"
import prisma from "../db"
import { compare } from "../middleware"
import { userDetails } from "../../interface"
export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				username: {
					label: "UserName",
					type: "text",
					placeholder: "jsmith",
				},
				password: {
					label: "Password",
					type: "password",
				},
			},
			async authorize(credentials, req) {
				// console.log(credentials, req)
				const { username, password } = credentials as any
				if (!username || !password) return null
				const user: userDetails = (await prisma.users
					.findFirst({
						where: { userName: username },
					})
					.then((d) => ({
						id: d?.id.toString(),
						authorityId: d?.authorityId,
						storeId: d?.storeId.toString(),
						userName: d?.userName,
						password: d?.password,
					}))) as any

				if (!user || !user.password) return null
				const isCorrect = compare(password, user.password)
				if (!isCorrect) return null
				else
					return {
						id: user.id,
						authorityId: user.authorityId,
						storeId: user.storeId,
						userName: user.userName,
					}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			return { ...token, ...user }
		},
		async session({ session, token, user }) {
			// Send properties to the client, like an access_token from a provider.
			session.user = token
			return session
		},
	},

	pages: {
		signIn: "/login",
		signOut: "/logout",
		error: "/error",
	},
}

export default NextAuth(authOptions)
