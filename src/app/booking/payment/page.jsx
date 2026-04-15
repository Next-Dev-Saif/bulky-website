"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  Loader2,
  CheckCircle2,
  MapPin,
  Package,
  Calendar,
  Clock,
  Route,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import Button from "@/core-components/Button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/utils/cn";
import { db, storage } from "@/lib/firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import {
  calculateMovingCharges,
  calculateTotalJobTime,
  uniqueID,
} from "@/utils/booking-logic";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

// ─── Checkout Form Component ────────────────────────────────────────────────
function CheckoutForm({
  bookingData,
  clientSecret,
  onPaymentSuccess,
  onError,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage("");

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message);
        onError(error.message);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        onPaymentSuccess(paymentIntent);
      }
    } catch (err) {
      setErrorMessage("An unexpected error occurred. Please try again.");
      onError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
        <PaymentElement
          options={{
            layout: "tabs",
            defaultValues: {
              billingDetails: {
                name: bookingData?.userDetails?.name || "",
                email: bookingData?.userDetails?.email || "",
              },
            },
          }}
        />
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-100">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600">{errorMessage}</p>
        </div>
      )}

      <Button
        type="submit"
        fullWidth
        disabled={!stripe || isProcessing}
        className="h-14 text-base font-bold"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>Pay ${bookingData?.finalTotal?.toFixed(2)}</>
        )}
      </Button>

      <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">
        Secured by Stripe
      </p>
    </form>
  );
}

// ─── Bill Row Helper ────────────────────────────────────────────────────────
function BillRow({ label, value, sub, highlight }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between py-2.5",
        highlight && "pt-3",
      )}
    >
      <div>
        <p
          className={cn(
            "text-sm",
            highlight ? "font-black text-gray-900 text-base" : "text-gray-500",
          )}
        >
          {label}
        </p>
        {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
      </div>
      <p
        className={cn(
          "font-bold tabular-nums",
          highlight ? "text-2xl text-primary" : "text-gray-800",
        )}
      >
        {value}
      </p>
    </div>
  );
}

// ─── Main Payment Page ──────────────────────────────────────────────────────
export default function PaymentPage() {
  const router = useRouter();
  const { user, userData } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [bookingData, setBookingData] = useState(null);

  // Load booking data from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedData = localStorage.getItem("bulky_pending_booking");
    if (!storedData) {
      setError("No booking data found. Please start your booking again.");
      setIsLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(storedData);
      setBookingData(parsed);
    } catch (err) {
      setError("Invalid booking data");
      setIsLoading(false);
    }
  }, []);

  // Create payment intent when booking data is available
  useEffect(() => {
    if (!bookingData || !user) return;

    const createPaymentIntent = async () => {
      try {
        const response = await fetch("/api/booking/payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Math.round(bookingData.finalTotal * 100),
            currency: "usd",
            metadata: {
              userId: user.uid,
              userEmail: user.email,
            },
          }),
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setClientSecret(data.clientSecret);
      } catch (err) {
        setError(err.message || "Failed to initialize payment");
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [bookingData, user]);

  // Handle successful payment and create booking
  const handlePaymentSuccess = useCallback(
    async (paymentIntent) => {
      if (!bookingData || !user) return;

      setIsSubmitting(true);
      const bookingId = uniqueID();

      try {
        // 1. Upload item images
        setLoadingMessage("Uploading your photos...");
        const uploadedItems = await Promise.all(
          bookingData.items.map(async (item) => {
            const uploadedImgs = await Promise.all(
              (item.images || []).map(async (img, idx) => {
                const name = `item_${Date.now()}_${idx}.webp`;
                const storagePath = `${user.uid}/images/${name}`;
                const storageRef = ref(storage, storagePath);
                await uploadString(storageRef, img.data_url, "data_url");
                return await getDownloadURL(storageRef);
              }),
            );
            return { ...item, images: uploadedImgs };
          }),
        );

        // 2. Upload receipt if present
        let receiptUrl = null;
        if (bookingData.receiptImage?.data_url) {
          setLoadingMessage("Uploading receipt...");
          const storagePath = `${user.uid}/receipts/receipt_${Date.now()}.webp`;
          const storageRef = ref(storage, storagePath);
          await uploadString(
            storageRef,
            bookingData.receiptImage.data_url,
            "data_url",
          );
          receiptUrl = await getDownloadURL(storageRef);
        }

        // 3. Prepare validated items - match mobile app schema
        const validatedItems = uploadedItems.map((item) => ({
          id: item.id || Math.random().toString(36).substr(2, 9),
          title: item.title || "Item",
          type: item.type || "general",
          qty: Number(item.qty) || 1,
          ...(item.weight ? { weight: Number(item.weight) } : {}),
          images: item.images || [],
          size: item.size || "",
          moreInfo: item.moreInfo || "",
          isOversized: item.isOversized || "",
        }));

        // 4. Save booking to Firestore - aligned with existing schema
        setLoadingMessage("Finalizing your booking...");
        const bookingPayload = {
          id: bookingId,
          pickupdetails: {
            cords: {
              latitude: bookingData.pickup?.lat || null,
              longitude: bookingData.pickup?.lng || null,
              name: bookingData.pickup?.address || "",
            },
            pickupaddress: bookingData.pickup?.address || "",
            floors: bookingData.pickup?.floors || 0,
            elevator: bookingData.pickup?.elevator || false,
          },
          destinationdetails: {
            cords: {
              latitude: bookingData.dropoff?.lat || null,
              longitude: bookingData.dropoff?.lng || null,
              name: bookingData.dropoff?.address || "",
            },
            destination: bookingData.dropoff?.address || "",
            floors: bookingData.dropoff?.floors || 0,
            elevator: bookingData.dropoff?.elevator || false,
          },
          deliverydetails: {
            helperscount:
              Number(bookingData.deliverydetails?.helperscount) || 0,
            helperprice: 50,
            receiptImage: receiptUrl,
            baseFee: bookingData.charges?.baseFee || 0,
            mileageFee: bookingData.charges?.mileageFee || 0,
            fuelSurcharge: bookingData.charges?.fuelSurcharge || 0,
            laborFee: bookingData.charges?.laborFee || 0,
            serviceMarkup: bookingData.charges?.serviceMarkup || 0,
            salesTax: bookingData.charges?.salesTax || 0,
            totalcharges: bookingData.charges?.grandTotal || 0,
          },
          date: bookingData.date,
          time: bookingData.time,
          status: "pending",
          userid: user.uid,
          helpers: [],
          ...(bookingData.totalWeight != null &&
          Number(bookingData.totalWeight) >= 0
            ? { totalWeight: Number(bookingData.totalWeight) }
            : {}),
          createdAt: Date.parse(new Date()),
          updatedAt: Date.parse(new Date()),
          selectedService: bookingData.selectedService || null,
          stripePaymentIntentId: paymentIntent.id,
          stripeCustomerId: paymentIntent.customer ?? null,
          paymentAmountCents: Math.round(bookingData.finalTotal * 100),
          tipPercentage:
            bookingData.tipPercentage > 0 ? bookingData.tipPercentage : null,
          tipAmount: bookingData.tipAmount > 0 ? bookingData.tipAmount : null,
          items: validatedItems,
        };

        await setDoc(doc(db, "bookings", bookingId), bookingPayload);

        // Clear pending booking from localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("bulky_pending_booking");
        }

        setIsDone(true);
        setTimeout(() => {
          router.push(`/dashboard?newBooking=${bookingId}`);
        }, 1500);
      } catch (err) {
        console.error("Booking creation error:", err);
        setError(
          "Payment successful but failed to create booking. Please contact support.",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [bookingData, user, userData, router],
  );

  // Redirect if not authenticated
  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/auth?goTo=/booking/payment");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-gray-600 font-medium">Initializing payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Payment Error
          </h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Button onClick={() => router.back()} fullWidth>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (isDone) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-green-500 animate-bounce" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">
            Booking Confirmed!
          </h2>
          <p className="text-gray-500">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" />
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-7 h-7 text-primary animate-spin" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900">
              Finalising Your Booking
            </h2>
            <p className="text-sm text-gray-500 mt-1">{loadingMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  const charges = bookingData?.charges;
  const estimatedMinutes = calculateTotalJobTime(
    bookingData?.duration,
    bookingData?.items?.length,
  );

  return (
    <main className="min-h-screen bg-gray-50 md:pt-[150px] pt-[100px] px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-gray-900">
            Complete Your Payment
          </h1>
          <p className="text-gray-500 mt-1">
            Review your booking details and pay securely
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Booking Summary */}
          <div className="space-y-6">
            {/* Route Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Route size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Trip Overview</h3>
                  <p className="text-xs text-gray-400">
                    {bookingData?.distance?.toFixed(1)} mi •{" "}
                    {Math.round(bookingData?.duration || 0)} min
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <MapPin size={14} className="text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-400 uppercase">
                      Pickup
                    </p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {bookingData?.pickup?.address}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                    <MapPin size={14} className="text-red-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-400 uppercase">
                      Drop-off
                    </p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {bookingData?.dropoff?.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Schedule</h3>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">Date</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {bookingData?.date}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">Time</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {bookingData?.time}
                  </p>
                </div>
              </div>
            </div>

            {/* Items Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Package size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Items</h3>
                  <p className="text-xs text-gray-400">
                    {bookingData?.items?.length} items
                  </p>
                </div>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {bookingData?.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                  >
                    <span className="text-sm text-gray-600">{item.name}</span>
                    <span className="text-sm font-medium text-gray-900">
                      x{item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Invoice Breakdown */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ShieldCheck size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Order Summary</h3>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 space-y-1">
                <BillRow
                  label="Base rate"
                  value={`$${charges?.baseRate?.toFixed(2) || "0.00"}`}
                />
                <BillRow
                  label="Mileage"
                  value={`$${charges?.mileageCharge?.toFixed(2) || "0.00"}`}
                  sub={`${bookingData?.distance?.toFixed(1)} miles @ $2.50/mi`}
                />
                <BillRow
                  label="Labor estimate"
                  value={`$${charges?.laborCharge?.toFixed(2) || "0.00"}`}
                  sub={`${Math.round(estimatedMinutes)} min @ $1.25/min`}
                />
                <BillRow
                  label="Helpers"
                  value={`$${charges?.helpersCharge?.toFixed(2) || "0.00"}`}
                  sub={`${bookingData?.deliverydetails?.helperscount || 0} helpers`}
                />
                <BillRow
                  label="Service fee"
                  value={`$${charges?.serviceCharge?.toFixed(2) || "0.00"}`}
                />
                {charges?.stairsCharge > 0 && (
                  <BillRow
                    label="Stairs charge"
                    value={`$${charges?.stairsCharge?.toFixed(2)}`}
                  />
                )}
                {bookingData?.tipAmount > 0 && (
                  <BillRow
                    label={`Tip (${bookingData?.tipPercentage}%)`}
                    value={`$${bookingData?.tipAmount?.toFixed(2)}`}
                  />
                )}
                <div className="border-t border-gray-200 mt-2 pt-3">
                  <BillRow
                    label="Total"
                    value={`$${bookingData?.finalTotal?.toFixed(2)}`}
                    highlight
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Payment Form */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ShieldCheck size={24} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Secure Payment
                  </h2>
                  <p className="text-sm text-gray-500">
                    Your payment is encrypted and secure
                  </p>
                </div>
              </div>

              {clientSecret && (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: "stripe",
                      variables: {
                        colorPrimary: "#0109C8",
                        borderRadius: "12px",
                      },
                    },
                  }}
                >
                  <CheckoutForm
                    bookingData={bookingData}
                    clientSecret={clientSecret}
                    onPaymentSuccess={handlePaymentSuccess}
                    onError={setError}
                  />
                </Elements>
              )}
            </div>

            {/* Security Note */}
            <div className="mt-4 flex items-center gap-2 justify-center text-gray-400">
              <ShieldCheck size={14} />
              <span className="text-xs">PCI-DSS Level 1 Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
