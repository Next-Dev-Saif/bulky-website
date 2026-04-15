"use client";

import React, { useState } from "react";
import InputField from "@/core-components/InputField";
import Button from "@/core-components/Button";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const goTo = searchParams.get("goTo") || "/";
  const {
    user,
    loading: authLoading,
    login,
    signInWithGoogle,
    signInWithFacebook,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && user) {
      router.push(goTo);
    }
  }, [user, authLoading, router, goTo]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      if (typeof window !== "undefined") {
        window.location.href = goTo;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithGoogle();
      if (typeof window !== "undefined") {
        window.location.href = goTo;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithFacebook();
      if (typeof window !== "undefined") {
        window.location.href = goTo;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleLogin} className="space-y-6 text-left">
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm p-3 bg-red-50 rounded-lg border border-red-100 text-center"
          >
            {error}
          </motion.p>
        )}

        <InputField
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          variant="underline"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="space-y-2">
          <InputField
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            variant="underline"
            icon={Lock}
            rightIcon={showPassword ? Eye : EyeOff}
            onRightIconClick={() => setShowPassword(!showPassword)}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              size="sm"
              className="text-primary font-semibold text-sm hover:underline"
            >
              Forget Password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full rounded-full py-3"
          disabled={loading}
        >
          {loading ? "Authenticating..." : "Sign In"}
        </Button>

        <div className="relative flex items-center justify-center py-4">
          <div className="border-t border-gray-200 w-full"></div>
          <span className="bg-white px-4 text-gray-400 text-sm absolute">
            or
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Image
              src="/icons/google.svg"
              alt="Google"
              width={20}
              height={20}
            />
            <span className="text-sm font-medium text-secondary">Google</span>
          </button>
          <button
            type="button"
            onClick={handleFacebookLogin}
            className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Image
              src="/icons/facebook.svg"
              alt="Facebook"
              width={20}
              height={20}
            />
            <span className="text-sm font-medium text-secondary">Facebook</span>
          </button>
        </div>

        <div className="text-center mt-8">
          <p className="text-text-light text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-primary font-bold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
