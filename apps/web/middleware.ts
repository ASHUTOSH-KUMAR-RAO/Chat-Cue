import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Public routes (no auth required)
const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

// Routes where org is not required
const isOrgFreeRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/org-selection(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, orgId } = await auth();

  // First check if user is authenticated for protected routes
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  // After authentication, check if user needs to select an org
  // Only redirect if:
  // 1. User is logged in (userId exists)
  // 2. User has no org selected (!orgId)
  // 3. Current route is not org-free
  if (userId && !orgId && !isOrgFreeRoute(req)) {
    const orgSelection = new URL("/org-selection", req.url);
    orgSelection.searchParams.set("redirectUrl", req.url);

    return NextResponse.redirect(orgSelection);
  }

  // Allow the request to continue
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
