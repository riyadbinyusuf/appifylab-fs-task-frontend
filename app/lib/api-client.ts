import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {},
  isFile = false
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  const reqHeaders = {
    ...(isFile ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const apiEndpoint = `${API_BASE_URL}${endpoint}`

  const response = await fetch(apiEndpoint, {
    ...options,
    headers: reqHeaders,
  });

  if (response.status === 401) {
    const headerList = await headers();
    const referer = headerList.get("referer") || "/";
    const pathname = new URL(referer).pathname;
    redirect(`/api/auth/refresh?redirect=${encodeURIComponent(pathname)}`);
  }

  return response;
}
