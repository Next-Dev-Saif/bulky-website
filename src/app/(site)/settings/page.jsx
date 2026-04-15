"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Bell,
  Calendar,
  ChevronRight,
  LogOut,
  Mail,
  MessageCircle,
  ShieldCheck,
  Star,
  Trash2,
  Settings,
  User,
  HelpCircle,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";

export default function SettingsPage() {
  const { user, userData, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const sections = [
    {
      title: "Account",
      items: [
        {
          id: "notifications",
          title: "Notification Settings",
          icon: Bell,
          href: "/settings/notifications",
          desc: "Manage alerts and sounds",
        },
        {
          id: "bookings",
          title: "My Bookings",
          icon: Calendar,
          href: "/dashboard",
          desc: "View history and active bookings",
        },
      ],
    },
    {
      title: "Support & Legal",
      items: [
        {
          id: "feedback",
          title: "Give Feedback",
          icon: MessageCircle,
          href: "/settings/feedback",
        },
        {
          id: "privacy",
          title: "Privacy Policy",
          icon: ShieldCheck,
          href: "/privacy-policy",
        },
        {
          id: "terms",
          title: "Terms of Service",
          icon: FileText,
          href: "/terms-of-service",
        },
        {
          id: "support",
          title: "Customer Support",
          icon: HelpCircle,
          href: "/settings/support",
        },
      ],
    },
    {
      title: "Danger Zone",
      items: [
        {
          id: "delete",
          title: "Delete Account",
          icon: Trash2,
          href: "/settings/delete-account",
          isDanger: true,
          desc: "Permanently remove your account",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 bg-gray-50 font-poppins">
      <div className="container-custom">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-secondary tracking-tight">
            Settings
          </h1>
          <p className="text-sm text-text-light mt-1 font-medium">
            Manage your account and preferences
          </p>
        </div>

        {/* User card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/10 flex items-center justify-center overflow-hidden shrink-0">
              {userData?.photo ? (
                <img
                  src={userData.photo}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={28} className="text-primary" />
              )}
            </div>
            <div>
              <p className="font-bold text-secondary">
                {userData?.firstName || "User"} {userData?.lastName || ""}
              </p>
              <p className="text-xs text-text-light font-medium">
                {user?.email}
              </p>
            </div>
          </div>
          <Link
            href="/settings/profile"
            className="p-2 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-primary transition-colors"
          >
            <Settings size={20} />
          </Link>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, idx) => (
            <div key={idx}>
              <p className="text-[11px] font-black uppercase tracking-widest text-text-light/50 mb-3 px-1">
                {section.title}
              </p>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                {section.items.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/70 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-9 h-9 rounded-xl flex items-center justify-center",
                          item.isDanger
                            ? "bg-red-50 text-red-500"
                            : "bg-gray-50 text-secondary",
                        )}
                      >
                        <item.icon size={18} />
                      </div>
                      <div>
                        <p
                          className={cn(
                            "text-sm font-semibold",
                            item.isDanger ? "text-red-600" : "text-secondary",
                          )}
                        >
                          {item.title}
                        </p>
                        {item.desc && (
                          <p className="text-xs text-text-light font-medium">
                            {item.desc}
                          </p>
                        )}
                      </div>
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-gray-300 group-hover:text-gray-400 transition-colors"
                    />
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-4 bg-white hover:bg-red-50 text-red-500 font-bold text-sm rounded-2xl border border-gray-100 shadow-sm transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
