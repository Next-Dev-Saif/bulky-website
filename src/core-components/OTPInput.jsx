"use client";

import React, { useState, useRef, useEffect } from "react";

const OTPInput = ({ digits = 4, onComplete }) => {
  const [otp, setOtp] = useState(new Array(digits).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.value !== "" && index < digits - 1) {
      inputRefs.current[index + 1].focus();
    }

    // Check if complete
    if (newOtp.every(val => val !== "")) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").slice(0, digits);
    const newOtp = [...otp];
    
    data.split("").forEach((char, index) => {
      if (!isNaN(char)) {
        newOtp[index] = char;
        if (inputRefs.current[index]) {
          inputRefs.current[index].value = char;
        }
      }
    });
    
    setOtp(newOtp);
    if (newOtp[digits-1] !== "") {
      inputRefs.current[digits-1].focus();
      onComplete(newOtp.join(""));
    }
  };

  return (
    <div className="flex justify-center gap-4" onPaste={handlePaste}>
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          ref={(el) => (inputRefs.current[index] = el)}
          value={data}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="w-14 h-14 md:w-16 md:h-16 text-center text-2xl font-bold border border-gray-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
        />
      ))}
    </div>
  );
};

export default OTPInput;
