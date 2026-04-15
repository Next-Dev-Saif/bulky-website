"use client";

import React, { useState } from "react";
import AuthStepWrapper from "@/components/page-sections/auth/AuthStepWrapper";
import InputField from "@/core-components/InputField";
import Button from "@/core-components/Button";
import { Mail, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ForgotPasswordFlow = () => {
  const router = useRouter();
  const { resetPassword, user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await resetPassword(email);
      setStep(2); // Success step
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/auth";
    }
  };

  if (step === 1) {
    return (
      <AuthStepWrapper
        illustration="/images/auth/forgot-step1.png"
        title="Forgot Password?"
        description="Don't worry! It happens. Please enter the email address linked with your account."
        onBack={null}
      >
        <form
          onSubmit={handleResetSubmit}
          className="space-y-8 mt-10 text-left"
        >
          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
              {error}
            </p>
          )}
          <InputField
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            variant="underline"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={Mail}
          />
          <Button
            type="submit"
            variant="primary"
            className="w-full rounded-full py-3"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      </AuthStepWrapper>
    );
  }

  if (step === 2) {
    return (
      <AuthStepWrapper
        illustration="/images/auth/forgot-step1.png"
        title="Check Your Email"
        description={`We've sent a password reset link to ${email}. Please check your inbox and follow the instructions.`}
        onBack={handleBack}
      >
        <div className="mt-10 flex flex-col items-center space-y-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center"
          >
            <CheckCircle size={40} />
          </motion.div>

          <Button
            onClick={() => {
              if (typeof window !== "undefined") {
                window.location.href = "/auth";
              }
            }}
            variant="primary"
            className="w-full rounded-full py-3"
          >
            Back to Login
          </Button>

          <button
            onClick={handleResetSubmit}
            className="text-primary font-bold hover:underline"
          >
            Didn't receive email? Resend
          </button>
        </div>
      </AuthStepWrapper>
    );
  }

  return null;
};

export default ForgotPasswordFlow;
