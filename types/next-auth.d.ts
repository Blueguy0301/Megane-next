import NextAuth, { DefaultSession } from "next-auth"
import { userDetails } from "@pages/types"
import type { JWT } from "next-auth/jwt"

declare module "next-auth" {
	/**
	 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		user: userDetails
	}
}

declare module "next-auth/jwt" {
	/** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
	interface JWT extends userDetails {

		/** OpenID ID Token */
		idToken?: string

	}
}
