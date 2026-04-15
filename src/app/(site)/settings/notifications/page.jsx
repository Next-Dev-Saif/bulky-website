"use client"

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import { ArrowLeft, Bell, Volume2, Vibrate } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

export default function NotificationSettingsPage() {
  const { user, userData } = useAuth();
  const [settings, setSettings] = useState({ generalNotification: true, sound: true, vibrate: true });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userData?.notifications) setSettings(userData.notifications);
  }, [userData]);

  const handleToggle = async (key) => {
    if (!user) return;
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), { notifications: newSettings });
    } catch {
      setSettings(settings);
    } finally {
      setIsSaving(false);
    }
  };

  const options = [
    { key: "generalNotification", label: "General Notifications", desc: "Booking updates and account activity", icon: Bell },
    { key: "sound",               label: "Sound",                  desc: "Play sound for alerts",               icon: Volume2 },
    { key: "vibrate",             label: "Vibrate",                desc: "Haptic feedback on alerts",           icon: Vibrate },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 bg-gray-50 font-poppins">
      <div className="container-custom">

        <Link href="/settings" className="inline-flex items-center gap-2 text-text-light hover:text-primary font-bold text-sm mb-6 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Settings
        </Link>

        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-secondary tracking-tight">Notifications</h1>
            <p className="text-sm text-text-light mt-1 font-medium">Control how you want to be notified</p>
          </div>
          {isSaving && <span className="text-xs font-bold text-primary animate-pulse">Saving…</span>}
        </div>

        <p className="text-[11px] font-black uppercase tracking-widest text-text-light/50 mb-3 px-1">Preferences</p>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
          {options.map((option) => (
            <div key={option.key} className="flex items-center justify-between px-6 py-5 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center",
                  settings[option.key] ? "bg-primary/10 text-primary" : "bg-gray-50 text-gray-400"
                )}>
                  <option.icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-secondary">{option.label}</p>
                  <p className="text-xs text-text-light font-medium">{option.desc}</p>
                </div>
              </div>

              {/* Toggle */}
              <button
                onClick={() => handleToggle(option.key)}
                className={cn(
                  "relative w-12 h-6 rounded-full transition-colors duration-300 outline-none p-0.5",
                  settings[option.key] ? "bg-primary" : "bg-gray-200"
                )}
              >
                <motion.div
                  animate={{ x: settings[option.key] ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-5 h-5 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>
          ))}
        </div>

        <p className="text-xs text-text-light font-medium mt-6 px-1">
          Critical booking and payment notifications cannot be disabled.
        </p>

      </div>
    </div>
  );
}
