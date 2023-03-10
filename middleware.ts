import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { authority } from "@pages/types"

export default withAuth(
	// `withAuth` augments your `Request` with the user's token.
	// todo: fix this. it's working but not as intended
	function middleware(req) {
		if (!req.nextauth.token && req.nextUrl.pathname.startsWith("/login")) {
			console.log('pasok');
			return NextResponse.redirect(new URL("/login", req.url))
		}
		if (!req.nextauth.token)
			return NextResponse.redirect(new URL("/login?message=invalid token", req.url))

		if (
			req.nextUrl.pathname.startsWith("/admin") &&
			req.nextauth.token?.authorityId < authority.admin
		) {
			console.log('redirect to store/dashboard');
			return NextResponse.redirect(new URL("/store/dashboard?message=unauthorized", req.url),)
		}
		if (
			req.nextUrl.pathname.startsWith("/stores") &&
			req.nextauth.token?.authorityId < authority.registered
		)
			return NextResponse.redirect(new URL("/login?message=unauthorized", req.url))
		if (
			req.nextUrl.pathname.startsWith("/product") &&
			req.nextauth.token?.authorityId < authority.storeOwner
		) {
			console.log('nasa products');
			return NextResponse.redirect(new URL("/login?message=unauthorized", req.url))
		}
		if (
			req.nextUrl.pathname.startsWith("/login") &&
			req.nextauth.token?.authorityId >= authority.registered
		)
			return NextResponse.redirect(new URL("/store/dashboard", req.url))
	},
	{
		callbacks: {
			authorized: ({ token }) => !!token,
		},
	}
)

export const config = {
	matcher: ["/admin/:path*", "/store/:path*", "/product/:path*"],
}
