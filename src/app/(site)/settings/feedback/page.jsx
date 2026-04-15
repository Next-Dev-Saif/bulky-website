"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft,
  Star,
  MessageSquare,
  Loader2,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function FeedbackPage() {
  const { user, userData } = useAuth();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      setError("Please select a rating.");
      return;
    }
    if (!message.trim()) {
      setError("Please write a message.");
      return;
    }
    setSending(true);
    setError("");
    try {
      await addDoc(collection(db, "feedbacks"), {
        userId: user?.uid || "anonymous",
        description: message.trim(),
        createdAt: serverTimestamp(),
      });
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const labels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

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
            Give Feedback
          </h1>
          <p className="text-sm text-text-light mt-1 font-medium">
            Help us improve your experience
          </p>
        </div>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center"
            >
              <CheckCircle
                size={48}
                className="text-primary mx-auto mb-4"
                strokeWidth={1.5}
              />
              <h2 className="text-xl font-black text-secondary mb-2">
                Thank you!
              </h2>
              <p className="text-sm text-text-light font-medium">
                Your feedback has been submitted successfully.
              </p>
              <button
                onClick={() => {
                  setSent(false);
                  setRating(0);
                  setMessage("");
                }}
                className="mt-8 text-xs font-bold text-primary hover:underline"
              >
                Submit another response
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <form onSubmit={handleSubmit}>
                  {/* Star rating */}
                  <div className="px-6 py-5 border-b border-gray-50">
                    <p className="text-[11px] font-black uppercase tracking-widest text-text-light/50 mb-4">
                      Rating
                    </p>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHovered(star)}
                          onMouseLeave={() => setHovered(0)}
                        >
                          <Star
                            size={32}
                            className="transition-colors"
                            fill={
                              (hovered || rating) >= star ? "#F59E0B" : "none"
                            }
                            stroke={
                              (hovered || rating) >= star
                                ? "#F59E0B"
                                : "#D1D5DB"
                            }
                          />
                        </button>
                      ))}
                      {(hovered || rating) > 0 && (
                        <span className="ml-2 text-sm font-bold text-amber-500">
                          {labels[hovered || rating]}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="px-6 py-5 border-b border-gray-50">
                    <p className="text-[11px] font-black uppercase tracking-widest text-text-light/50 mb-3">
                      Your message
                    </p>
                    <textarea
                      rows={5}
                      placeholder="Tell us what you think…"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-medium placeholder:text-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>

                  {error && (
                    <p className="px-6 py-3 text-xs font-bold text-red-600 border-b border-gray-50">
                      {error}
                    </p>
                  )}

                  <div className="px-6 py-5">
                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full py-3 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      {sending && (
                        <Loader2 size={16} className="animate-spin" />
                      )}
                      {sending ? "Sending…" : "Submit Feedback"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
