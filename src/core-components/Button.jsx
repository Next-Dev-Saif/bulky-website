"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn"; // I'll create this utility next

const Button = ({
  children,
  className,
  variant = "primary",
  size = "md",
  icon: Icon,
  isLoading,
  disabled,
  fullWidth,
  ...props
}) => {
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20",
    secondary: "bg-secondary text-white hover:bg-secondary/90 shadow-lg shadow-secondary/10",
    outline: "border-2 border-primary text-primary hover:bg-primary/5",
    ghost: "text-primary hover:bg-primary/5",
    white: "bg-white text-primary hover:bg-gray-50 shadow-md",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg font-semibold",
    pill: "px-6 py-2 rounded-full",
  };

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      disabled={disabled || isLoading}
      className={cn(
        "relative flex items-center justify-center gap-2 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden",
        fullWidth ? "w-full" : "",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
      <span className={cn("flex items-center gap-2", isLoading && "opacity-0")}>
        {children}
        {Icon && <Icon size={20} className="transition-transform group-hover:translate-x-1" />}
      </span>
    </motion.button>
  );
};

export default Button;
