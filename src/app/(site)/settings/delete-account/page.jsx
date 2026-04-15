"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Lock, Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

export default function DeleteAccountPage() {
  const { deleteUserAccount } = useAuth();
  const [password, setPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password) {
      setError("Your current password is required.");
      return;
    }
    setError("");
    setShowConfirmation(true);
  };

  const confirmDeletion = async () => {
    setIsDeleting(true);
    try {
      await deleteUserAccount(password);
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    } catch (err) {
      if (
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential"
      ) {
        setError("Incorrect password.");
      } else if (err.code === "auth/requires-recent-login") {
        setError(
          "Please log out and log back in before deleting your account.",
        );
      } else {
        setError(err.message || "Something went wrong.");
      }
      setShowConfirmation(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-gray-50 font-poppins">
      <div className="container-custom">
        <Link
          href="/settings"
          className="inline-flex items-center gap-2 text-text-light hover:text-primary font-bold text-sm mb-6 transition-colors group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Settings
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-black text-secondary tracking-tight">
            Delete Account
          </h1>
          <p className="text-sm text-text-light mt-1 font-medium">
            This action is permanent and cannot be undone
          </p>
        </div>

        {/* Warning banner */}
        <div className="flex items-start gap-4 bg-red-50 border border-red-100 rounded-2xl p-5 mb-8">
          <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />
          <div className="text-sm text-red-700 font-medium space-y-1">
            <p className="font-bold">All of the following will be deleted:</p>
            <ul className="list-disc list-inside text-red-600/80 space-y-0.5">
              <li>All booking history</li>
              <li>Chat messages and attachments</li>
              <li>Account data and preferences</li>
            </ul>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-text-light">
                Confirm your password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                />
                <input
                  type="password"
                  placeholder="Enter your current password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl text-sm font-medium placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-200 transition-all"
                />
              </div>
              {error && (
                <p className="text-xs font-bold text-red-600">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-colors"
            >
              Continue to Delete
            </button>
          </form>
        </div>

        {/* Confirmation modal */}
        <AnimatePresence>
          {showConfirmation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl"
              >
                <h2 className="text-xl font-black text-secondary mb-2">
                  Are you absolutely sure?
                </h2>
                <p className="text-sm text-text-light font-medium mb-8">
                  This will permanently delete your account and all associated
                  data. This cannot be reversed.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={confirmDeletion}
                    disabled={isDeleting}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {isDeleting && (
                      <Loader2 size={16} className="animate-spin" />
                    )}
                    {isDeleting ? "Deleting…" : "Yes, delete my account"}
                  </button>
                  <button
                    onClick={() => setShowConfirmation(false)}
                    disabled={isDeleting}
                    className="w-full py-3 text-sm font-bold text-text-light hover:text-secondary transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
