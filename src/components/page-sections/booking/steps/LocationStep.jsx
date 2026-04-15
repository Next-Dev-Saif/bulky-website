"use client";
import { useState, useRef, useEffect } from "react";
import {
  MapPin,
  Navigation,
  ArrowRight,
  Loader2,
  ArrowLeftRight,
  Route,
  Clock,
  Building2,
  Home,
  Briefcase,
} from "lucide-react";
import Button from "@/core-components/Button";
import { cn } from "@/utils/cn";

// ─── Custom places autocomplete ──────────────────────────────────────────────
function PlacesInput({
  placeholder,
  value,
  onChange,
  onSelect,
  icon: Icon,
  accentClass,
  label,
  zIndex = 10,
}) {
  const [input, setInput] = useState(value || "");
  const [predictions, setPredictions] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setInput(value || "");
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowResults(false);
      }
    }
    if (typeof document !== "undefined") {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (input.length > 2 && showResults) {
        setIsLoading(true);
        try {
          const res = await fetch(
            "https://places.googleapis.com/v1/places:autocomplete",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
              },
              body: JSON.stringify({ input, languageCode: "en" }),
            },
          );
          const json = await res.json();
          setPredictions(
            json.suggestions?.map((s) => ({
              description: s.placePrediction.text.text,
              place_id: s.placePrediction.placeId,
            })) || [],
          );
        } catch {
          setPredictions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setPredictions([]);
      }
    }, 450);
    return () => clearTimeout(timer);
  }, [input, showResults]);

  const handleSelect = async (place) => {
    setInput(place.description);
    setShowResults(false);
    setPredictions([]);
    try {
      const res = await fetch(
        `https://places.googleapis.com/v1/places/${place.place_id}`,
        {
          headers: {
            "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
            "X-Goog-FieldMask": "location,formattedAddress",
          },
        },
      );
      const data = await res.json();
      if (data.location) {
        onSelect(data.formattedAddress || place.description, {
          latitude: data.location.latitude,
          longitude: data.location.longitude,
        });
      }
    } catch {}
  };

  return (
    <div className="relative" ref={wrapperRef} style={{ zIndex }}>
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
        <Icon size={12} className={accentClass} /> {label}
      </label>
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full pl-4 pr-10 py-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium text-gray-800 placeholder:text-gray-400"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowResults(true);
            onChange(e.target.value);
          }}
          onFocus={() => setShowResults(true)}
        />
        {isLoading && (
          <div className="absolute right-3">
            <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
          </div>
        )}
      </div>

      {showResults && predictions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-xl shadow-2xl shadow-black/10 max-h-56 overflow-y-auto">
          {predictions.map((item) => (
            <li
              key={item.place_id}
              onClick={() => handleSelect(item)}
              className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
            >
              <MapPin
                size={14}
                className="text-gray-400 mt-0.5 flex-shrink-0"
              />
              <span className="text-sm text-gray-700">{item.description}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Quick select buttons ───────────────────────────────────────────────────
function QuickSelectButton({ icon: Icon, label, onClick, isActive }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all",
        isActive
          ? "bg-primary/5 border-primary text-primary"
          : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50",
      )}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

// ─── Main step ─────────────────────────────────────────────────────────────
export default function LocationStep({ data, onUpdate, onNext }) {
  const [pickupAddr, setPickupAddr] = useState(
    data.pickupdetails?.address || "",
  );
  const [destAddr, setDestAddr] = useState(
    data.destinationdetails?.address || "",
  );
  const [pickupCords, setPickupCords] = useState(
    data.pickupdetails?.cords || null,
  );
  const [destCords, setDestCords] = useState(
    data.destinationdetails?.cords || null,
  );
  const [routeInfo, setRouteInfo] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Auto-calculate distance when both coords are present
  useEffect(() => {
    if (!pickupCords || !destCords) {
      setRouteInfo(null);
      return;
    }
    const fetchRoute = async () => {
      setIsCalculating(true);
      try {
        const origin = `${pickupCords.latitude},${pickupCords.longitude}`;
        const destination = `${destCords.latitude},${destCords.longitude}`;
        const res = await fetch(
          `/api/maps/distance-matrix?origins=${origin}&destinations=${destination}`,
        );
        const json = await res.json();
        if (json.distanceKm !== undefined) setRouteInfo(json);
      } catch {
      } finally {
        setIsCalculating(false);
      }
    };
    fetchRoute();
  }, [pickupCords, destCords]);

  const handleSwap = () => {
    setPickupAddr(destAddr);
    setDestAddr(pickupAddr);
    setPickupCords(destCords);
    setDestCords(pickupCords);
  };

  const handleNext = async () => {
    if (!pickupCords || !destCords || !routeInfo) return;
    const distanceMiles = routeInfo.distanceKm * 0.621371;
    onUpdate({
      pickupdetails: { address: pickupAddr, cords: pickupCords },
      destinationdetails: { address: destAddr, cords: destCords },
    });
    onNext(distanceMiles, routeInfo.durationMin);
  };

  const canProceed = pickupCords && destCords && routeInfo && !isCalculating;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center pb-4">
        <h3 className="text-lg font-bold text-gray-900">
          Where are we moving?
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Enter your pickup and destination addresses
        </p>
      </div>

      {/* Address inputs */}
      <div className="space-y-4">
        {/* Pickup */}
        <PlacesInput
          label="Pickup Location"
          placeholder="Enter street address"
          value={pickupAddr}
          zIndex={30}
          icon={MapPin}
          accentClass="text-primary"
          onChange={(v) => {
            setPickupAddr(v);
            setPickupCords(null);
          }}
          onSelect={(addr, cords) => {
            setPickupAddr(addr);
            setPickupCords(cords);
          }}
        />

        {/* Destination */}
        <PlacesInput
          label="Destination"
          placeholder="Enter street address"
          value={destAddr}
          zIndex={20}
          icon={Navigation}
          accentClass="text-secondary"
          onChange={(v) => {
            setDestAddr(v);
            setDestCords(null);
          }}
          onSelect={(addr, cords) => {
            setDestAddr(addr);
            setDestCords(cords);
          }}
        />

        {/* Swap button - below both inputs with tooltip */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleSwap}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:text-primary hover:border-primary/50 hover:shadow-md transition-all shadow-sm text-sm font-medium"
          >
            <ArrowLeftRight size={16} />
            Swap locations
          </button>
        </div>
      </div>

      {/* Route summary card - shown when both locations selected */}
      {canProceed && (
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-5 border border-primary/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <Route size={20} className="text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Route Confirmed</h4>
              <p className="text-xs text-gray-500">Ready to proceed</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Route size={14} className="text-primary" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Distance
                </span>
              </div>
              <p className="text-lg font-black text-gray-900">
                {(routeInfo.distanceKm * 0.621371).toFixed(1)} mi
              </p>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={14} className="text-secondary" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Est. Time
                </span>
              </div>
              <p className="text-lg font-black text-gray-900">
                {Math.round(routeInfo.durationMin)} min
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isCalculating && (
        <div className="flex items-center justify-center gap-3 py-8 text-gray-400">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm">Calculating route...</span>
        </div>
      )}

      {/* Quick tips */}
      {!canProceed && !isCalculating && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-xs font-medium text-gray-500 flex items-center gap-2">
            <MapPin size={14} className="text-primary" />
            Tip: Start typing your address and select from suggestions for
            accurate pricing
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-end pt-4 border-t border-gray-100">
        <Button
          onClick={handleNext}
          disabled={!canProceed}
          className="group rounded-full min-w-[140px]"
        >
          {isCalculating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Calculating...
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
