"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import WizardStep from "@/components/page-sections/booking/WizardStep";
import LocationStep from "@/components/page-sections/booking/steps/LocationStep";
import ItemsStep from "@/components/page-sections/booking/steps/ItemsStep";
import ServiceStep from "@/components/page-sections/booking/steps/ServiceStep";
import ScheduleStep from "@/components/page-sections/booking/steps/ScheduleStep";
import SummaryStep from "@/components/page-sections/booking/steps/SummaryStep";
import { calculateMovingCharges } from "@/utils/booking-logic";
import { cn } from "@/utils/cn";
import {
  MapPin,
  Package,
  Settings,
  Calendar,
  ClipboardList,
  Check,
  ArrowRight,
} from "lucide-react";

const STEPS = [
  {
    id: "location",
    title: "Location",
    description: "Set pickup & drop-off",
    icon: MapPin,
  },
  {
    id: "items",
    title: "Items",
    description: "Select what you&apos;re moving",
    icon: Package,
  },
  {
    id: "service",
    title: "Service",
    description: "Choose your service level",
    icon: Settings,
  },
  {
    id: "schedule",
    title: "Schedule",
    description: "Pick a date & time",
    icon: Calendar,
  },
  {
    id: "summary",
    title: "Summary",
    description: "Review & pay",
    icon: ClipboardList,
  },
];

export default function CreateBookingPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    pickupdetails: null,
    destinationdetails: null,
    itemdetails: [],
    deliverydetails: {
      helperscount: 0,
      receiptImage: null,
    },
    date: null,
    time: null,
    selectedService: "Door-to-Door Delivery",
    totalWeight: 0,
  });

  const [charges, setCharges] = useState(null);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/auth?goTo=/booking/create`);
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (formData.itemdetails.length > 0) {
      const calculated = calculateMovingCharges(
        formData.itemdetails,
        distance,
        formData.selectedService,
        formData.deliverydetails.helperscount,
      );
      setCharges(calculated);
    }
  }, [
    formData.itemdetails,
    distance,
    formData.selectedService,
    formData.deliverydetails.helperscount,
  ]);

  const updateFormData = (_stepId, data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  if (authLoading) return null;

  const progressPercent = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <main className="min-h-screen pt-24 pb-16 bg-[#fafaff]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-text-light mb-2">
            <span>Dashboard</span>
            <ArrowRight size={14} />
            <span className="text-heading font-medium">New Booking</span>
          </div>
          <h1 className="text-3xl font-bold text-heading">Create a Booking</h1>
          <p className="text-text-light mt-1">
            Complete the steps below to schedule your delivery
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar: Progress Steps */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              {/* Progress Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-heading">
                    Progress
                  </span>
                  <span className="text-sm font-bold text-primary">
                    {Math.round(progressPercent)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Step List */}
              <nav className="space-y-2">
                {STEPS.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = index < currentStep;
                  const isActive = index === currentStep;
                  const isPending = index > currentStep;

                  return (
                    <div
                      key={step.id}
                      className={cn(
                        "flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200",
                        isActive && "bg-primary/5",
                        isPending && "opacity-50",
                      )}
                    >
                      {/* Step Icon - No Background */}
                      <div
                        className={cn(
                          "flex-shrink-0 transition-all duration-200",
                          isCompleted && "text-green-500",
                          isActive && "text-primary",
                          isPending && "text-gray-400",
                        )}
                      >
                        {isCompleted ? (
                          <Check size={22} strokeWidth={2.5} />
                        ) : (
                          <Icon size={22} strokeWidth={2} />
                        )}
                      </div>

                      {/* Step Info */}
                      <div className="min-w-0">
                        <p
                          className={cn(
                            "text-sm font-semibold leading-tight",
                            isActive ? "text-primary" : "text-heading",
                          )}
                        >
                          {step.title}
                        </p>
                        <p className="text-xs text-text-light mt-1">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </nav>

              {/* Help Box */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-text-light leading-relaxed">
                  Need help? Contact our support team for assistance with your
                  booking.
                </p>
              </div>
            </div>
          </aside>

          {/* Right: Step Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Step Header */}
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Step Icon - No Background */}
                  <div className="text-primary">
                    {React.createElement(STEPS[currentStep].icon, {
                      size: 24,
                      strokeWidth: 2,
                    })}
                  </div>
                  <div>
                    <p className="text-xs text-text-light uppercase tracking-wide font-medium mb-1">
                      Step {currentStep + 1} of {STEPS.length}
                    </p>
                    <h2 className="text-lg font-bold text-heading">
                      {STEPS[currentStep].title}
                    </h2>
                  </div>
                </div>

                {/* Step Indicators */}
                <div className="hidden sm:flex items-center gap-1.5">
                  {STEPS.map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        i < currentStep
                          ? "w-6 bg-green-500"
                          : i === currentStep
                            ? "w-8 bg-primary"
                            : "w-1.5 bg-gray-200",
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Step Content */}
              <div className="p-6 md:p-8">
                {currentStep === 0 && (
                  <LocationStep
                    data={formData}
                    onUpdate={(data) => updateFormData("location", data)}
                    onNext={(dist, dur) => {
                      setDistance(dist);
                      setDuration(dur);
                      nextStep();
                    }}
                  />
                )}

                {currentStep === 1 && (
                  <ItemsStep
                    data={formData}
                    onUpdate={(data) => updateFormData("items", data)}
                    onNext={nextStep}
                    onBack={prevStep}
                  />
                )}

                {currentStep === 2 && (
                  <ServiceStep
                    data={formData}
                    distance={distance}
                    onUpdate={(data) => updateFormData("service", data)}
                    onNext={nextStep}
                    onBack={prevStep}
                  />
                )}

                {currentStep === 3 && (
                  <ScheduleStep
                    data={formData}
                    onUpdate={(data) => updateFormData("schedule", data)}
                    onNext={nextStep}
                    onBack={prevStep}
                  />
                )}

                {currentStep === 4 && (
                  <SummaryStep
                    data={formData}
                    charges={charges}
                    distance={distance}
                    duration={duration}
                    onBack={prevStep}
                    onNext={(bookingId) => {
                      router.push(`/dashboard?newBooking=${bookingId}`);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
