"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Truck,
  Home,
  Package,
  Building2,
  Boxes,
  ArrowRight,
  Check,
  Sparkles,
  MapPin,
} from "lucide-react";
import {
  useScrollAnimation,
  useScrollAnimationGroup,
} from "@/hooks/useScrollAnimation";

const services = [
  {
    icon: Home,
    title: "Item Delivery",
    description:
      "Professional delivery for individual bulky items like furniture, exercise equipment, and appliances. We focus on getting your single items from A to B safely.",
    features: [
      "Furniture assembly & placement",
      "Careful handling of large items",
      "Same-day pickup available",
      "Full insurance coverage",
    ],
    color: "from-amber-400 to-orange-500",
    image: "/why-us/easy-booking.svg",
  },
  {
    icon: Building2,
    title: "Commercial Delivery",
    description:
      "Reliable business delivery solutions for offices, retail stores, and warehouses. Minimize downtime with our efficient service.",
    features: [
      "Office furniture relocation",
      "Equipment transportation",
      "After-hours scheduling",
      "Dedicated account manager",
    ],
    color: "from-blue-400 to-primary",
    image: "/why-us/bulky-deliveries.svg",
  },
  {
    icon: Package,
    title: "Single Item Delivery",
    description:
      "Perfect for when you just need one large item moved. From couches to appliances, we have got you covered.",
    features: [
      "No minimum order size",
      "Real-time tracking",
      "Photo documentation",
      "Flexible scheduling",
    ],
    color: "from-green-400 to-emerald-500",
    image: "/why-us/fastest-delivery.svg",
  },
  {
    icon: Boxes,
    title: "Bulk Transport",
    description:
      "Large-scale transportation for multiple items. Ideal for estate sales, storage moves, and business inventory.",
    features: [
      "Multiple vehicle options",
      "Coordinated logistics",
      "Loading & unloading included",
      "Competitive bulk pricing",
    ],
    color: "from-purple-400 to-purple-600",
    image: "/section-four/truck.png",
  },
];

const process = [
  {
    step: "01",
    title: "Book Online",
    description:
      "Schedule your delivery in minutes through our easy-to-use platform.",
    icon: Sparkles,
    color: "from-blue-400 to-blue-600",
  },
  {
    step: "02",
    title: "We Pick Up",
    description:
      "Our professional helpers arrive on time to carefully collect your items.",
    icon: MapPin,
    color: "from-primary to-blue-700",
  },
  {
    step: "03",
    title: "Safe Transport",
    description: "Your items are secured and transported with the utmost care.",
    icon: Truck,
    color: "from-purple-400 to-purple-600",
  },
  {
    step: "04",
    title: "Delivery",
    description:
      "We deliver to your destination and place items exactly where you want them.",
    icon: Check,
    color: "from-green-400 to-emerald-500",
  },
];

export default function ServicesPage() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { containerRef: servicesRef, visibleItems: servicesVisible } =
    useScrollAnimationGroup(services.length);
  const { containerRef: processRef, visibleItems: processVisible } =
    useScrollAnimationGroup(process.length);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] pt-28 pb-20 md:pt-32 md:pb-28 bg-gradient-to-br from-[#fafaff] via-white to-blue-50/50 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-[10%] w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-[5%] w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative">
          <div
            ref={heroRef}
            className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
          >
            {/* Content */}
            <div className="relative z-10">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 bg-white border border-primary/20 text-primary rounded-full text-sm font-semibold mb-6 shadow-sm transition-all duration-700 ${
                  heroVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-5"
                }`}
              >
                <Truck size={14} className="fill-primary" />
                Our Services
              </div>

              <h1
                className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 text-heading transition-all duration-700 delay-100 ${
                  heroVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-5"
                }`}
              >
                Delivery Solutions{" "}
                <span className="text-primary">Tailored</span> to You
              </h1>

              <p
                className={`text-lg text-text-light mb-8 max-w-xl leading-relaxed transition-all duration-700 delay-200 ${
                  heroVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-5"
                }`}
              >
                Professional delivery solutions for every need. From single
                items to full moves, we handle it all with care and precision.
              </p>

              <div
                className={`flex flex-wrap gap-4 transition-all duration-700 delay-300 ${
                  heroVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-5"
                }`}
              >
                <Link
                  href="/booking/create"
                  className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1"
                >
                  Book a Delivery
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            {/* Illustration */}
            <div
              className={`relative h-[400px] md:h-[450px] transition-all duration-700 delay-200 ${
                heroVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-10"
              }`}
            >
              <Image
                src="/images/hero-main.svg"
                alt="Bulky Delivery Services"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-gradient-to-b from-white to-[#fafaff] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />

        <div className="container-custom relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-4">
              <Home size={16} />
              What We Offer
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-heading">
              Services Built for <span className="text-primary">You</span>
            </h2>
            <p className="text-text-light text-lg max-w-2xl mx-auto">
              From individual item deliveries to commercial logistics, we have
              got every scenario covered.
            </p>
          </div>

          <div ref={servicesRef} className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div
                key={service.title}
                className={`group bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary/20 transition-all duration-500 ${
                  servicesVisible.includes(index)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-all duration-300`}
                    >
                      <service.icon
                        size={28}
                        className="text-white"
                        strokeWidth={2.5}
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-heading mb-4 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-text-light mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    <ul className="space-y-3">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Check size={12} className="text-green-600" />
                          </div>
                          <span className="text-sm text-gray-600">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="relative h-48 md:h-64">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-gradient-to-b from-[#fafaff] to-white relative overflow-hidden">
        <div className="container-custom relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-4">
              <Sparkles size={16} />
              Simple Process
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-heading">
              How It <span className="text-primary">Works</span>
            </h2>
            <p className="text-text-light text-lg max-w-2xl mx-auto">
              Get your bulky items delivered in four simple steps.
            </p>
          </div>

          <div
            ref={processRef}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          >
            {process.map((item, index) => (
              <div
                key={item.step}
                className={`group bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary/20 transition-all duration-500 hover:-translate-y-2 ${
                  processVisible.includes(index)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
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
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="bg-gradient-to-br from-primary to-blue-700 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
                <Truck size={32} className="text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-white/80 max-w-xl mx-auto mb-8 text-lg">
                Book your delivery today and experience the Bulky difference.
              </p>
              <Link
                href="/booking/create"
                className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all shadow-xl"
              >
                Book Now
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
