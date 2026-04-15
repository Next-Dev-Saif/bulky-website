"use client";

import React from "react";
import Image from "next/image";
import { Smartphone, Bell, MapPin, Download, Star } from "lucide-react";
import {
  useScrollAnimation,
  useScrollAnimationGroup,
} from "@/hooks/useScrollAnimation";

const features = [
  {
    icon: Smartphone,
    title: "Book on the Go",
    description:
      "Schedule deliveries from anywhere with our easy-to-use mobile app.",
    color: "from-blue-400 to-blue-600",
  },
  {
    icon: Bell,
    title: "Instant Notifications",
    description: "Get real-time updates about your delivery status.",
    color: "from-purple-400 to-purple-600",
  },
  {
    icon: MapPin,
    title: "Live Tracking",
    description: "Watch your delivery progress on an interactive map.",
    color: "from-green-400 to-emerald-600",
  },
];

const AppDownload = () => {
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation();
  const { containerRef: featuresRef, visibleItems: featuresVisible } =
    useScrollAnimationGroup(features.length);
  const { ref: phoneRef, isVisible: phoneVisible } = useScrollAnimation();

  return (
    <section className="section-padding bg-gradient-to-br from-[#fafaff] via-white to-blue-50/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-3xl" />

      <div className="container-custom relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div
            ref={contentRef}
            className={`transition-all duration-1000 ${
              contentVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-12"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-6">
              <Download size={16} />
              Download the App
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-heading">
              Take Bulky With You{" "}
              <span className="text-primary">Everywhere</span>
            </h2>

            <p className="text-text-light text-lg leading-relaxed mb-10">
              Get the full Bulky experience on your phone. Book deliveries,
              track your items, and communicate with drivers all from the palm
              of your hand.
            </p>

            <div ref={featuresRef} className="space-y-5 mb-10">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`group flex items-start gap-4 transition-all duration-700 ${
                    featuresVisible.includes(index)
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-5"
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon
                      size={22}
                      className="text-white"
                      strokeWidth={2}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-heading mb-1 text-lg">
                      {feature.title}
                    </h4>
                    <p className="text-text-light">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* App Store Badges */}
            <div className="flex flex-wrap gap-4">
              <a
                href="#"
                className="group block hover:scale-105 transition-transform duration-300"
              >
                <Image
                  src="/apple-badge.png"
                  alt="Download on the App Store"
                  width={150}
                  height={45}
                  className="h-[48px] w-auto shadow-lg rounded-lg"
                />
              </a>
              <a
                href="#"
                className="group block hover:scale-105 transition-transform duration-300"
              >
                <Image
                  src="/android-badge.png"
                  alt="Get it on Google Play"
                  width={150}
                  height={45}
                  className="h-[48px] w-auto shadow-lg rounded-lg"
                />
              </a>
            </div>
          </div>

          {/* Phone Mockup */}
          <div
            ref={phoneRef}
            className={`relative flex justify-center lg:justify-end transition-all duration-1000 delay-300 ${
              phoneVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-12"
            }`}
          >
            <div className="relative">
              {/* Main phone */}
              <div className="relative w-[300px] h-[600px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[45px] p-3 shadow-2xl animate-float">
                {/* Phone notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-800 rounded-b-2xl z-10" />

                {/* Phone Screen */}
                <div className="w-full h-full bg-white rounded-[38px] overflow-hidden relative">
                  {/* Mock App Header */}
                  <div className="bg-gradient-to-r from-primary to-blue-600 p-4 pt-10">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 bg-white/20 rounded-xl" />
                      <div className="w-24 h-5 bg-white/30 rounded-lg" />
                      <div className="w-8 h-8 bg-white/20 rounded-xl" />
                    </div>
                  </div>

                  {/* Mock Map Area */}
                  <div className="h-52 bg-gradient-to-br from-blue-50 to-gray-100 relative">
                    {/* Map pins */}
                    <div className="absolute top-16 left-12">
                      <div className="w-4 h-4 bg-primary rounded-full animate-pulse" />
                      <div className="w-8 h-8 bg-primary/20 rounded-full absolute -inset-2 animate-ping" />
                    </div>
                    <div className="absolute top-24 right-16">
                      <div className="w-4 h-4 bg-green-500 rounded-full" />
                    </div>
                    {/* Route Line */}
                    <svg className="absolute inset-0 w-full h-full">
                      <path
                        d="M 60 100 Q 120 60 200 90"
                        stroke="#0109C8"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray="8,4"
                        className="animate-draw-line"
                      />
                    </svg>
                  </div>

                  {/* Mock Booking Card */}
                  <div className="p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              size={12}
                              className="text-amber-400 fill-amber-400"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                    <div className="flex gap-3 mt-4">
                      <div className="h-20 bg-primary/10 rounded-xl flex-1 border-2 border-primary" />
                      <div className="h-20 bg-gray-100 rounded-xl flex-1" />
                      <div className="h-20 bg-gray-100 rounded-xl flex-1" />
                    </div>
                    <div className="h-14 bg-gradient-to-r from-primary to-blue-600 rounded-2xl shadow-lg shadow-primary/30" />
                  </div>
                </div>

                {/* Side button */}
                <div className="absolute -right-1 top-24 w-1 h-12 bg-gray-700 rounded-r" />
                <div className="absolute -right-1 top-40 w-1 h-16 bg-gray-700 rounded-r" />
              </div>

              {/* Floating notification */}
              <div className="absolute -top-4 -left-8 bg-white rounded-2xl p-4 shadow-xl animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Bell size={18} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-heading">
                      Driver Arrived!
                    </p>
                    <p className="text-xs text-text-light">2 mins ago</p>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;
