"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  LogOut,
  ChevronDown,
  Settings,
  LayoutDashboard,
  MessageSquare,
  Bell,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/utils/cn";

const UserMenu = () => {
  const { user, userData, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        handleClose();
      }
    };
    if (typeof document !== "undefined") {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 150);
  };

  const handleToggle = () => {
    if (isOpen) {
      handleClose();
    } else {
      setIsOpen(true);
    }
  };

  const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U";
  };

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Messages", href: "/dashboard/chat", icon: MessageSquare },
    { label: "Notifications", href: "/notifications", icon: Bell },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

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

  if (!user) return null;

  const displayName =
    `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim() || "User";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={handleToggle}
        className={cn(
          "flex items-center gap-2 pl-1 pr-2 py-1 rounded-full transition-all duration-200",
          isOpen ? "bg-gray-100" : "hover:bg-gray-100",
        )}
      >
        <div className="relative w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden ring-2 ring-white shadow-sm">
          {userData?.photo ? (
            <Image
              src={userData.photo}
              alt={displayName}
              fill
              className="object-cover"
            />
          ) : (
            <span className="text-primary font-bold text-xs">
              {getInitials(userData?.firstName, userData?.lastName)}
            </span>
          )}
        </div>

        <ChevronDown
          size={16}
          className={cn(
            "text-gray-400 transition-transform duration-200",
            isOpen && !isClosing && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-[100] origin-top-right",
            "transition-all duration-150",
            isClosing
              ? "opacity-0 translate-y-2 scale-95"
              : "opacity-100 translate-y-0 scale-100 animate-dropdown",
          )}
        >
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                {userData?.photo ? (
                  <Image
                    src={userData.photo}
                    alt={displayName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-primary font-bold text-sm">
                    {getInitials(userData?.firstName, userData?.lastName)}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-heading truncate">
                  {displayName}
                </p>
                <p className="text-xs text-text-light truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={handleClose}
                className="flex items-center gap-3 px-4 py-2.5 text-secondary hover:bg-gray-50 hover:text-primary transition-colors"
              >
                <item.icon size={18} className="text-gray-400" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 pt-1 mt-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
