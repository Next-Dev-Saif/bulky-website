"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Heart,
  Zap,
  Users,
  Coffee,
  ArrowRight,
  Star,
  Shield,
  Award,
  Building2,
  ExternalLink,
  Loader2,
  ChevronRight,
} from "lucide-react";
import {
  useScrollAnimation,
  useScrollAnimationGroup,
} from "@/hooks/useScrollAnimation";
import { collection, query, getDocs, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

const benefits = [
  {
    icon: DollarSign,
    title: "Competitive Pay",
    description:
      "Earn above-market rates with weekly payments and performance bonuses.",
    color: "from-green-400 to-emerald-500",
  },
  {
    icon: Clock,
    title: "Flexible Schedule",
    description:
      "Choose when you work. Full-time, part-time, or weekend shifts available.",
    color: "from-blue-400 to-primary",
  },
  {
    icon: Zap,
    title: "Instant Bookings",
    description:
      "Get notified of nearby jobs instantly through our mobile app.",
    color: "from-amber-400 to-orange-500",
  },
  {
    icon: Heart,
    title: "Health Benefits",
    description: "Medical, dental, and vision coverage for full-time helpers.",
    color: "from-red-400 to-rose-500",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "Join a supportive network of professional movers and drivers.",
    color: "from-purple-400 to-purple-600",
  },
  {
    icon: Coffee,
    title: "Perks & Rewards",
    description:
      "Employee discounts, referral bonuses, and recognition programs.",
    color: "from-cyan-400 to-blue-500",
  },
];

const requirements = [
  "Must be 18 years or older",
  "Valid driver's license and clean driving record",
  "Ability to lift up to 75 lbs",
  "Smartphone with data plan",
  "Pass background check",
  "Excellent customer service skills",
];

export default function CareersPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { containerRef: benefitsRef, visibleItems: benefitsVisible } =
    useScrollAnimationGroup(benefits.length);
  const { containerRef: positionsRef, visibleItems: positionsVisible } =
    useScrollAnimationGroup(jobs.length);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const q = query(
        collection(db, "jobs"),
        where("isActive", "==", true),
        orderBy("createdAt", "desc"),
      );
      const snapshot = await getDocs(q);
      const jobsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobs(jobsData);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] pt-28 pb-20 md:pt-32 md:pb-28 bg-gradient-to-br from-[#fafaff] via-white to-blue-50/50 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-[10%] w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-[5%] w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative">
          <div
            ref={heroRef}
            className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
          >
            <div className="relative z-10">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 bg-white border border-primary/20 text-primary rounded-full text-sm font-semibold mb-6 shadow-sm transition-all duration-700 ${
                  heroVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-5"
                }`}
              >
                <Star size={14} className="fill-primary" />
                Join Our Team
              </div>

              <h1
                className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 text-heading transition-all duration-700 delay-100 ${
                  heroVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-5"
                }`}
              >
                Build Your Career With{" "}
                <span className="text-primary">Bulky</span>
              </h1>

              <p
                className={`text-lg text-text-light mb-8 max-w-xl leading-relaxed transition-all duration-700 delay-200 ${
                  heroVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-5"
                }`}
              >
                Be part of a growing company that is revolutionizing the
                delivery industry. We are always looking for talented
                individuals to join our team.
              </p>

              <div
                className={`flex flex-wrap gap-4 transition-all duration-700 delay-300 ${
                  heroVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-5"
                }`}
              >
                <Link
                  href="#positions"
                  className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1"
                >
                  View Openings
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            <div
              className={`relative h-[400px] md:h-[450px] transition-all duration-700 delay-200 ${
                heroVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-10"
              }`}
            >
              <Image
                src="/images/hero-main.svg"
                alt="Join Bulky Team"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-gradient-to-b from-white to-[#fafaff] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />

        <div className="container-custom relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-4">
              <Heart size={16} />
              Why Work With Us
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-heading">
              Benefits & <span className="text-primary">Perks</span>
            </h2>
            <p className="text-text-light text-lg max-w-2xl mx-auto">
              We take care of our team so they can take care of our customers.
            </p>
          </div>

          <div
            ref={benefitsRef}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className={`group bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary/20 transition-all duration-500 ${
                  benefitsVisible.includes(index)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                >
                  <benefit.icon
                    size={24}
                    className="text-white"
                    strokeWidth={2.5}
                  />
                </div>
                <h3 className="text-xl font-bold mb-3 text-heading group-hover:text-primary transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-text-light leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section
        id="positions"
        className="section-padding bg-gradient-to-b from-[#fafaff] to-white relative overflow-hidden"
      >
        <div className="container-custom relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-4">
              <Briefcase size={16} />
              Open Positions
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-heading">
              Join Our <span className="text-primary">Team</span>
            </h2>
            <p className="text-text-light text-lg max-w-2xl mx-auto">
              Find the perfect role for your skills and career goals.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <Loader2
                size={40}
                className="animate-spin text-primary mx-auto mb-4"
              />
              <p className="text-text-light">Loading open positions...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Briefcase size={32} className="text-gray-400" />
              </div>
              <p className="text-text-light">
                No open positions at the moment.
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Check back soon for new opportunities!
              </p>
            </div>
          ) : (
            <div ref={positionsRef} className="space-y-6 max-w-4xl mx-auto">
              {jobs.map((job, index) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isVisible={positionsVisible.includes(index)}
                  delay={index * 150}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Requirements Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-4">
                <Shield size={16} />
                Requirements
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-heading">
                What We Are <span className="text-primary">Looking For</span>
              </h2>
              <p className="text-text-light mb-8 leading-relaxed">
                We are seeking motivated individuals who take pride in their
                work and are committed to providing exceptional service.
              </p>
              <ul className="space-y-4">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 text-sm font-bold">
                        {index + 1}
                      </span>
                    </div>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-primary to-blue-700 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
                  <Award size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Ready to Get Started?
                </h3>
                <p className="text-white/80 mb-8">
                  Join thousands of helpers already earning with Bulky. Apply
                  today and start working within days.
                </p>
                <Link
                  href="#positions"
                  className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all shadow-xl"
                >
                  View Openings
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// Job Card Component
function JobCard({ job, isVisible, delay }) {
  const isExternal = job.applicationType === "external";

  return (
    <div
      className={`group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary/20 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Job Image */}
      {job.imageUrl && (
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={job.imageUrl}
            alt={job.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <span
            className={`absolute top-4 right-4 inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm ${
              isExternal
                ? "bg-blue-500/90 text-white"
                : "bg-purple-500/90 text-white"
            }`}
          >
            {isExternal ? (
              <>
                <ExternalLink size={12} />
                External
              </>
            ) : (
              <>
                <Building2 size={12} />
                Internal
              </>
            )}
          </span>
        </div>
      )}

      <div className="p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-heading group-hover:text-primary transition-colors">
                {job.title}
              </h3>
              {!job.imageUrl && (
                <span
                  className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                    isExternal
                      ? "bg-blue-100 text-blue-600"
                      : "bg-purple-100 text-purple-600"
                  }`}
                >
                  {isExternal ? (
                    <>
                      <ExternalLink size={12} />
                      External
                    </>
                  ) : (
                    <>
                      <Building2 size={12} />
                      Internal
                    </>
                  )}
                </span>
              )}
            </div>
            <p className="text-text-light mb-4 line-clamp-2">
              {job.description}
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="flex items-center gap-1.5 text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                <Briefcase size={14} />
                {job.type || "Full-time"}
              </span>
              <span className="flex items-center gap-1.5 text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                <MapPin size={14} />
                {job.location || "Remote"}
              </span>
              {job.salary && (
                <span className="flex items-center gap-1.5 text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                  <DollarSign size={14} />
                  {job.salary}
                </span>
              )}
            </div>
          </div>
          {isExternal ? (
            <a
              href={job.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors whitespace-nowrap shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30"
            >
              Apply Externally
              <ExternalLink size={16} />
            </a>
          ) : (
            <Link
              href={`/careers/apply/${job.id}`}
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors whitespace-nowrap shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
            >
              Apply Now
              <ChevronRight size={16} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
