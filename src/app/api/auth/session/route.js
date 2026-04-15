import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { action, userType } = await request.json();
  const cookieStore = await cookies();

  if (action === "login") {
    // Set session cookie
    cookieStore.set("bulky-session", "active", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    // Store user type in a separate cookie for middleware access
    if (userType) {
      cookieStore.set("bulky-user-type", userType, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
    }
    return NextResponse.json({ success: true });
  }

  if (action === "logout") {
    cookieStore.delete("bulky-session");
    cookieStore.delete("bulky-user-type");
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
