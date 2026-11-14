import { auth } from "@/app/_lib/auth";

export const proxy = auth;

// export const proxy = auth((req) => {
//   console.log("Proxy executed:", req.nextUrl.pathname);
// });

export const config = {
  matcher: ["/checkout"],
};
