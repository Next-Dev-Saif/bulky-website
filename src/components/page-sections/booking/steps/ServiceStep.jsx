"use client";
import { useState, useMemo, useEffect } from "react";
import {
  Users,
  Building2,
  ShieldCheck,
  Zap,
  Star,
  Trophy,
  ArrowRight,
  Info,
  Check,
} from "lucide-react";
import Button from "@/core-components/Button";
import { ServiceTiers } from "@/utils/booking-data";
import { calculateMovingCharges } from "@/utils/booking-logic";
import { cn } from "@/utils/cn";

const TIER_META = {
  "door-to-door": { icon: Zap, color: "text-blue-500" },
  "ground-floor": { icon: ShieldCheck, color: "text-green-500" },
  "white-glove": { icon: Trophy, color: "text-amber-500" },
};

function getTierMeta(tier) {
  const key =
    tier.value
      ?.toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z-]/g, "") || "";
  if (key.includes("white")) return TIER_META["white-glove"];
  if (key.includes("ground")) return TIER_META["ground-floor"];
  return TIER_META["door-to-door"];
}

export default function ServiceStep({
  data,
  distance,
  onUpdate,
  onNext,
  onBack,
}) {
  const maxItemWeight = useMemo(
    () =>
      data.itemdetails?.reduce((max, item) => {
        const w =
          item.selectedItem?.weight ||
          item.selectedType?.weight ||
          item.weight ||
          0;
        return Math.max(max, w);
      }, 0) || 0,
    [data.itemdetails],
  );

  const requiredHelpers = maxItemWeight > 60 ? 2 : 1;

  const [selectedTier, setSelectedTier] = useState(
    data.deliverydetails?.serviceTier || ServiceTiers[0],
  );
  const [helpers, setHelpers] = useState(
    data.deliverydetails?.helperscount || requiredHelpers,
  );
  const [pickupFloors, setPickupFloors] = useState(
    data.pickupdetails?.floors || 0,
  );
  const [destFloors, setDestFloors] = useState(
    data.destinationdetails?.floors || 0,
  );

  useEffect(() => {
    if (helpers < requiredHelpers) setHelpers(requiredHelpers);
  }, [requiredHelpers]);

  // Live pricing estimate
  const estimate = useMemo(
    () =>
      calculateMovingCharges(
        data.itemdetails,
        distance || 0,
        selectedTier.value,
        helpers,
      ),
    [selectedTier, helpers, distance, data.itemdetails],
  );

  const handleNext = () => {
    onUpdate({
      pickupdetails: { ...data.pickupdetails, floors: pickupFloors },
      destinationdetails: { ...data.destinationdetails, floors: destFloors },
      selectedService: selectedTier.value, // save as string to match mobile schema
      deliverydetails: {
        ...data.deliverydetails,
        serviceTier: selectedTier,
        helperscount: helpers,
        helperprice: helpers * 25,
      },
    });
    onNext();
  };

  const floorLabel = (f) =>
    f === 0
      ? "Ground Floor"
      : `${f}${f === 1 ? "st" : f === 2 ? "nd" : f === 3 ? "rd" : "th"} Floor`;

  return (
    <div className="space-y-8">
      {/* ── Service Tier Selection ── */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-heading">
            Service Level
          </h3>
          <p className="text-sm text-text-light mt-1">
            Choose what level of help you need on arrival.
          </p>
        </div>
        <div className="space-y-3">
          {ServiceTiers.map((tier) => {
            const meta = getTierMeta(tier);
            const TierIcon = meta.icon;
            const isSelected = selectedTier.value === tier.value;
            return (
              <button
                key={tier.value}
                onClick={() => setSelectedTier(tier)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 bg-white hover:border-gray-300",
                )}
              >
                {/* Icon - No Background */}
                <div
                  className={cn(
                    "flex-shrink-0",
                    isSelected ? "text-primary" : meta.color,
                  )}
                >
                  <TierIcon size={24} strokeWidth={2} />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      isSelected ? "text-primary" : "text-heading",
                    )}
                  >
                    {tier.label}
                  </p>
                  <p className="text-xs text-text-light mt-1 leading-relaxed">
                    {tier.description}
                  </p>
                </div>

                {/* Selected check */}
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                    isSelected
                      ? "border-primary bg-primary"
                      : "border-gray-200",
                  )}
                >
                  {isSelected && (
                    <Check size={12} className="text-white" strokeWidth={3} />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ── Helpers ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-heading flex items-center gap-2">
                <Users size={18} className="text-primary" strokeWidth={2} />{" "}
                Helpers Needed
              </h3>
              <p className="text-sm text-text-light mt-1">$25 per helper</p>
            </div>
            {maxItemWeight > 60 && (
              <span className="text-xs font-semibold uppercase tracking-wide bg-orange-50 text-orange-600 px-3 py-1.5 rounded-lg border border-orange-100">
                2 min. required
              </span>
            )}
          </div>

          <div className="flex items-center justify-between p-5 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <p className="text-4xl font-bold text-heading">{helpers}</p>
              <p className="text-sm text-text-light mt-1">
                Helper{helpers !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  setHelpers(Math.max(requiredHelpers, helpers - 1))
                }
                className="w-11 h-11 rounded-xl bg-white border border-gray-200 flex items-center justify-center font-bold text-xl hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                −
              </button>
              <button
                onClick={() => setHelpers(Math.min(15, helpers + 1))}
                className="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xl hover:opacity-90 transition-opacity"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
            <Info
              size={16}
              className="text-blue-500 mt-0.5 flex-shrink-0"
              strokeWidth={2}
            />
            <p className="text-sm text-blue-700 leading-relaxed">
              {maxItemWeight > 60
                ? "Items over 60 lbs require at least 2 helpers for safe handling."
                : "Extra helpers speed up loading and reduce handling time."}
            </p>
          </div>
        </div>

        {/* ── Floor Levels ── */}
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-heading flex items-center gap-2">
              <Building2 size={18} className="text-secondary" strokeWidth={2} />{" "}
              Floor Levels
            </h3>
            <p className="text-sm text-text-light mt-1">
              Higher floors add labor time.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-light uppercase tracking-wider">
                Pickup
              </label>
              <select
                value={pickupFloors}
                onChange={(e) => setPickupFloors(Number(e.target.value))}
                className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-semibold text-heading cursor-pointer transition-all"
              >
                {[0, 1, 2, 3, 4, 5].map((f) => (
                  <option key={f} value={f}>
                    {floorLabel(f)}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-light uppercase tracking-wider">
                Destination
              </label>
              <select
                value={destFloors}
                onChange={(e) => setDestFloors(Number(e.target.value))}
                className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-semibold text-heading cursor-pointer transition-all"
              >
                {[0, 1, 2, 3, 4, 5].map((f) => (
                  <option key={f} value={f}>
                    {floorLabel(f)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── Live Pricing Estimate ── */}
      <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
        <p className="text-xs font-semibold text-text-light uppercase tracking-wider mb-4">
          Estimated Cost Preview
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { label: "Base Fee", value: estimate.baseFee },
            { label: "Mileage", value: estimate.mileageFee },
            { label: "Labor", value: estimate.laborFee },
            {
              label: "Est. Total",
              value: estimate.grandTotal,
              highlight: true,
            },
          ].map(({ label, value, highlight }) => (
            <div
              key={label}
              className={cn(
                "text-center",
                highlight && "col-span-2 sm:col-span-1",
              )}
            >
              <p className="text-xs text-text-light font-medium mb-2">
                {label}
              </p>
              <p
                className={cn(
                  "font-bold",
                  highlight ? "text-2xl text-primary" : "text-lg text-heading",
                )}
              >
                ${value.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
        <p className="text-xs text-text-light mt-4 text-center">
          * Final amount calculated at checkout. Taxes & tips not included.
        </p>
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleNext} className="group rounded-full">
          Next Step
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
