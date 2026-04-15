"use client";

import React from "react";
import { MapPin, Truck, Package, Star, ArrowRight } from "lucide-react";
import {
  useScrollAnimation,
  useScrollAnimationGroup,
} from "@/hooks/useScrollAnimation";

const steps = [
  {
    icon: MapPin,
    step: "01",
    title: "Enter Locations",
    description:
      "Enter your pickup and drop-off addresses. Our system will instantly calculate the distance and available vehicle options.",
    color: "from-blue-400 to-blue-600",
  },
  {
    icon: Truck,
    step: "02",
    title: "Choose Your Driver",
    description:
      "Browse verified drivers, compare prices, and select the best option for your delivery needs.",
    color: "from-primary to-blue-700",
  },
  {
    icon: Package,
    step: "03",
    title: "Track & Relax",
    description:
      "Track your delivery in real-time on the map. Get notified when your items are picked up and delivered.",
    color: "from-purple-400 to-purple-600",
  },
  {
    icon: Star,
    step: "04",
    title: "Rate & Review",
    description:
      "Share your experience by rating your driver. Your feedback helps us maintain quality service.",
    color: "from-amber-400 to-orange-500",
  },
];

const HowItWorks = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { containerRef: desktopRef, visibleItems: desktopVisible } =
    useScrollAnimationGroup(steps.length);
  const { containerRef: mobileRef, visibleItems: mobileVisible } =
    useScrollAnimationGroup(steps.length);

  return (
    <section className="section-padding bg-gradient-to-b from-[#fafaff] to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-blue-200/20 rounded-full blur-3xl" />

      <div className="container-custom relative">
        <div ref={headerRef} className="text-center mb-16">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-4 transition-all duration-700 ${
              headerVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-5"
            }`}
          >
            <ArrowRight size={16} />
            Simple Process
          </div>
          <h2
            className={`text-3xl md:text-5xl font-bold mb-4 text-heading transition-all duration-700 delay-100 ${
              headerVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-5"
            }`}
          >
            How It <span className="text-primary">Works</span>
          </h2>
          <p
            className={`text-text-light text-lg max-w-2xl mx-auto transition-all duration-700 delay-200 ${
              headerVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-5"
            }`}
          >
            Get your bulky items delivered in four simple steps. No complicated
            forms, no hidden fees.
          </p>
        </div>

        {/* Desktop & Tablet: Horizontal with connector lines */}
        <div ref={desktopRef} className="hidden md:block">
          {/* Connector lines with animated dots */}
          <div className="hidden lg:flex justify-center mb-[-60px] px-20">
            <div className="flex justify-between w-full max-w-4xl">
              {steps.slice(0, -1).map((_, index) => (
                <div key={index} className="flex-1 mx-8 relative">
                  <div className="h-[3px] bg-gradient-to-r from-primary/40 to-primary/10 w-full mt-8 rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-primary animate-loading-bar" />
                  </div>
                  {/* Animated dot */}
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-lg animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative z-10">
            {steps.map((item, index) => (
              <div
                key={item.step}
                className={`group transition-all duration-700 ${
                  desktopVisible.includes(index)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="bg-white rounded-3xl p-6 h-full shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-primary/20 hover:-translate-y-2">
                  {/* Step badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                    >
                      <item.icon
                        size={24}
                        className="text-white"
                        strokeWidth={2.5}
                      />
                    </div>
                    <span className="text-5xl font-black text-gray-100 group-hover:text-primary/10 transition-colors">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-heading group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-text-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: Vertical timeline */}
        <div ref={mobileRef} className="md:hidden px-4">
          <div className="relative">
            {/* Vertical line with gradient */}
            <div className="absolute left-8 top-8 bottom-8 w-1 bg-gradient-to-b from-blue-400 via-primary to-amber-400 rounded-full" />

            <div className="space-y-8">
              {steps.map((item, index) => (
                <div
                  key={item.step}
                  className={`relative flex gap-5 transition-all duration-700 ${
                    mobileVisible.includes(index)
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-5"
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  {/* Icon Circle */}
                  <div
                    className={`relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 shadow-xl group-hover:scale-110 transition-transform`}
                  >
                    <item.icon
                      size={24}
                      className="text-white"
                      strokeWidth={2.5}
                    />
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-heading">
                        {item.title}
                      </h3>
                      <span className="text-2xl font-black text-gray-100">
                        {item.step}
                      </span>
                    </div>
                    <p className="text-text-light text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
