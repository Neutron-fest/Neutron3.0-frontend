import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1. Extract cookies from the incoming request
  const cookieHeader = request.headers.get("cookie") || "";

  console.info("[middleware/profile] request", {
    pathname,
    search,
    hasCookieHeader: Boolean(cookieHeader),
    cookieHeaderPreview: cookieHeader ? cookieHeader.slice(0, 120) : "",
  });

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
      method: "GET",
      headers: {
        // 2. Pass the cookies to your backend API
        Cookie: cookieHeader,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn("[middleware/profile] auth/me rejected", {
        pathname,
        search,
        status: response.status,
      });
      throw new Error("SESSION_INVALID");
    }

    const payload = await response.json();

    console.info("[middleware/profile] auth/me payload", {
      pathname,
      search,
      success: payload?.success,
      hasUser: Boolean(payload?.data?.user),
    });

    // 3. Validate user data
    if (!payload?.success || !payload?.data?.user) {
      console.warn("[middleware/profile] session payload missing user", {
        pathname,
        search,
      });
      throw new Error("SESSION_INVALID");
    }

    // Auth success - continue to the requested page
    console.info("[middleware/profile] allowing request", {
      pathname,
      search,
    });
    return NextResponse.next();
  } catch (error) {
    // 4. Redirect to sign-in on any auth failure
    const callbackUrl = encodeURIComponent(`${pathname}${search || ""}`);
    const signinUrl = new URL(
      `/auth/signin?callbackUrl=${callbackUrl}`,
      request.url,
    );

    console.warn("[middleware/profile] redirecting to signin", {
      pathname,
      search,
      callbackUrl: `${pathname}${search || ""}`,
      signinUrl: signinUrl.toString(),
    });

    return NextResponse.redirect(signinUrl);
  }
}

export const config = {
  matcher: ["/profile/:path*"],
};
