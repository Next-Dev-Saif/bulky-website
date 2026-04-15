"use client"

import React from "react";
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

const sections = [
  { title: "Data We Collect",    icon: Eye,         content: "We collect information you provide when creating an account (name, email, phone, profile picture) and location data to facilitate pickups and deliveries." },
  { title: "How We Use Data",   icon: FileText,     content: "Your information is used to provide and improve our services, process transactions, send booking notifications, and ensure user safety." },
  { title: "Data Security",     icon: Lock,         content: "We use industry-standard encryption and secure server configurations to protect your personal information from unauthorized access or disclosure." },
  { title: "Your Rights",       icon: ShieldCheck,  content: "You can access, update, or delete your personal data at any time through account settings or by contacting our support team." },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-gray-50 font-poppins">
      <div className="container-custom">

        <Link href="/" className="inline-flex items-center gap-2 text-text-light hover:text-primary font-bold text-sm mb-6 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-black text-secondary tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-text-light mt-1 font-medium">Last updated: April 13, 2026</p>
        </div>

        {/* Intro */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <p className="text-sm text-text-light font-medium leading-relaxed">
            At Bulky, your privacy matters. This policy explains how we collect, use, and protect your information when you use our platform. By using our services, you agree to this policy.
          </p>
        </div>

        {/* Sections */}
        <p className="text-[11px] font-black uppercase tracking-widest text-text-light/50 mb-3 px-1">Policy Details</p>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50 mb-8">
          {sections.map((s, i) => (
            <div key={i} className="px-6 py-5 flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <s.icon size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-secondary mb-1">{s.title}</p>
                <p className="text-sm text-text-light font-medium leading-relaxed">{s.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4">
          <p className="text-sm text-text-light font-medium">
            Questions? Contact us at{" "}
            <a href="mailto:privacy@bulky.app" className="text-primary font-bold hover:underline">privacy@bulky.app</a>
          </p>
        </div>

      </div>
    </div>
  );
}
