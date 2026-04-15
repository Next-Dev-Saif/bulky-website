"use client";
import { useAuth } from "@/context/AuthContext";
import UserMenu from "@/components/globals/UserMenu";
import { useEffect, useState, useMemo } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/utils/cn";
import Link from "next/link";
import Button from "@/core-components/Button";
import {
  Menu,
  X,
  User,
  Calendar,
  LogOut,
  MessageSquare,
  Bell,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

const Navbar = () => {
  const { user, loading } = useAuth();
  const { unreadCount } = useNotifications(user);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll(); // Check initial scroll position
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Create Booking", href: "/booking/create" },
    { name: "Messages", href: "/dashboard/chat" },
    { name: "Notifications", href: "/notifications" },
    { name: "Contact Us", href: "/contact-us" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4",
        isScrolled
          ? "bg-white/80 backdrop-blur-lg shadow-sm py-3"
          : "bg-transparent",
      )}
    >
      <div className="container-custom flex items-center justify-between">
        <Link href="/" className="relative h-10 w-32">
          <Image
            src="/logos/nav.png"
            alt="Bulky Logo"
            fill
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-secondary font-medium hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Auth Actions or User Menu */}
        <div className="hidden md:flex items-center gap-6">
          {user && !loading && (
            <Link
              href="/notifications"
              className="relative p-2 text-secondary hover:text-primary transition-colors group"
            >
              <Bell
                size={24}
                className="group-hover:rotate-12 transition-transform"
              />
              <AnimatePresence>
                {unreadCount > 0 && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute top-1 right-1 w-5 h-5 bg-primary text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-lg"
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="flex items-center gap-3">
              {/* Notification bell skeleton */}
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
              {/* Profile dropdown skeleton */}
              <div className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-gray-100">
                <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
                <div className="w-4 h-4 rounded-full bg-gray-200 animate-pulse" />
              </div>
            </div>
          )}

          {!loading &&
            (user ? (
              <UserMenu />
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="outline" size="pill">
                    Log In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="primary" size="pill">
                    Sign Up
                  </Button>
                </Link>
              </>
            ))}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-secondary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b overflow-hidden"
          >
            <div className="container-custom py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium text-secondary py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t">
                {/* Mobile Loading Skeleton */}
                {loading && (
                  <>
                    <div className="flex items-center gap-3 p-2">
                      <div className="w-5 h-5 rounded-full bg-gray-200 animate-pulse" />
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="flex items-center gap-3 p-2">
                      <div className="w-5 h-5 rounded-full bg-gray-200 animate-pulse" />
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="flex items-center gap-3 p-2">
                      <div className="w-5 h-5 rounded-full bg-gray-200 animate-pulse" />
                      <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </>
                )}

                {!loading && user ? (
                  <>
                    <Link
                      href="/settings"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-2 font-semibold text-secondary"
                    >
                      <User size={20} className="text-primary" /> Profile
                    </Link>
                    <Link
                      href="/bookings"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-2 font-semibold text-secondary"
                    >
                      <Calendar size={20} className="text-primary" /> My
                      Bookings
                    </Link>
                    <Link
                      href="/dashboard/chat"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-2 font-semibold text-secondary"
                    >
                      <MessageSquare size={20} className="text-primary" />{" "}
                      Messages
                    </Link>
                    <Link
                      href="/notifications"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2 font-semibold text-secondary"
                    >
                      <div className="flex items-center gap-3">
                        <Bell size={20} className="text-primary" />{" "}
                        Notifications
                      </div>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-black rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                        if (typeof window !== "undefined") {
                          window.location.href = "/";
                        }
                      }}
                      className="flex items-center gap-3 p-2 font-bold text-red-500 text-left"
                    >
                      <LogOut size={20} /> Logout
                    </button>
                  </>
                ) : !loading ? (
                  <>
                    <Link
                      href="/auth"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button variant="outline" fullWidth>
                        Log In
                      </Button>
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button variant="primary" fullWidth>
                        Sign Up
                      </Button>
                    </Link>
                  </>
                ) : null}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
