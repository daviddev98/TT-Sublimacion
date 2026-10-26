import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { SESSION_COOKIE } from "@/lib/auth"

export function proxy(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE)?.value
  const isLogin = request.nextUrl.pathname.startsWith("/login")

  if (!session && !isLogin) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (session && isLogin) {
    return NextResponse.redirect(new URL("/pedido", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|svg|jpg|jpeg|webp|ico)$).*)",
  ],
}
