"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/context/AuthContext";
import {
  Package,
  Calendar,
  Loader2,
  CheckCircle2,
  MapPin,
  Clock,
  X,
  AlertCircle,
  Plus,
  Truck,
  TrendingUp,
  Clock3,
} from "lucide-react";
import { cn } from "@/utils/cn";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const newBookingId = searchParams.get("newBooking");

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(!!newBookingId);
  const [activeTab, setActiveTab] = useState("today");
  const [cancelModal, setCancelModal] = useState({
    show: false,
    bookingId: null,
  });

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const isToday = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === todayStart.getTime();
  };

  const isPast = (dateStr) => {
    if (!dateStr) return true;
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    return d.getTime() < todayStart.getTime();
  };

  const isFuture = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    return d.getTime() > todayStart.getTime();
  };

  // Simplified filtering
  const todayBookings = bookings.filter(
    (b) =>
      isToday(b.date) &&
      !["completed", "cancelled", "cancel", "archive"].includes(b.status),
  );
  const upcomingBookings = bookings.filter(
    (b) =>
      isFuture(b.date) &&
      !["completed", "cancelled", "cancel", "archive"].includes(b.status),
  );
  const archiveBookings = bookings.filter(
    (b) =>
      isPast(b.date) ||
      ["completed", "cancelled", "cancel", "archive"].includes(b.status),
  );

  const currentList =
    activeTab === "today"
      ? todayBookings
      : activeTab === "upcoming"
        ? upcomingBookings
        : archiveBookings;

  async function fetchBookings() {
    if (!user?.uid) return;
    try {
      const q = query(
        collection(db, "bookings"),
        where("userid", "==", user.uid),
        orderBy("createdAt", "desc"),
      );
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ ...d.data(), id: d.id }));
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleCancel = (id) => {
    setCancelModal({ show: true, bookingId: id });
  };

  const confirmCancel = async () => {
    if (!cancelModal.bookingId) return;
    try {
      const bookingRef = doc(db, "bookings", cancelModal.bookingId);
      await updateDoc(bookingRef, { status: "cancel" });
      setCancelModal({ show: false, bookingId: null });
      fetchBookings();
    } catch (err) {
      console.error("Error cancelling booking:", err);
    }
  };

  // Calculate stats - must be before any conditional returns
  const stats = useMemo(() => {
    const completed = bookings.filter((b) => b.status === "completed").length;
    const pending = bookings.filter((b) => b.status === "pending").length;
    const totalSpent = bookings
      .filter((b) => b.status === "completed")
      .reduce((sum, b) => sum + (b.charges?.grandTotal || 0), 0);
    return { completed, pending, totalSpent, total: bookings.length };
  }, [bookings]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen container-custom  pt-24 pb-20 px-4 sm:px-6">
      <div className="mx-auto space-y-8">
        {/* Header with Create Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-heading">Dashboard</h1>
            <p className="text-text-light text-sm mt-1">
              Manage your delivery bookings
            </p>
          </div>
          <Link
            href="/booking/create"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
          >
            <Plus size={18} />
            New Booking
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-primary">
                <Package size={22} strokeWidth={2} />
              </div>
              <span className="text-sm text-text-light">Total Bookings</span>
            </div>
            <p className="text-2xl font-bold text-heading">{stats.total}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-green-500">
                <CheckCircle2 size={22} strokeWidth={2} />
              </div>
              <span className="text-sm text-text-light">Completed</span>
            </div>
            <p className="text-2xl font-bold text-heading">{stats.completed}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-amber-500">
                <Clock3 size={22} strokeWidth={2} />
              </div>
              <span className="text-sm text-text-light">Pending</span>
            </div>
            <p className="text-2xl font-bold text-heading">{stats.pending}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-blue-500">
                <TrendingUp size={22} strokeWidth={2} />
              </div>
              <span className="text-sm text-text-light">Total Spent</span>
            </div>
            <p className="text-2xl font-bold text-heading">
              ${stats.totalSpent.toFixed(0)}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-primary">
                <Truck size={28} strokeWidth={2} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-heading">
                  Need to move something?
                </h3>
                <p className="text-text-light text-sm">
                  Create a new booking in just a few steps
                </p>
              </div>
            </div>
            <Link
              href="/booking/create"
              className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Create Booking
              <Plus size={16} />
            </Link>
          </div>
        </div>

        {/* Success Alert */}
        {showSuccessModal && (
          <div className="p-4 bg-primary text-white rounded-2xl flex items-center justify-between shadow-lg shadow-primary/10">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={20} />
              <p className="text-sm font-bold">
                Booking #{newBookingId} created successfully!
              </p>
            </div>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="opacity-70 hover:opacity-100"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm max-w-sm">
          {["today", "upcoming", "archive"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-2.5 text-xs font-bold rounded-xl transition-all capitalize",
                activeTab === tab
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-gray-400 hover:text-gray-600",
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {currentList.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center shadow-sm">
              <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-900 font-bold">No {activeTab} bookings</p>
              <p className="text-gray-400 text-sm mt-1">
                Check another tab or create a new booking.
              </p>
            </div>
          ) : (
            currentList.map((b) => (
              <div
                key={b.id}
                className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <div className="flex flex-col md:flex-row gap-6 md:items-center">
                  {/* Left: Basic Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3 font-bold text-xs uppercase tracking-widest text-gray-400 mb-2">
                      <span className="text-primary font-black">
                        #{b.id?.slice(-6).toUpperCase()}
                      </span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-md",
                          b.status === "pending"
                            ? "bg-amber-50 text-amber-600"
                            : b.status === "completed"
                              ? "bg-green-50 text-green-600"
                              : "bg-blue-50 text-blue-600",
                        )}
                      >
                        {b.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                          Pickup
                        </p>
                        <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                          {b.pickupdetails?.pickupaddress ||
                            b.pickupdetails?.address}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                          Destination
                        </p>
                        <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                          {b.destinationdetails?.destination ||
                            b.destinationdetails?.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Date & Actions */}
                  <div className="md:w-48 flex flex-col md:items-end border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 space-y-4">
                    <div className="md:text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">
                        Scheduled
                      </p>
                      <p className="text-xs font-bold text-gray-700">
                        {new Date(b.date).toLocaleDateString()} at{" "}
                        {new Date(b.time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <div className="flex gap-2 w-full">
                      <button
                        onClick={() => router.push(`/booking/${b.id}`)}
                        className="flex-1 bg-gray-50 hover:bg-gray-100 py-2.5 rounded-xl text-xs font-bold text-gray-600 transition-colors"
                      >
                        Details
                      </button>
                      {(b.status === "pending" || activeTab !== "archive") && (
                        <button
                          onClick={() => handleCancel(b.id)}
                          className="bg-red-50 hover:bg-red-100 p-2.5 rounded-xl text-red-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-6 animate-modal-in">
          <div
            onClick={() => setCancelModal({ show: false, bookingId: null })}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-scale-in">
            <div className="p-8 lg:p-10 text-center">
              <div className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6 text-red-500 bg-red-50">
                <AlertCircle size={40} />
              </div>
              <h3 className="text-2xl font-bold text-heading mb-4">
                Cancel Booking
              </h3>
              <p className="text-sm text-text-light leading-relaxed mb-8">
                Are you sure you want to cancel this booking? This action cannot
                be undone.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={confirmCancel}
                  className="w-full py-4 rounded-2xl font-semibold text-sm transition-all bg-red-600 text-white shadow-lg shadow-red-200 hover:bg-red-700"
                >
                  Cancel Booking
                </button>
                <button
                  onClick={() =>
                    setCancelModal({ show: false, bookingId: null })
                  }
                  className="w-full py-4 rounded-2xl font-semibold text-sm text-text-light hover:bg-gray-50 transition-all"
                >
                  Keep Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
