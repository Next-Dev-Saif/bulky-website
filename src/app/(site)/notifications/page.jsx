"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import {
  Bell,
  CheckCheck,
  Calendar,
  MessageSquare,
  User,
  Package,
  Info,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/utils/cn";

const typeConfig = {
  booking: { icon: Calendar, color: "text-blue-500", bg: "bg-blue-50" },
  message: {
    icon: MessageSquare,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  account: { icon: User, color: "text-violet-500", bg: "bg-violet-50" },
  delivery: { icon: Package, color: "text-amber-500", bg: "bg-amber-50" },
  default: { icon: Info, color: "text-primary", bg: "bg-primary/10" },
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } =
    useNotifications(user);

  const getConfig = (type) => typeConfig[type] || typeConfig.default;

  return (
    <div className="min-h-screen pt-28 pb-20 bg-gray-50 font-poppins">
      <div className="container-custom">
        {/* Page header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-secondary tracking-tight">
              Notifications
            </h1>
            <p className="text-sm text-text-light mt-1 font-medium">
              {unreadCount > 0 ? (
                <>
                  <span className="text-primary font-bold">
                    {unreadCount} unread
                  </span>{" "}
                  — tap a notification to dismiss
                </>
              ) : (
                "You&apos;re all caught up"
              )}
            </p>
          </div>
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-2 text-xs font-bold text-primary disabled:text-gray-300 disabled:cursor-not-allowed hover:underline transition-colors"
          >
            <CheckCheck size={16} />
            Mark all read
          </button>
        </div>

        {/* List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
          {loading ? (
            // Skeleton
            [1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-6 py-5 animate-pulse"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 bg-gray-100 rounded" />
                  <div className="h-3 w-2/3 bg-gray-50 rounded" />
                </div>
                <div className="h-3 w-16 bg-gray-50 rounded" />
              </div>
            ))
          ) : notifications.length > 0 ? (
            <AnimatePresence initial={false}>
              {notifications.map((notif, i) => {
                const config = getConfig(notif.type);
                const IconComp = config.icon;
                return (
                  <motion.button
                    key={notif.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ delay: i * 0.03, duration: 0.2 }}
                    onClick={() => !notif.read && markAsRead(notif.id)}
                    className={cn(
                      "w-full flex items-start gap-4 px-6 py-5 text-left hover:bg-gray-50/70 transition-colors relative",
                      !notif.read && "bg-primary/[0.025]",
                    )}
                  >
                    {/* Unread indicator */}
                    {!notif.read && (
                      <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-r-full" />
                    )}

                    {/* Icon */}
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                        config.bg,
                      )}
                    >
                      <IconComp size={18} className={config.color} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-sm font-semibold leading-snug truncate",
                          notif.read ? "text-secondary/70" : "text-secondary",
                        )}
                      >
                        {notif.title}
                      </p>
                      <p className="text-xs text-text-light mt-0.5 line-clamp-1 font-medium">
                        {notif.body}
                      </p>
                    </div>

                    {/* Timestamp + read dot */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="text-[11px] text-text-light/60 font-medium whitespace-nowrap">
                        {formatDistanceToNow(new Date(notif.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          ) : (
            // Empty state
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-300 mb-4">
                <Bell size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-bold text-secondary mb-1">
                All caught up!
              </h3>
              <p className="text-sm text-text-light font-medium max-w-xs">
                No notifications yet. We&apos;ll let you know when something
                happens.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
