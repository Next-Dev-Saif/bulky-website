import { db } from "@/lib/firebase/config";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { id, firstName, lastName, phone, photo } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const userRef = doc(db, "users", id);
    
    // Perform Firestore update on the server-side for reliability and speed
    await updateDoc(userRef, {
      firstName,
      lastName,
      phone,
      photo: photo || "",
      isActive: true,
      updatedAt: serverTimestamp(),
      profileCompleted: true,
    });

    return NextResponse.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
