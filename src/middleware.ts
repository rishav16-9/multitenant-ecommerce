import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    // match all path except for /api/routes, /_next(Next.js internal), /static (inside public),/all route file inside /public eg(favicon.ico)
    "/((?!api/|_next/|_static/|_vercel|media/|[\w-]+\.\w+).*)",
  ],
};

export default async function middleWare(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";
  const rootdomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;

  if (hostname.endsWith(`.${rootdomain}`)) {
    const tenantSlug = hostname.replace(`.${rootdomain}`, "");
    return NextResponse.rewrite(
      new URL(`/tenants/${tenantSlug}${url.pathname}`, req.url)
    );
  }

  return NextResponse.next()
}
