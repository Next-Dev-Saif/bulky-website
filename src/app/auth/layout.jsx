"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen">
      {/* Back Button */}
      <div className="absolute top-8 left-8 z-50">
        <Link 
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white blur-none backdrop-blur-md border border-white/20 rounded-full text-secondary font-medium transition-all group lg:bg-white lg:shadow-md"
        >
          <motion.div
            animate={{ x: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ArrowLeft size={20} />
          </motion.div>
          Back to Home
        </Link>
      </div>

      {children}
    </div>
  );
}
