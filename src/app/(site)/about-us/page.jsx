"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Truck,
  Shield,
  Clock,
  Users,
  Award,
  Heart,
  Sparkles,
  ArrowRight,
  Star,
  MapPin,
} from "lucide-react";
import {
  useScrollAnimation,
  useScrollAnimationGroup,
} from "@/hooks/useScrollAnimation";

const stats = [
  { icon: Truck, value: "50K+", label: "Deliveries Completed" },
  { icon: Star, value: "99%", label: "Customer Satisfaction" },
  { icon: Users, value: "500+", label: "Professional Helpers" },
  { icon: Clock, value: "24/7", label: "Customer Support" },
];

const values = [
  {
    icon: Shield,
    title: "Trust & Safety",
    description:
      "Your belongings are in safe hands. We thoroughly vet all our helpers and provide insurance coverage.",
    color: "from-green-400 to-emerald-500",
  },
  {
    icon: Clock,
    title: "Punctuality",
    description:
      "We value your time. Our team ensures on-time pickups and deliveries, every single time.",
    color: "from-blue-400 to-primary",
  },
  {
    icon: Users,
    title: "Customer First",
    description:
      "Your satisfaction is our priority. We're here to make your moving experience seamless.",
    color: "from-purple-400 to-purple-600",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "We strive for excellence in every delivery, ensuring your items arrive in perfect condition.",
    color: "from-amber-400 to-orange-500",
  },
];

export default function AboutUsPage() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: storyRef, isVisible: storyVisible } = useScrollAnimation();
  const { containerRef: valuesRef, visibleItems: valuesVisible } =
    useScrollAnimationGroup(values.length);

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
                <Sparkles size={14} className="fill-primary" />
                About Bulky
              </div>

              <h1
                className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 text-heading transition-all duration-700 delay-100 ${
                  heroVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-5"
                }`}
              >
                Delivering <span className="text-primary">Excellence</span>, One
                Move at a Time
              </h1>

              <p
                className={`text-lg text-text-light mb-8 max-w-xl leading-relaxed transition-all duration-700 delay-200 ${
                  heroVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-5"
                }`}
              >
                We are on a mission to revolutionize bulky item delivery, making
                it simple, reliable, and stress-free for everyone.
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
                alt="Bulky Delivery Service"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-700" />
        <div className="container-custom relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center group">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-colors">
                  <stat.icon size={28} className="text-white" strokeWidth={2} />
                </div>
                <p className="text-3xl md:text-4xl font-black text-white mb-2">
                  {stat.value}
                </p>
                <p className="text-white/80 text-sm font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-gradient-to-b from-white to-[#fafaff] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />

        <div className="container-custom relative">
          <div
            ref={storyRef}
            className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center"
          >
            <div
              className={`transition-all duration-700 ${
                storyVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-4">
                <MapPin size={16} />
                Our Story
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-heading">
                Built on Trust,{" "}
                <span className="text-primary">Powered by People</span>
              </h2>
              <div className="space-y-4 text-text-light leading-relaxed">
                <p>
                  Bulky was founded in 2020 with a simple idea: moving bulky
                  items should not be a headache. We saw how difficult it was
                  for people to transport large furniture, appliances, and
                  equipment, and we knew there had to be a better way.
                </p>
                <p>
                  What started as a small local service has grown into a trusted
                  delivery platform serving thousands of customers. Our team of
                  professional helpers and state-of-the-art logistics technology
                  ensure that every delivery is handled with care.
                </p>
                <p>
                  Today, we are proud to be the go-to solution for individuals
                  and businesses who need reliable bulky item delivery services.
                </p>
              </div>
            </div>

            <div
              className={`relative transition-all duration-700 delay-200 ${
                storyVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-10"
              }`}
            >
              <div className="relative h-[400px] md:h-[500px]">
                <Image
                  src="/why-us/bulky-deliveries.svg"
                  alt="Our Delivery Fleet"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-gradient-to-b from-[#fafaff] to-white relative overflow-hidden">
        <div className="container-custom relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-4">
              <Award size={16} />
              Our Values
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-heading">
              What We <span className="text-primary">Stand For</span>
            </h2>
            <p className="text-text-light text-lg max-w-2xl mx-auto">
              The principles that guide everything we do at Bulky.
            </p>
          </div>

          <div
            ref={valuesRef}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          >
            {values.map((value, index) => (
              <div
                key={value.title}
                className={`group relative bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary/20 transition-all duration-500 ${
                  valuesVisible.includes(index)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                >
                  <value.icon
                    size={24}
                    className="text-white"
                    strokeWidth={2.5}
                  />
                </div>

                <h3 className="text-xl font-bold mb-3 text-heading group-hover:text-primary transition-colors">
                  {value.title}
                </h3>
                <p className="text-text-light leading-relaxed">
                  {value.description}
                </p>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-3xl" />
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
                <Heart size={32} className="text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Ready to Move?
              </h2>
              <p className="text-white/80 max-w-xl mx-auto mb-8 text-lg">
                Join thousands of satisfied customers who trust Bulky for their
                delivery needs. Get started today!
              </p>
              <Link
                href="/booking/create"
                className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all shadow-xl"
              >
                Get Started
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
