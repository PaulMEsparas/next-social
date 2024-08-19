// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// //Array of protected routes
// const isProtectedRoute = createRouteMatcher(["/settings(.*)"]);

// export default clerkMiddleware((auth, req) => {
//   if (isProtectedRoute(req)) auth().protect;
// });

// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// };

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// const isProtectedRoute = createRouteMatcher([
//   "/settings(.*)",
//   "/",
//   "/friends",
//   "/stories",
// ]);

// Define which routes are protected
const isProtectedRoute = createRouteMatcher([
  "/settings(.*)", // Protect /settings and any subroutes
  "/", // Protect the homepage
  "/friends(/.*)?", // Protect /friends and /friends/anyusername
  "/stories(/.*)?", // Protect /stories and /stories/anyusername
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
