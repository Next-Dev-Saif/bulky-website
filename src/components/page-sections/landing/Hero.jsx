"use client";

import React from "react";
import Image from "next/image";
import Button from "@/core-components/Button";
import { Play, Truck, Clock, Shield, ArrowRight, Star } from "lucide-react";
import Link from "next/link";

const stats = [
  { icon: Truck, value: "10K+", label: "Deliveries" },
  { icon: Clock, value: "30min", label: "Pickup Time" },
  { icon: Shield, value: "100%", label: "Secure" },
];

const Hero = () => {
  return (
    <section className="relative min-h-screen pt-28 pb-20 md:pt-32 md:pb-28 bg-gradient-to-br from-[#fafaff] via-white to-blue-50/50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating circles */}
        <div className="absolute top-20 right-[10%] w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-[5%] w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-float delay-500" />
        <div className="absolute top-1/2 right-[20%] w-48 h-48 bg-primary/10 rounded-full blur-2xl animate-float delay-300" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#0109c8 1px, transparent 1px), linear-gradient(90deg, #0109c8 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="container-custom relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[calc(100vh-200px)]">
          {/* Content */}
          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-primary/20 text-primary rounded-full text-sm font-semibold mb-6 animate-bounce-in-up shadow-sm">
              <Star size={14} className="fill-primary" />
              Trusted by 10,000+ customers
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 text-heading animate-elastic-left">
              Move Anything,{" "}
              <span className="relative inline-block">
                <span className="text-primary">Anywhere</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                >
                  <path
                    d="M2 10C50 2 150 2 198 10"
                    stroke="#0109c8"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="animate-draw-line"
                  />
                </svg>
              </span>
              , Anytime
            </h1>

            {/* Description */}
            <p className="text-lg text-text-light mb-8 max-w-xl leading-relaxed animate-bounce-in-up delay-200">
              From furniture to appliances, Bulky connects you with verified
              drivers for fast, secure, and affordable bulky item delivery.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-12 animate-bounce-in-up delay-300">
              <Link href="/booking/create">
                <Button
                  variant="primary"
                  size="lg"
                  className="group shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-1"
                >
                  Book a Delivery
                  <ArrowRight
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                    size={18}
                  />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="group bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Play
                    size={14}
                    className="fill-primary group-hover:fill-white transition-colors"
                  />
                </div>
                See How It Works
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 animate-bounce-in-up delay-400">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="group flex items-center gap-3 bg-white/80 backdrop-blur-sm px-5 py-3 rounded-2xl border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                  style={{ animationDelay: `${400 + index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5  md:flex hidden items-center justify-center group-hover:scale-110 transition-transform">
                    <stat.icon
                      size={22}
                      className="text-primary "
                      strokeWidth={2}
                    />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-heading">
                      {stat.value}
                    </p>
                    <p className="text-sm text-text-light">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Illustration */}
          <div className="relative h-[400px] md:h-[550px] animate-elastic-right">
            {/* Decorative ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-[90%] h-[90%] border-2 border-dashed border-primary/10 rounded-full animate-spin"
                style={{ animationDuration: "30s" }}
              />
            </div>

            {/* Floating elements */}
            <div className="absolute top-10 right-10 bg-white rounded-2xl p-4 shadow-xl animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Truck size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-heading">
                    On the way
                  </p>
                  <p className="text-xs text-text-light">2 mins away</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-20 left-0 bg-white rounded-2xl p-4 shadow-xl animate-float delay-500">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-600 border-2 border-white"
                    />
                  ))}
                </div>
                <p className="text-sm font-semibold text-heading">
                  500+ Drivers
                </p>
              </div>
            </div>

            <Image
              src="/images/hero-main.svg"
              alt="Bulky Delivery Service"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
