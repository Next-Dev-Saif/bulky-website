"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const AuthStepWrapper = ({ 
  illustration, 
  title, 
  description, 
  children,
  onBack,
  showLogo = true
}) => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans bg-white">
      {/* Back Button */}
      {onBack && (
        <div className="fixed top-8 left-8 z-[60]">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white blur-none backdrop-blur-md border border-white/20 rounded-full text-secondary font-medium transition-all group lg:bg-white lg:shadow-md"
          >
            <motion.div
              animate={{ x: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ArrowLeft size={20} />
            </motion.div>
            Back
          </button>
        </div>
      )}

      {/* Left Decoration - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#E2E3FF] items-center justify-center relative overflow-hidden">
        <motion.div
          key={illustration}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-full h-full"
        >
          <Image
            src={illustration}
            alt="Auth Illustration"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </div>

      {/* Right Content - Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 md:px-12 py-20 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            {showLogo && (
              <Link href="/" className="inline-block mb-8">
                <Image src="/logos/nav.png" alt="Bulky" width={120} height={40} className="w-auto h-10 grayscale brightness-0" />
              </Link>
            )}
            <h1 className="text-3xl font-bold text-heading mb-2">{title}</h1>
            <p className="text-text-light">{description}</p>
          </div>

          {children}

          <div className="mt-16 text-center text-text-light text-xs">
            @ 2023 Bulky. All rights reserved
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthStepWrapper;
