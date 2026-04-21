"use client";

import React from "react";
import Image from "next/image";
import { Check, User, Building2 } from "lucide-react";
import {
  useScrollAnimation,
  useScrollAnimationGroup,
} from "@/hooks/useScrollAnimation";

const featuresList1 = [
  "Instant price estimates with no hidden fees",
  "Multiple vehicle options to fit your needs",
  "Secure payment processing",
  "24/7 customer support",
];

const featuresList2 = [
  "GPS tracking in real-time",
  "Direct chat with your driver",
  "Photo confirmation at pickup and delivery",
  "Rating and review system",
];

const MarketingSections = () => {
  const { ref: section1ImagesRef, isVisible: section1ImagesVisible } =
    useScrollAnimation();
  const { ref: section1ContentRef, isVisible: section1ContentVisible } =
    useScrollAnimation();
  const { containerRef: features1Ref, visibleItems: features1Visible } =
    useScrollAnimationGroup(featuresList1.length);

  const { ref: section2ContentRef, isVisible: section2ContentVisible } =
    useScrollAnimation();
  const { ref: section2ImageRef, isVisible: section2ImageVisible } =
    useScrollAnimation();
  const { containerRef: features2Ref, visibleItems: features2Visible } =
    useScrollAnimationGroup(featuresList2.length);

  return (
    <div className="bg-gradient-to-b from-white via-[#fafaff] to-white space-y-24 pb-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-0 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-3xl" />

      {/* Section 1: For Individuals */}
      <section className="container-custom relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div
            ref={section1ImagesRef}
            className={`relative transition-all duration-1000 ${section1ImagesVisible
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-12"
              }`}
          >
            {/* Main image stack with floating effect */}
            <div className="relative">
              <div className="flex gap-4">
                <div className="relative h-[380px] w-full rounded-3xl overflow-hidden shadow-2xl group hover:shadow-3xl transition-shadow duration-500">
                  <Image
                    src="/section-three/1.jpg"
                    alt="Professional delivery driver"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="relative h-[380px] w-full mt-12 rounded-3xl overflow-hidden shadow-2xl group hover:shadow-3xl transition-shadow duration-500">
                  <Image
                    src="/section-three/2.jpg"
                    alt="Delivery QR Verification"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              </div>

              {/* Floating stat card */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-5 shadow-xl animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <Check size={24} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-heading">98%</p>
                    <p className="text-sm text-text-light">Satisfaction Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            ref={section1ContentRef}
            className={`transition-all duration-1000 delay-200 ${section1ContentVisible
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-12"
              }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-primary text-sm font-semibold mb-6">
              <User size={16} />
              For Individuals
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-heading">
              Deliveries Made <span className="text-primary">Effortless</span>
            </h2>
            <p className="text-text-light text-lg leading-relaxed mb-8">
              Whether you&apos;re buying a couch from a marketplace, sending a treadmill
              to a friend, or need a large store pickup, Bulky makes it simple.
              Get instant quotes, choose your preferred driver, and track
              your items in real-time.
            </p>
            <ul ref={features1Ref} className="space-y-4">
              {featuresList1.map((feature, index) => (
                <li
                  key={feature}
                  className={`group flex items-center gap-4 transition-all duration-700 ${features1Visible.includes(index)
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-5"
                    }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Check size={16} className="text-white" strokeWidth={3} />
                  </div>
                  <span className="text-secondary text-lg">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Section 2: For Businesses */}
      <section className="container-custom relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div
            ref={section2ContentRef}
            className={`order-2 lg:order-1 transition-all duration-1000 ${section2ContentVisible
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-12"
              }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full text-amber-600 text-sm font-semibold mb-6">
              <Building2 size={16} />
              For Businesses
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-heading">
              Scale Your <span className="text-primary">Operations</span>
            </h2>
            <p className="text-text-light text-lg leading-relaxed mb-8">
              From local retailers to e-commerce stores, businesses trust Bulky
              for reliable bulk deliveries. Our platform connects you with a
              network of professional drivers ready to handle your logistics
              needs.
            </p>
            <ul ref={features2Ref} className="space-y-4">
              {featuresList2.map((feature, index) => (
                <li
                  key={feature}
                  className={`group flex items-center gap-4 transition-all duration-700 ${features2Visible.includes(index)
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-5"
                    }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Check size={16} className="text-white" strokeWidth={3} />
                  </div>
                  <span className="text-secondary text-lg">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            ref={section2ImageRef}
            className={`order-1 lg:order-2 transition-all duration-1000 delay-200 ${section2ImageVisible
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-12"
              }`}
          >
            <div className="relative">
              <div className="relative h-[480px] w-full rounded-3xl overflow-hidden shadow-2xl group">
                <Image
                  src="/section-four/delivery-man.jpg"
                  alt="Professional delivery fleet"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Overlay content */}
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-text-light mb-1">
                          Trusted by
                        </p>
                        <p className="text-2xl font-bold text-heading">
                          500+ Businesses
                        </p>
                      </div>
                      <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 border-2 border-white"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MarketingSections;
