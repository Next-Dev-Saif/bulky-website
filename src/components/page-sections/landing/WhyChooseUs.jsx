"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, Zap, Shield } from "lucide-react";
import {
  useScrollAnimation,
  useScrollAnimationGroup,
} from "@/hooks/useScrollAnimation";

const features = [
  {
    title: "Easy Booking",
    description:
      "Book your delivery in under 60 seconds. Just enter pickup and drop-off locations, choose your vehicle, and confirm.",
    image: "/why-us/easy-booking.svg",
    icon: Sparkles,
    color: "from-amber-400 to-orange-500",
  },
  {
    title: "Real-Time Tracking",
    description:
      "Track your delivery live on the map from pickup to drop-off. Know exactly where your items are at all times.",
    image: "/why-us/fastest-delivery.svg",
    icon: Zap,
    color: "from-blue-400 to-primary",
  },
  {
    title: "Verified Drivers",
    description:
      "All drivers are thoroughly vetted and reviewed. Your bulky items are handled by trusted professionals.",
    image: "/why-us/bulky-deliveries.svg",
    icon: Shield,
    color: "from-green-400 to-emerald-500",
  },
];

const WhyChooseUs = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { containerRef, visibleItems } = useScrollAnimationGroup(
    features.length,
  );

  return (
    <section className="section-padding bg-gradient-to-b from-white to-[#fafaff] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container-custom relative">
        <div ref={headerRef} className="text-center mb-16">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-4 transition-all duration-700 ${
              headerVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-5"
            }`}
          >
            <Sparkles size={16} />
            Why Choose Us
          </div>
          <h2
            className={`text-3xl md:text-5xl font-bold mb-4 text-heading transition-all duration-700 delay-100 ${
              headerVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-5"
            }`}
          >
            Delivery Made <span className="text-primary">Simple</span>
          </h2>
          <p
            className={`text-text-light text-lg max-w-2xl mx-auto transition-all duration-700 delay-200 ${
              headerVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-5"
            }`}
          >
            We have streamlined every step of the delivery process so you can
            focus on what matters most.
          </p>
        </div>

        <div ref={containerRef} className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`group relative bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary/20 transition-all duration-500 ${
                  visibleItems.includes(index)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Icon badge */}
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                >
                  <Icon size={24} className="text-white" strokeWidth={2.5} />
                </div>

                {/* Image */}
                <div className="relative w-full h-48 mb-6 overflow-hidden rounded-2xl bg-gradient-to-b from-gray-50 to-white group-hover:from-primary/5 group-hover:to-white transition-colors duration-300">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3 text-heading group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-text-light leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-3xl" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
