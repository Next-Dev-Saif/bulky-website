"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  documentId,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft,
  MapPin,
  Package,
  Clock,
  Calendar,
  User,
  Phone,
  CreditCard,
  Loader2,
  CheckCircle2,
  Truck,
  DollarSign,
  Briefcase,
  Mail,
  MessageSquare,
  Printer,
  Info,
  AlertCircle,
  FileText,
  Building2,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { uniqueID, formatChatUserData } from "@/utils/chat";

export default function BookingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, userData } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [helpersData, setHelpersData] = useState([]);
  const [loadingHelpers, setLoadingHelpers] = useState(false);
  const [driverData, setDriverData] = useState(null);
  const [loadingDriver, setLoadingDriver] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [loadingCustomer, setLoadingCustomer] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);

  // Real-time listener for booking updates
  useEffect(() => {
    if (!user?.uid || !id) return;

    const docRef = doc(db, "bookings", id);

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Security: restrict access to the owner
          if (data.userid !== user.uid) {
            setBooking(null);
          } else {
            setBooking(data);
          }
        } else {
          setBooking(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error listening to booking updates:", err);
        setLoading(false);
      },
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [id, user]);

  // Fetch detailed profiles for assigned helpers
  useEffect(() => {
    const fetchHelperProfiles = async () => {
      const helperIds = booking?.helpers || [];
      if (!helperIds.length) {
        setHelpersData([]);
        return;
      }

      setLoadingHelpers(true);
      try {
        // Extract IDs if they are objects (safeguard)
        const ids = helperIds
          .map((h) => (typeof h === "string" ? h : h.id))
          .filter(Boolean);

        if (ids.length > 0) {
          const q = query(
            collection(db, "users"),
            where(documentId(), "in", ids),
          );
          const querySnapshot = await getDocs(q);
          const profiles = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setHelpersData(profiles);
        }
      } catch (err) {
        console.error("Error fetching helper profiles:", err);
      } finally {
        setLoadingHelpers(false);
      }
    };

    if (booking?.helpers) {
      fetchHelperProfiles();
    }
  }, [booking?.helpers]);

  // Fetch driver profile when driverId is available
  useEffect(() => {
    const fetchDriverProfile = async () => {
      const driverId = booking?.driverId;
      if (!driverId) {
        setDriverData(null);
        return;
      }

      setLoadingDriver(true);
      try {
        const driverDoc = await getDoc(doc(db, "users", driverId));
        if (driverDoc.exists()) {
          setDriverData({
            id: driverDoc.id,
            ...driverDoc.data(),
          });
        } else {
          setDriverData(null);
        }
      } catch (err) {
        console.error("Error fetching driver profile:", err);
        setDriverData(null);
      } finally {
        setLoadingDriver(false);
      }
    };

    if (booking?.driverId) {
      fetchDriverProfile();
    }
  }, [booking?.driverId]);

  // Fetch customer profile using userid from booking
  useEffect(() => {
    const fetchCustomerProfile = async () => {
      const customerId = booking?.userid;
      if (!customerId) {
        setCustomerData(null);
        return;
      }

      setLoadingCustomer(true);
      try {
        const customerDoc = await getDoc(doc(db, "users", customerId));
        if (customerDoc.exists()) {
          setCustomerData({
            id: customerDoc.id,
            ...customerDoc.data(),
          });
        } else {
          setCustomerData(null);
        }
      } catch (err) {
        console.error("Error fetching customer profile:", err);
        setCustomerData(null);
      } finally {
        setLoadingCustomer(false);
      }
    };

    if (booking?.userid) {
      fetchCustomerProfile();
    }
  }, [booking?.userid]);

  const handlePrintInvoice = () => {
    setShowInvoice(true);
    setTimeout(() => {
      if (typeof window !== "undefined") {
        window.print();
      }
      setShowInvoice(false);
    }, 100);
  };

  const handleCancelBooking = async () => {
    if (
      typeof window !== "undefined" &&
      !window.confirm("Are you sure you want to cancel this booking?")
    )
      return;
    setIsCancelling(true);
    try {
      const docRef = doc(db, "bookings", id);
      await updateDoc(docRef, { status: "cancel", updatedAt: Date.now() });
      setBooking((prev) => ({ ...prev, status: "cancel" }));
    } catch (err) {
      alert("Failed to cancel booking. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleInitiateChat = async (helper) => {
    if (!user) {
      alert("Please login to chat with helpers");
      return;
    }

    try {
      // Find existing chat by keys parity
      const chatsRef = collection(db, "chats");
      const q = query(chatsRef, where("keys", "array-contains", user.uid));
      const querySnapshot = await getDocs(q);

      let existingChat = querySnapshot.docs.find((doc) => {
        const data = doc.data();
        return data.keys && data.keys.includes(helper.id);
      });

      let chatId;
      const senderData = formatChatUserData(userData, user.uid);
      const receiverData = formatChatUserData(helper, helper.id);

      if (existingChat) {
        chatId = existingChat.id;
        // Optionally update users data to keep it fresh
        await updateDoc(doc(db, "chats", chatId), {
          users: [receiverData, senderData],
          updatedAt: Date.now(),
        });
      } else {
        // Create new unique chat ID
        chatId = uniqueID();
        const chatRef = doc(db, "chats", chatId);

        await setDoc(chatRef, {
          id: chatId,
          keys: [user.uid, helper.id],
          users: [receiverData, senderData],
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }

      // Add to friends list if not already there
      const userRef = doc(db, "users", user.uid);
      const helperRef = doc(db, "users", helper.id);

      const updateFriends = async (uRef, friendId) => {
        const uDoc = await getDoc(uRef);
        if (uDoc.exists()) {
          const currentData = uDoc.data();
          const friendsList = currentData.friends || [];
          if (!friendsList.includes(friendId)) {
            await updateDoc(uRef, { friends: [...friendsList, friendId] });
          }
        }
      };

      await Promise.all([
        updateFriends(userRef, helper.id),
        updateFriends(helperRef, user.uid),
      ]);

      router.push(`/dashboard/chat?id=${chatId}`);
    } catch (error) {
      console.error("Error initiating chat:", error);
      alert("Failed to start chat. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-sm font-semibold text-gray-500">
          Loading booking details...
        </p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 px-6">
        <div className="max-w-md mx-auto bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Booking Not Found
          </h2>
          <p className="text-gray-500 mt-3">
            We couldn&apos;t find the booking you&apos;re looking for or you
            don&apos;t have permission to view it.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-8 w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const {
    pickupdetails = {},
    destinationdetails = {},
    items = [],
    deliverydetails = {},
    status,
    driverId,
    userName,
    userEmail,
    selectedService,
    totalWeight,
    createdAt,
    date,
    time,
    paymentAmountCents,
    totalPaid,
    tipAmount,
    tipPercentage,
    helpers = [],
  } = booking;

  // Fallbacks for schema parity - use fetched customerData or fallbacks
  const displayUserName =
    customerData?.firstName || userName || "Valued Customer";
  const displayUserPhone = customerData?.phone || "N/A";
  const displayUserEmail = customerData?.email || userEmail || "N/A";
  const displayUserPhoto = customerData?.photo || "";
  const displayTotalPaid = paymentAmountCents
    ? paymentAmountCents / 100
    : totalPaid || deliverydetails.totalcharges + (tipAmount || 0);

  // Calculate derived display status based on driverId and helpers
  const helpersNeeded = deliverydetails?.helperscount || 0;
  const helpersCount = helpers?.length || 0;
  const hasDriver = !!driverId;
  const helpersFulfilled = helpersNeeded === 0 || helpersCount >= helpersNeeded;

  let displayStatus = status;
  if (status === "cancel" || status === "cancelled") {
    displayStatus = "Cancelled";
  } else if (status === "completed") {
    displayStatus = "Completed";
  } else if (!hasDriver || !helpersFulfilled) {
    displayStatus = "Pending";
  } else if (hasDriver && helpersFulfilled) {
    displayStatus = "In Progress";
  }

  // Status progression mapping based on derived status
  const workflow = ["Pending", "In Progress", "Completed"];
  const activeIndex = workflow.indexOf(displayStatus);

  return (
    <>
      <main className="min-h-screen bg-gray-50/50 pt-24 pb-20 px-4 md:px-8 print:hidden">
        <div className="container-custom mx-auto">
          {/* Top Navbar: Navigation & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
            <div className="space-y-1">
              <button
                onClick={() => router.back()}
                className="group flex items-center gap-2 text-gray-400 hover:text-gray-900 text-sm font-semibold mb-2 transition-colors"
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                  Booking Info
                </h1>
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                    displayStatus === "Pending"
                      ? "bg-amber-50 text-amber-600 border-amber-100"
                      : displayStatus === "Completed"
                        ? "bg-green-50 text-green-600 border-green-100"
                        : displayStatus === "Cancelled"
                          ? "bg-red-50 text-red-600 border-red-100"
                          : "bg-blue-50 text-blue-600 border-blue-100",
                  )}
                >
                  {displayStatus}
                </span>
              </div>
              <p className="text-xs font-medium text-gray-400">
                Order ID: #{id.slice(0, 8).toUpperCase()}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrintInvoice}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm shadow-sm hover:bg-gray-50 transition-all"
              >
                <Printer size={16} />
                Print Invoice
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Content Area */}
            <div className="lg:col-span-8 space-y-8">
              {/* 1. Status Progress Tracker */}
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Truck size={18} />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                    Booking Status
                  </h2>
                </div>

                <div className="relative px-2">
                  <div className="absolute top-[18px] left-0 right-0 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(0, activeIndex) * 33.3}%` }}
                      className="h-full bg-primary"
                    />
                  </div>

                  <div className="flex justify-between relative">
                    {workflow.map((item, idx) => (
                      <div
                        key={item}
                        className="flex flex-col items-center gap-3"
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors",
                            idx <= activeIndex
                              ? "bg-primary text-white"
                              : "bg-gray-100 text-gray-400",
                          )}
                        >
                          {idx < activeIndex ? (
                            <CheckCircle2 size={18} />
                          ) : idx === activeIndex ? (
                            <Clock size={16} />
                          ) : (
                            <span className="text-xs font-bold">{idx + 1}</span>
                          )}
                        </div>
                        <span
                          className={cn(
                            "text-[10px] font-bold uppercase tracking-widest",
                            idx <= activeIndex
                              ? "text-gray-900"
                              : "text-gray-400",
                          )}
                        >
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cancellation Reason Display */}
                {(status === "cancel" || status === "cancelled") && (
                  <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-100">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-500 flex-shrink-0">
                        <AlertCircle size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-red-700">
                          Booking Cancelled
                        </p>
                        {booking?.cancellationReason && (
                          <p className="text-xs text-red-600 mt-1">
                            Reason: {booking.cancellationReason}
                          </p>
                        )}
                        {booking?.cancelledBy && (
                          <p className="text-[10px] text-red-500 mt-1 uppercase tracking-wider">
                            Cancelled by:{" "}
                            {booking.cancelledBy === user?.uid
                              ? "You"
                              : "Driver/Helper"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Pickup & Destination Details */}
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                    <MapPin size={18} />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                    Trip Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
                  {/* Visual Connector Line */}
                  <div className="hidden md:block absolute left-1/2 top-10 bottom-10 w-px bg-gray-100 -translate-x-1/2" />

                  {/* Pickup Side */}
                  <div className="space-y-6">
                    <div>
                      <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-md uppercase tracking-wider mb-2">
                        Pick-up From
                      </span>
                      <p className="text-base font-bold text-gray-800 leading-tight mb-2">
                        {pickupdetails.address || pickupdetails.pickupaddress}
                      </p>
                      <div className="flex items-center gap-3 text-gray-400 text-xs">
                        <span className="flex items-center gap-1">
                          <Info size={12} /> Floor{" "}
                          {pickupdetails.floor || pickupdetails.floors || 0}
                        </span>
                        {pickupdetails.receivername && (
                          <span className="flex items-center gap-1">
                            • Contact: {pickupdetails.receivername}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Destination Side */}
                  <div className="space-y-6 md:pl-6">
                    <div>
                      <span className="inline-block px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold rounded-md uppercase tracking-wider mb-2">
                        Deliver To
                      </span>
                      <p className="text-base font-bold text-gray-800 leading-tight mb-2">
                        {destinationdetails.address ||
                          destinationdetails.destination}
                      </p>
                      <div className="flex items-center gap-3 text-gray-400 text-xs">
                        <span className="flex items-center gap-1">
                          <Info size={12} /> Floor{" "}
                          {destinationdetails.floor ||
                            destinationdetails.floors ||
                            0}
                        </span>
                        {destinationdetails.receivername && (
                          <span className="flex items-center gap-1">
                            • Contact: {destinationdetails.receivername}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-50 flex flex-wrap gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Scheduled For
                    </p>
                    <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      {date ? new Date(date).toLocaleDateString() : "Pending"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Time Slot
                    </p>
                    <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <Clock size={14} className="text-gray-400" />
                      {time
                        ? new Date(time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                        : "Pending"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Service Level
                    </p>
                    <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <Briefcase size={14} className="text-primary" />
                      {selectedService || "Standard"}
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. Items Manifest (Inventory) */}
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package size={18} className="text-primary" />
                    <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                      Items Manifest
                    </h2>
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {items.length} Items Total
                  </span>
                </div>

                <div className="divide-y divide-gray-50">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-8 flex flex-col sm:flex-row gap-6 hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="w-24 h-24 rounded-xl border border-gray-200 bg-gray-50 flex-shrink-0 overflow-hidden">
                        {item.images && item.images[0] ? (
                          <Image
                            src={item.images[0]}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Package size={32} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 leading-tight">
                              {item.title || "Package"}
                            </h3>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-0.5">
                              {item.type ||
                                item.selectedItem?.title ||
                                item.selectedType?.title ||
                                "Equipment"}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                Quantity
                              </p>
                              <p className="text-base font-black text-gray-900">
                                {item.qty ||
                                  item.count ||
                                  item.numberOfboxes ||
                                  1}
                              </p>
                            </div>
                            {item.weight && (
                              <div className="text-right pl-4 border-l border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                  Est. Weight
                                </p>
                                <p className="text-base font-black text-gray-900">
                                  {item.weight} lbs
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-1">
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-gray-600">
                            <span className="text-[10px] font-bold uppercase">
                              Size:
                            </span>
                            <span className="text-xs font-bold">
                              {item.size ||
                                item.selectedBoatSize ||
                                item.selectedTVSize ||
                                "Standard"}
                            </span>
                          </div>
                          {item.isOversized && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-lg text-amber-700">
                              <AlertCircle size={12} />
                              <span className="text-[10px] font-bold uppercase">
                                Oversized
                              </span>
                            </div>
                          )}
                        </div>

                        {(item.moreInfo || item.selectedOption) && (
                          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-xs text-gray-500 italic">
                              &quot;
                              {Array.isArray(
                                item.moreInfo || item.selectedOption,
                              )
                                ? (item.moreInfo || item.selectedOption).join(
                                  ", ",
                                )
                                : item.moreInfo || item.selectedOption}
                              &quot;
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Receipts & Documentation */}
              {deliverydetails.receiptImage && (
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <FileText size={18} className="text-primary" />
                    <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                      Documentation
                    </h2>
                  </div>
                  <div className="group relative max-w-sm rounded-xl overflow-hidden border border-gray-200">
                    <Image
                      src={deliverydetails.receiptImage}
                      alt="Booking Receipt"
                      width={400}
                      height={300}
                      className="w-full h-auto cursor-zoom-in hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg border border-white/20 shadow-lg">
                      <p className="text-[10px] font-bold text-gray-900 uppercase">
                        Receipt Proof
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar: Billing & Team */}
            <div className="lg:col-span-4 space-y-8">
              {/* 5. Booking Finances */}
              <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-10 border-b border-gray-50 pb-6">
                    <div className="flex items-center gap-2">
                      <DollarSign size={18} className="text-primary" />
                      <h3 className="text-base font-bold text-gray-900 tracking-tight">
                        Payment Details
                      </h3>
                    </div>
                    <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase rounded-full border border-green-100 tracking-wider">
                      Settled
                    </span>
                  </div>

                  <div className="space-y-5 mb-10">
                    <div className="flex justify-between items-center text-sm font-semibold">
                      <span className="text-gray-500">Base Service Fee</span>
                      <span className="text-gray-900">
                        ${deliverydetails.baseFee?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-semibold">
                      <span className="text-gray-500">Distance Charge</span>
                      <span className="text-gray-900">
                        ${deliverydetails.mileageFee?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-semibold">
                      <span className="text-gray-500">Fuel Surcharge</span>
                      <span className="text-gray-900">
                        ${deliverydetails.fuelSurcharge?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                    {deliverydetails.laborFee > 0 && (
                      <div className="flex justify-between items-center text-sm font-semibold">
                        <span className="text-gray-500 px-2 py-0.5 bg-gray-50 rounded border border-gray-100">
                          Helper Labor
                        </span>
                        <span className="text-gray-900">
                          ${deliverydetails.laborFee?.toFixed(2)}
                        </span>
                      </div>
                    )}
                    {deliverydetails.serviceMarkup > 0 && (
                      <div className="flex justify-between items-center text-sm font-semibold text-primary">
                        <span>Service Tier Markup</span>
                        <span>
                          +${deliverydetails.serviceMarkup?.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="h-px bg-gray-100" />
                    <div className="flex justify-between items-center text-xs font-medium text-gray-400">
                      <span>Sales Tax (8.25%)</span>
                      <span className="text-gray-900">
                        ${deliverydetails.salesTax?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                    {tipAmount > 0 && (
                      <div className="flex justify-between items-center text-sm font-bold text-primary">
                        <span>Gratuity ({tipPercentage}%)</span>
                        <span>+${tipAmount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-8 border-t border-gray-100 flex flex-col gap-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Total Paid
                    </p>
                    <p className="text-5xl font-black text-gray-900 italic tracking-tighter">
                      ${displayTotalPaid.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* 5.5 Customer Information */}
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <User size={18} className="text-primary" />
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                    Customer Info
                  </h3>
                </div>

                {loadingCustomer ? (
                  <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100 mb-4 animate-pulse">
                    <div className="w-12 h-12 rounded-full bg-gray-200" />
                    <div className="space-y-2 flex-1">
                      <div className="h-3 w-24 bg-gray-200 rounded" />
                      <div className="h-2 w-32 bg-gray-100 rounded" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center border-2 border-white shadow-sm">
                      {displayUserPhoto ? (
                        <img
                          src={displayUserPhoto}
                          alt={displayUserName}


                          className="object-cover"
                        />
                      ) : (
                        <span className="text-lg font-black text-primary">
                          {displayUserName?.[0]?.toUpperCase() || "C"}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-gray-900 truncate">
                        {displayUserName}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Verified Customer
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400">
                      <Phone size={14} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter leading-none">
                        Phone
                      </p>
                      <p className="font-bold text-gray-900 leading-tight">
                        {displayUserPhone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400">
                      <Mail size={14} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter leading-none">
                        Email Address
                      </p>
                      <p className="font-bold text-gray-900 leading-tight truncate">
                        {displayUserEmail}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. Driver Assigned */}
              {booking?.driverId && (
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-8">
                    <Truck size={18} className="text-primary" />
                    <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                      Assigned Driver
                    </h3>
                  </div>

                  {loadingDriver ? (
                    <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100 animate-pulse">
                      <div className="w-11 h-11 rounded-full bg-gray-200" />
                      <div className="space-y-2 flex-1">
                        <div className="h-3 w-24 bg-gray-200 rounded" />
                        <div className="h-2 w-32 bg-gray-100 rounded" />
                      </div>
                    </div>
                  ) : driverData ? (
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                      {driverData.photo ? (
                        <div className="relative w-11 h-11">
                          <Image
                            src={driverData.photo}
                            alt={driverData.firstName}
                            fill
                            className="rounded-full object-cover border-2 border-white shadow-sm"
                          />
                          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm" />
                        </div>
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm">
                          {driverData.firstName?.[0]?.toUpperCase() || "D"}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate leading-snug">
                          {driverData.firstName} {driverData.lastName || ""}
                        </p>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-wider truncate mb-0.5">
                          Assigned Driver
                        </p>
                        <p className="text-[10px] font-medium text-gray-400 truncate tracking-tight">
                          {driverData.email}
                        </p>
                      </div>
                      {driverData.phone && (
                        <a
                          href={`tel:${driverData.phone}`}
                          className="p-2.5 bg-white border border-gray-100 rounded-xl text-primary hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                          title="Call driver"
                        >
                          <Phone size={16} />
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="py-6 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                      <Truck size={32} className="text-gray-300 mx-auto mb-3" />
                      <p className="text-sm font-bold text-gray-500">
                        Driver information unavailable
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* 7. Helpers Assigned */}
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-8">
                  <User size={18} className="text-secondary" />
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                    Assigned Team
                  </h3>
                </div>

                {loadingHelpers ? (
                  <div className="space-y-4">
                    {[1, 2]
                      .slice(0, booking.deliverydetails?.helperscount || 1)
                      .map((i) => (
                        <div
                          key={i}
                          className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100 animate-pulse"
                        >
                          <div className="w-10 h-10 rounded-full bg-gray-200" />
                          <div className="space-y-2 flex-1">
                            <div className="h-3 w-24 bg-gray-200 rounded" />
                            <div className="h-2 w-32 bg-gray-100 rounded" />
                          </div>
                        </div>
                      ))}
                  </div>
                ) : helpersData.length > 0 ? (
                  <div className="space-y-4">
                    {helpersData.map((helper) => (
                      <div
                        key={helper.id}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 transition-all hover:bg-gray-100/50"
                      >
                        {helper.photo ? (
                          <div className="relative w-11 h-11">
                            <Image
                              src={helper.photo}
                              alt={helper.firstName}
                              fill
                              className="rounded-full object-cover border-2 border-white shadow-sm"
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm" />
                          </div>
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm">
                            {helper.firstName?.[0]?.toUpperCase() || "H"}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate leading-snug">
                            {helper.firstName} {helper.lastName || ""}
                          </p>
                          <p className="text-[10px] font-bold text-primary uppercase tracking-wider truncate mb-0.5">
                            Assigned Helper
                          </p>
                          <p className="text-[10px] font-medium text-gray-400 truncate tracking-tight">
                            {helper.email}
                          </p>
                        </div>
                        <button
                          onClick={() => handleInitiateChat(helper)}
                          className="p-2.5 bg-white border border-gray-100 rounded-xl text-primary hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm group/btn"
                          title="Chat with helper"
                        >
                          <MessageSquare
                            size={16}
                            className="group-hover/btn:scale-110 transition-transform"
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : helpers && helpers.length > 0 ? (
                  <div className="space-y-4">
                    {helpers.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100"
                      >
                        <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold">
                          {typeof h === "string"
                            ? h[0]?.toUpperCase()
                            : h.name?.[0].toUpperCase() || "H"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {typeof h === "string"
                              ? `Helper ID: ${h.slice(0, 6)}`
                              : h.name || "Assigned Helper"}
                          </p>
                          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                            Logistics Specialist
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                    <User size={32} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-bold text-gray-500">
                      Team Allocation Pending
                    </p>
                    <p className="text-[10px] text-gray-400 px-4 mt-1">
                      We&apos;ll update this as soon as a team is assigned to
                      your slot.
                    </p>
                  </div>
                )}
              </div>

              {/* 7. Manage Booking */}
              {status === "pending" && (
                <div className="pt-4">
                  <button
                    onClick={handleCancelBooking}
                    disabled={isCancelling}
                    className="w-full group flex items-center justify-center gap-2 py-4 bg-white border border-red-200 text-red-500 font-bold rounded-xl text-sm transition-all hover:bg-red-50 hover:border-red-300 shadow-sm disabled:opacity-50"
                  >
                    {isCancelling ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <AlertCircle size={16} />
                    )}
                    Cancel Booking
                  </button>
                  <p className="mt-4 px-6 text-[10px] text-gray-400 text-center leading-relaxed">
                    Looking for more help? Visit our Help Center or contact
                    support via the dashboard.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Print Invoice - Only visible when printing */}
      {showInvoice && (
        <div
          className="fixed inset-0 z-[9999] bg-white print:block hidden"
          style={{ pageBreakAfter: "avoid" }}
        >
          {/* Invoice Container - Single Page Optimized */}
          <div
            className="h-screen p-6 max-w-[210mm] mx-auto flex flex-col"
            style={{ width: "210mm", minHeight: "297mm" }}
          >
            {/* Header with Branding */}
            <div className="border-b-2 border-gray-900 pb-4 mb-4 flex-shrink-0">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-gray-900 tracking-tight">
                      BULKY
                    </h1>
                    <p className="text-[10px] text-gray-500 font-medium">
                      Professional Delivery Services
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-lg font-black text-gray-900">INVOICE</h2>
                  <p className="text-xs text-gray-500">
                    #{id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Company & Customer Info - Compact */}
            <div className="grid grid-cols-2 gap-6 mb-4 flex-shrink-0">
              <div>
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  From
                </h3>
                <div className="space-y-0.5">
                  <p className="font-bold text-sm text-gray-900">
                    Bulky Delivery Inc.
                  </p>
                  <p className="text-xs text-gray-600">
                    123 Logistics Way, New York, NY 10001
                  </p>
                  <p className="text-xs text-gray-600">
                    support@bulky.com | (555) 123-4567
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Bill To
                </h3>
                <div className="space-y-0.5">
                  <p className="font-bold text-sm text-gray-900">
                    {displayUserName}
                  </p>
                  <p className="text-xs text-gray-600">{displayUserEmail}</p>
                  <p className="text-xs text-gray-600">{displayUserPhone}</p>
                </div>
              </div>
            </div>

            {/* Booking Details - Compact Grid */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4 flex-shrink-0">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Booking Details
              </h3>
              <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-xs">
                <div>
                  <p className="text-[10px] text-gray-500">Pickup</p>
                  <p className="font-semibold text-gray-900 truncate">
                    {pickupdetails.address || pickupdetails.pickupaddress}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Floor {pickupdetails.floor || pickupdetails.floors || 0}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500">Destination</p>
                  <p className="font-semibold text-gray-900 truncate">
                    {destinationdetails.address ||
                      destinationdetails.destination}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Floor{" "}
                    {destinationdetails.floor || destinationdetails.floors || 0}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500">Date & Time</p>
                  <p className="font-semibold text-gray-900">
                    {date ? new Date(date).toLocaleDateString() : "N/A"}
                  </p>
                  <p className="font-semibold text-gray-900">
                    {time
                      ? new Date(time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500">Service</p>
                  <p className="font-semibold text-gray-900">
                    {selectedService || "Standard"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500">Status</p>
                  <p className="font-semibold text-gray-900 capitalize">
                    {status}
                  </p>
                </div>
              </div>
            </div>

            {/* Items Table - Compact */}
            <div className="mb-4 flex-shrink-0">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Items
              </h3>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-1.5 text-[10px] font-bold text-gray-500 uppercase">
                      Item
                    </th>
                    <th className="text-center py-1.5 text-[10px] font-bold text-gray-500 uppercase w-24">
                      Type
                    </th>
                    <th className="text-center py-1.5 text-[10px] font-bold text-gray-500 uppercase w-12">
                      Qty
                    </th>
                    <th className="text-center py-1.5 text-[10px] font-bold text-gray-500 uppercase w-20">
                      Size
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.slice(0, 5).map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="py-1.5 font-semibold text-gray-900 truncate max-w-[200px]">
                        {item.title || "Package"}
                      </td>
                      <td className="py-1.5 text-gray-600 text-center">
                        {item.type || item.selectedItem?.title || "Equipment"}
                      </td>
                      <td className="py-1.5 text-gray-600 text-center">
                        {item.qty || item.count || item.numberOfboxes || 1}
                      </td>
                      <td className="py-1.5 text-gray-600 text-center">
                        {item.size ||
                          item.selectedBoatSize ||
                          item.selectedTVSize ||
                          "Standard"}
                      </td>
                    </tr>
                  ))}
                  {items.length > 5 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-1.5 text-[10px] text-gray-400 text-center italic"
                      >
                        + {items.length - 5} more items
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Payment Summary - Compact Right Aligned */}
            <div className="border-t-2 border-gray-900 pt-3 mt-auto flex-shrink-0">
              <div className="flex justify-end">
                <div className="w-64">
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base Service</span>
                      <span className="font-semibold text-gray-900">
                        ${deliverydetails.baseFee?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Distance</span>
                      <span className="font-semibold text-gray-900">
                        ${deliverydetails.mileageFee?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fuel</span>
                      <span className="font-semibold text-gray-900">
                        ${deliverydetails.fuelSurcharge?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                    {deliverydetails.laborFee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Labor</span>
                        <span className="font-semibold text-gray-900">
                          ${deliverydetails.laborFee?.toFixed(2)}
                        </span>
                      </div>
                    )}
                    {deliverydetails.serviceMarkup > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Markup</span>
                        <span className="font-semibold text-gray-900">
                          +${deliverydetails.serviceMarkup?.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (8.25%)</span>
                      <span className="font-semibold text-gray-900">
                        ${deliverydetails.salesTax?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                    {tipAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Tip ({tipPercentage}%)
                        </span>
                        <span className="font-semibold text-gray-900">
                          +${tipAmount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-base font-black text-gray-900">
                          Total
                        </span>
                        <span className="text-base font-black text-gray-900">
                          ${displayTotalPaid.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Compact */}
            <div className="mt-4 pt-3 border-t border-gray-200 flex-shrink-0">
              <div className="flex justify-between items-center text-[10px] text-gray-500">
                <p>Thank you for choosing Bulky! | support@bulky.com</p>
                <p>www.bulky.com</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
