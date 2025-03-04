import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// const signIn = async (request: NextRequest) => {
//   const cookieStore = await cookies();
//   //

//   const isLoggedIn = !!request.auth;
//   const isOnDashboard = request.nextUrl.pathname.startsWith("/dashboard");

//   if (isOnDashboard) {

// }

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

export default async function middleware(request: NextRequest) {
  const cookiesStore = await cookies();
  const { nextUrl } = request;
  const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

  const token = cookiesStore.get("token");

  // 如果用户未登录，并且请求的是dashboard页面，则重定向到登录页面
  if (!token && isOnDashboard) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // 如果用户已登录，并且请求的是登录页面，则重定向到dashboard页面
  if (token && nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
}
