import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Stub for future Supabase Auth — pass-through in V0.1 */
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
