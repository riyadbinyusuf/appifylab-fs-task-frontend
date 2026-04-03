import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;
  const redirectUrl = request.nextUrl.searchParams.get("redirect") || "/";

  if (!refreshToken) {
    return NextResponse.redirect(new URL(`/login?redirect=${redirectUrl}`, request.url));
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${refreshToken}`,
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    return NextResponse.redirect(new URL(`/login?redirect=${redirectUrl}`, request.url));
  }

  const data = await res.json();

  cookieStore.set("session_token", data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });

  if (data.refreshToken) {
    cookieStore.set("refresh_token", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });
  }

  return NextResponse.redirect(new URL(redirectUrl, request.url));
}