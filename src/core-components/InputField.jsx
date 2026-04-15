"use client";

import React from "react";

const InputField = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon: Icon,
  variant = "underline", // 'underline' or 'outlined'
  rightIcon: RightIcon,
  onRightIconClick,
  className = "",
  ...props
}) => {
  const isUnderline = variant === "underline";

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-heading mb-2">
          {label}
        </label>
      )}

      {/* Closed Border Container */}
      <label
        className={`
          flex items-center gap-2 transition-all duration-300 group cursor-text
          ${isUnderline
            ? "border-b border-gray-200 focus-within:border-primary py-2 px-0 bg-transparent"
            : "border border-gray-300 focus-within:border-primary rounded-xl py-3 px-4 bg-white shadow-sm"
          }
        `}
      >
        {/* Left Icon (Static Positioning) */}
        {Icon && !isUnderline && (
          <div className="mr-3 text-text-light group-focus-within:text-primary transition-colors flex shrink-0">
            <Icon size={20} />
          </div>
        )}

        {/* The Input (Flexible element) */}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="flex-1 h-full bg-transparent outline-none border-none placeholder:text-gray-400 text-secondary w-full"
          {...props}
        />

        {/* Right Icon Button (Static Positioning) */}
        {RightIcon && (
          <div className="ml-3 flex shrink-0">
            <button
              type="button"
              onClick={onRightIconClick}
              className="text-text-light hover:text-primary transition-colors p-1"
            >
              <RightIcon size={20} />
            </button>
          </div>
        )}
      </label>
    </div>
  );
};

export default InputField;
