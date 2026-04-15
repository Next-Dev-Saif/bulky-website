"use client"

import React from "react";
import { FileText, Scale, UserCheck, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

const sections = [
  { title: "Acceptance of Terms",  icon: UserCheck,    content: "By accessing Bulky, you agree to be bound by these Terms. If you do not agree, you must not use our services." },
  { title: "Service Description",  icon: FileText,     content: "Bulky connects users with transport services for bulky items. We act as a facilitator and strive to maintain high service standards." },
  { title: "User Responsibilities",icon: AlertCircle,  content: "You must provide accurate item information. Misrepresentation of weight or dimensions may result in additional charges or cancellation." },
  { title: "Governing Law",        icon: Scale,        content: "These terms are governed by the laws of the jurisdiction where Bulky operates. You agree to the exclusive jurisdiction of courts in that region." },
];

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-gray-50 font-poppins">
      <div className="container-custom">

        <Link href="/" className="inline-flex items-center gap-2 text-text-light hover:text-primary font-bold text-sm mb-6 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-black text-secondary tracking-tight">Terms of Service</h1>
          <p className="text-sm text-text-light mt-1 font-medium">Last updated: April 13, 2026</p>
        </div>

        {/* Intro */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <p className="text-sm text-text-light font-medium leading-relaxed">
            Please read these terms carefully before using Bulky. These Terms govern your access to and use of our transport facilitation services.
          </p>
        </div>

        {/* Sections */}
        <p className="text-[11px] font-black uppercase tracking-widest text-text-light/50 mb-3 px-1">Terms Details</p>
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

        {/* Disclaimer */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
          <p className="text-xs text-text-light/60 font-medium leading-relaxed">
            <strong className="text-secondary">DISCLAIMER:</strong> THE SERVICES ARE PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. BULKY DISCLAIMS ALL REPRESENTATIONS AND WARRANTIES NOT EXPRESSLY SET OUT IN THESE TERMS.
          </p>
        </div>

      </div>
    </div>
  );
}
