"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/core-components/Button";
import { ChevronRight, Truck, Clock, Shield, Star } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const stats = [
  { icon: Truck, value: "10K+", label: "Deliveries" },
  { icon: Star, value: "4.9", label: "Rating" },
  { icon: Clock, value: "24/7", label: "Support" },
];

const ContactCTA = () => {
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation();

  return (
    <section className="relative min-h-[500px] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/section-six/background.png"
          alt="Contact CTA Background"
          fill
          className="object-cover scale-105 group-hover:scale-100 transition-transform duration-[2000ms]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/85 to-secondary/70" />

        {/* Animated gradient overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-blue-600/20 animate-pulse"
          style={{ animationDuration: "4s" }}
        />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 border border-white/10 rounded-full" />
      <div className="absolute bottom-10 right-10 w-48 h-48 border border-white/10 rounded-full" />
      <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-primary rounded-full animate-ping" />
      <div
        className="absolute top-1/3 right-1/3 w-2 h-2 bg-white/50 rounded-full animate-ping"
        style={{ animationDelay: "1s" }}
      />

      <div className="container-custom relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div
            ref={contentRef}
            className={`transition-all duration-1000 ${
              contentVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-12"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-semibold mb-6 border border-white/20">
              <Shield size={16} />
              Trusted by 10,000+ customers
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to Move Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">
                Bulk
              </span>{" "}
              Today?
            </h2>

            <p className="text-white/70 text-lg mb-10 max-w-xl">
              Join thousands of satisfied customers who trust Bulky for their
              toughest delivery challenges. Get started in minutes.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/booking/create">
                <Button
                  variant="primary"
                  size="lg"
                  className="group px-8 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300"
                >
                  Book Your Delivery
                  <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 px-8"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Stats cards */}
          <div className="hidden lg:grid grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center transition-all duration-700 hover:bg-white/20 hover:scale-105 ${
                  contentVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <stat.icon size={24} className="text-white" />
                </div>
                <p className="text-3xl font-bold text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-white/60 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom trust badges */}
        <div
          className={`mt-16 pt-8 border-t border-white/10 transition-all duration-1000 delay-500 ${
            contentVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex flex-wrap items-center justify-center gap-8 text-white/50 text-sm">
            <span className="flex items-center gap-2">
              <Shield size={16} /> Secure Payments
            </span>
            <span className="flex items-center gap-2">
              <Clock size={16} /> 24/7 Support
            </span>
            <span className="flex items-center gap-2">
              <Star size={16} /> Rated 4.9/5
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
