"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  MapPin,
  Package,
  Calculator,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Heart,
  Route,
  Clock,
  Calendar,
  Users,
  Layers,
} from "lucide-react";
import Button from "@/core-components/Button";
import {
  calculateMovingCharges,
  calculateTotalJobTime,
} from "@/utils/booking-logic";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/utils/cn";

// ─── Small row helper ─────────────────────────────────────────────────────────
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

// ─── Main Summary Step ────────────────────────────────────────────────────────
export default function SummaryStep({
  data,
  charges: initialCharges,
  distance,
  duration,
  onNext,
  onBack,
}) {
  const router = useRouter();
  const { user, userData } = useAuth();

  // Tip state — matches mobile: presets + "No tip" + custom input
  const TIP_OPTIONS = [5, 10, 15, 20];
  const [selectedTipPercent, setSelectedTipPercent] = useState(null);
  const [customTipText, setCustomTipText] = useState("");
  const effectiveTipPercent =
    selectedTipPercent != null
      ? selectedTipPercent
      : parseFloat(customTipText) || 0;

  const charges = useMemo(
    () =>
      initialCharges ||
      calculateMovingCharges(
        data.itemdetails,
        distance,
        data.selectedService,
        data.deliverydetails?.helperscount,
      ),
    [data, distance, initialCharges],
  );

  const tipAmount =
    Math.round(charges.grandTotal * (effectiveTipPercent / 100) * 100) / 100;
  const finalTotal = charges.grandTotal + tipAmount;

  // Estimated job time
  const estimatedMinutes = calculateTotalJobTime(
    duration,
    data.itemdetails?.length,
  );

  const selectTip = (pct) => {
    setSelectedTipPercent(selectedTipPercent === pct ? null : pct);
    setCustomTipText("");
  };

  // ─── Navigate to payment page ────────────────────────────────────────────────
  const handleProceedToPayment = () => {
    // Prepare booking data to pass to payment page
    const bookingData = {
      pickup: {
        address: data.pickupdetails?.address,
        lat:
          data.pickupdetails?.cords?.lat || data.pickupdetails?.cords?.latitude,
        lng:
          data.pickupdetails?.cords?.lng ||
          data.pickupdetails?.cords?.longitude,
        floors: data.pickupdetails?.floors || 0,
        elevator: data.pickupdetails?.elevator || false,
      },
      dropoff: {
        address: data.destinationdetails?.address,
        lat:
          data.destinationdetails?.cords?.lat ||
          data.destinationdetails?.cords?.latitude,
        lng:
          data.destinationdetails?.cords?.lng ||
          data.destinationdetails?.cords?.longitude,
        floors: data.destinationdetails?.floors || 0,
        elevator: data.destinationdetails?.elevator || false,
      },
      items: data.itemdetails?.map((item) => ({
        id: item.id,
        title: item.selectedItem?.title || item.title,
        qty: item.count || item.numberOfboxes || 1,
        ...(item.selectedItem?.weight || item.weight
          ? { weight: Number(item.selectedItem?.weight || item.weight) }
          : {}),
        images: item.images || [],
        size: item.size || item.selectedBoatSize || item.selectedTVSize || "",
        type:
          item.selectedItem?.title ||
          item.type ||
          item.selectedMotorcycleType ||
          "",
        moreInfo: item.moreInfo || item.selectedOption || "",
        isOversized: item.isOversized || "",
      })),
      deliverydetails: {
        helperscount: data.deliverydetails?.helperscount || 0,
      },
      charges,
      distance,
      duration,
      date: data.date,
      time: data.time,
      selectedService: data.selectedService,
      totalWeight: data.totalWeight,
      finalTotal,
      tipPercentage: effectiveTipPercent,
      tipAmount,
      userDetails: {
        name:
          `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim() ||
          user?.displayName ||
          "",
        email: user?.email,
        phone: userData?.phone || userData?.phoneNumber,
      },
    };

    // Save booking data to localStorage and navigate to payment page
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "bulky_pending_booking",
        JSON.stringify(bookingData),
      );
    }
    router.push("/booking/payment");
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ╔══════════════════════════════╗
            ║  LEFT: REVIEW DETAILS        ║
            ╚══════════════════════════════╝ */}
        <div className="space-y-6 lg:max-h-[680px] lg:overflow-y-auto lg:pr-2">
          {/* Trip */}
          <section>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <MapPin size={11} /> Trip Route
            </p>
            <div className="relative pl-8 space-y-4 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-gray-200">
              <div className="relative">
                <div className="absolute -left-8 top-0.5 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-white">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <p className="text-[10px] font-bold text-primary uppercase mb-0.5">
                  Pickup
                </p>
                <p className="text-sm font-semibold text-gray-700 leading-snug">
                  {data.pickupdetails?.address}
                </p>
                {data.pickupdetails?.floors > 0 && (
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Level {data.pickupdetails.floors}
                  </p>
                )}
              </div>
              <div className="relative">
                <div className="absolute -left-8 top-0.5 w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center ring-2 ring-white">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                </div>
                <p className="text-[10px] font-bold text-secondary uppercase mb-0.5">
                  Destination
                </p>
                <p className="text-sm font-semibold text-gray-700 leading-snug">
                  {data.destinationdetails?.address}
                </p>
                {data.destinationdetails?.floors > 0 && (
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Level {data.destinationdetails.floors}
                  </p>
                )}
              </div>
            </div>
            {/* Trip stat pills */}
            <div className="flex gap-3 mt-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
                <Route size={13} className="text-primary" />
                <div>
                  <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">
                    Distance
                  </p>
                  <p className="text-xs font-bold text-gray-700">
                    {distance?.toFixed(1)} mi
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
                <Clock size={13} className="text-secondary" />
                <div>
                  <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">
                    Est. Time
                  </p>
                  <p className="text-xs font-bold text-gray-700">
                    {Math.max(1, estimatedMinutes)} min
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Items */}
          <section>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Package size={11} /> Items to Deliver
            </p>
            <div className="space-y-2">
              {data.itemdetails?.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100"
                >
                  <div className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-sm font-black text-primary shadow-sm">
                    {item.count}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">
                      {item.selectedItem?.title || item.title}
                    </p>
                    <p className="text-[10px] text-gray-400">{item.title}</p>
                  </div>
                  {item.images?.length > 0 && (
                    <div className="w-9 h-9 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                      <img
                        src={item.images[0].data_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Date + Service */}
          <section className="grid grid-cols-2 gap-3">
            {data.date && (
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-1.5 mb-1">
                  <Calendar size={12} className="text-primary" />
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Date
                  </p>
                </div>
                <p className="text-sm font-bold text-gray-800">
                  {new Date(data.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            )}
            {data.deliverydetails?.helperscount != null && (
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-1.5 mb-1">
                  <Users size={12} className="text-secondary" />
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Helpers
                  </p>
                </div>
                <p className="text-sm font-bold text-gray-800">
                  {data.deliverydetails.helperscount}
                </p>
              </div>
            )}
            {data.selectedService && (
              <div className="col-span-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-1.5 mb-1">
                  <Layers size={12} className="text-amber-500" />
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Service
                  </p>
                </div>
                <p className="text-sm font-bold text-gray-800">
                  {data.selectedService}
                </p>
              </div>
            )}
          </section>
        </div>

        {/* ╔══════════════════════════════╗
            ║  RIGHT: PAYMENT              ║
            ╚══════════════════════════════╝ */}
        <div className="space-y-6">
          {/* Invoice breakdown */}
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 space-y-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Calculator size={11} /> Invoice Analysis
            </p>
            <BillRow
              label="Vehicle Base Service"
              value={`$${charges.baseFee.toFixed(2)}`}
            />
            <BillRow
              label="Distance Charge"
              sub={`${distance?.toFixed(1)} mi × $1.25`}
              value={`$${charges.mileageFee.toFixed(2)}`}
            />
            <BillRow
              label="Fuel Surcharge (12%)"
              value={`$${charges.fuelSurcharge.toFixed(2)}`}
            />
            {charges.serviceMarkup > 0 && (
              <BillRow
                label="Service Premium"
                value={`$${charges.serviceMarkup.toFixed(2)}`}
              />
            )}
            <BillRow
              label={`Labor / Helpers`}
              sub={`${data.deliverydetails?.helperscount || 0} × $25`}
              value={`$${charges.laborFee.toFixed(2)}`}
            />
            <div className="h-px bg-gray-200 my-1" />
            <BillRow
              label="Sales Tax (8.25%)"
              value={`$${charges.salesTax.toFixed(2)}`}
            />
            <div className="h-px bg-gray-200 my-1" />
            <BillRow
              label="Subtotal"
              value={`$${charges.grandTotal.toFixed(2)}`}
              highlight
            />
          </div>

          {/* Tips — matches mobile: preset chips + No Tip + custom input */}
          <div className="space-y-3">
            <div>
              <p className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                <Heart size={14} className="text-rose-500" /> Add a Tip
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Tip is split between driver and helpers
              </p>
            </div>

            {/* Preset chips */}
            <div className="flex flex-wrap gap-2">
              {TIP_OPTIONS.map((pct) => (
                <button
                  key={pct}
                  onClick={() => selectTip(pct)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-bold border transition-all",
                    selectedTipPercent === pct
                      ? "bg-rose-500 text-white border-rose-500"
                      : "bg-white border-gray-200 text-gray-600 hover:border-rose-200",
                  )}
                >
                  {pct}%
                </button>
              ))}
              {/* No tip */}
              <button
                onClick={() => {
                  setSelectedTipPercent(null);
                  setCustomTipText("");
                }}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-bold border transition-all",
                  effectiveTipPercent === 0 &&
                    selectedTipPercent === null &&
                    customTipText === ""
                    ? "bg-gray-800 text-white border-gray-800"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300",
                )}
              >
                No tip
              </button>
            </div>

            {/* Custom tip input */}
            <div className="relative flex items-center">
              <input
                type="number"
                min="0"
                max="100"
                placeholder="Custom %"
                value={customTipText}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9.]/g, "");
                  setCustomTipText(raw);
                  setSelectedTipPercent(null);
                }}
                className={cn(
                  "w-full px-4 py-2.5 pr-8 border rounded-xl text-sm font-bold outline-none transition-all",
                  customTipText
                    ? "border-rose-400 bg-rose-50 text-rose-600 focus:ring-2 focus:ring-rose-200"
                    : "border-gray-200 bg-white text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary",
                )}
              />
              <span className="absolute right-3 text-sm font-bold text-gray-400">
                %
              </span>
            </div>

            {/* Tip amount preview */}
            {tipAmount > 0 && (
              <div className="flex items-center justify-between px-4 py-2.5 bg-rose-50 border border-rose-100 rounded-xl">
                <span className="text-sm font-bold text-rose-600">
                  Tip amount
                </span>
                <span className="text-sm font-black text-rose-600">
                  +${tipAmount.toFixed(2)}
                </span>
              </div>
            )}

            {/* Final total */}
            <div className="flex items-center justify-between px-4 py-3.5 bg-primary/5 border border-primary/10 rounded-xl">
              <span className="text-sm font-bold text-gray-800">
                Total to Pay
              </span>
              <span className="text-2xl font-black text-primary">
                ${finalTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Proceed to Payment */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <Button fullWidth onClick={handleProceedToPayment}>
              Proceed to Payment
            </Button>
            <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">
              Powered by Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
