"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Smartphone, LogOut, Home, Settings, User } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/globals/Navbar";

export default function MobileAppInstallPage() {
  const { userData, logout } = useAuth();
  const [userType, setUserType] = useState("");

  useEffect(() => {
    if (userData?.type) {
      setUserType(userData.type);
    }
  }, [userData]);

  const handleLogout = async () => {
    await logout();
    if (typeof window !== "undefined") {
      window.location.href = "/auth";
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaff]">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-md mx-auto">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10 text-center">
            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Smartphone size={32} className="text-primary" strokeWidth={2} />
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-bold text-heading mb-3">
              Mobile App Required
            </h1>

            {/* Message */}
            <p className="text-text-light leading-relaxed mb-2">
              Please install the Bulky mobile app to continue.
            </p>
            <p className="text-sm text-text-light/80 mb-8">
              Your current role is{" "}
              <span className="font-semibold text-primary capitalize">
                {userType || "Driver/Admin"}
              </span>
              , which requires the mobile application.
            </p>

            {/* Download Buttons */}
            <div className="space-y-3 mb-8">
              <a
                href="#"
                className="flex items-center justify-center gap-3 w-full py-3 px-5 bg-black text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.21-.94 3.84-.74 1.44.2 2.41.94 3.06 2.15-2.77 1.36-2.29 5.02.22 6.02-.52 1.36-1.19 2.71-2.2 3.8zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                App Store
              </a>
              <a
                href="#"
                className="flex items-center justify-center gap-3 w-full py-3 px-5 bg-black text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
                </svg>
                Google Play
              </a>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm text-text-light">
                  or
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full py-3 px-5 border border-gray-200 text-text-light rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <Link
              href="/"
              className="flex flex-col items-center gap-1 text-text-light hover:text-primary transition-colors"
            >
              <Home size={20} strokeWidth={2} />
              <span className="text-xs font-medium">Home</span>
            </Link>
            <Link
              href="/settings"
              className="flex flex-col items-center gap-1 text-text-light hover:text-primary transition-colors"
            >
              <Settings size={20} strokeWidth={2} />
              <span className="text-xs font-medium">Settings</span>
            </Link>
            <Link
              href="/settings/profile"
              className="flex flex-col items-center gap-1 text-text-light hover:text-primary transition-colors"
            >
              <User size={20} strokeWidth={2} />
              <span className="text-xs font-medium">Profile</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
