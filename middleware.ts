import { withAuth } from "next-auth/middleware"
import { NextRequest, NextResponse } from "next/server"
import { authority } from "./pages/interface"

export default withAuth(
	// `withAuth` augments your `Request` with the user's token.
	function middleware(req) {
		console.log("token: ", req.nextauth.token)
		if (!req.nextauth.token)
			return NextResponse.rewrite(new URL("/auth/login?message=invalid token", req.url))
		if (
			req.nextUrl.pathname.startsWith("/admin") &&
			req.nextauth.token.authorityId < authority.admin
		)
			return NextResponse.rewrite(
				new URL("/auth/login?message=You Are Not Authorized!", req.url)
			)
		if (
			(req.nextUrl.pathname.startsWith("/stores") && req.nextauth.token?.authorityId) ??
			0 < authority.storeOwner
		)
			return NextResponse.rewrite(
				new URL("/auth/login?message=You Are Not Authorized!", req.url)
			)
	},
	{
		callbacks: {
			authorized: ({ token }) => !!token,
		},
	}
)

export const config = {
	matcher: ["/admin/:path*", "/user/:path*"],
}
