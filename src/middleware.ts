// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/public(.*)",
  "/api/subscriptions(.*)",
  "/api/user/monstra-bytes(.*)",
]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    auth.protect(); // ✅ note: no ()
  }
});

export const config = {
  matcher: [
    "/((?!_next|.*\\.(?:css|js|json|png|jpg|jpeg|gif|svg|ico|webp|map)$).*)",
    "/api/(.*)",
  ],
};