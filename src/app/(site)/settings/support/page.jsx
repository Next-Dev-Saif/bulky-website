"use client"

import React, { useState } from "react";
import {
  ArrowLeft, Mail, Phone, MessageSquare,
  ChevronRight, HelpCircle, ExternalLink
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const faqs = [
  { q: "How do I track my booking?",       a: "Once confirmed, track your booking in real-time from your Dashboard under 'My Bookings'. You'll also receive notifications for every status update." },
  { q: "What items can I transport?",        a: "Bulky supports large items — furniture, appliances, construction materials, motorcycles, and more. See the full list when creating a booking." },
  { q: "How do I cancel a booking?",         a: "From the Booking Detail page. Note: cancellations less than 1 hour before the scheduled time may incur a fee." },
  { q: "How is pricing calculated?",         a: "Based on item type, size, distance, and service level. You always see the final price before confirming." },
  { q: "Is my payment secure?",              a: "Yes. All payments go through Stripe — PCI-DSS Level 1 certified, the highest certification in the payments industry." },
];

export default function CustomerSupportPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const channels = [
    { icon: Mail,           title: "Email",       desc: "support@bulky.app",      href: "mailto:support@bulky.app", badge: "Replies in 24h" },
    { icon: MessageSquare,  title: "Live Chat",   desc: "Chat with our team",      href: "/dashboard/chat",          badge: "9am – 6pm" },
    { icon: Phone,          title: "Phone",        desc: "+1 (800) BULKY-01",      href: "tel:+18002855901",         badge: "Mon–Fri 9am–6pm" },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 bg-gray-50 font-poppins">
      <div className="container-custom">

        <Link href="/settings" className="inline-flex items-center gap-2 text-text-light hover:text-primary font-bold text-sm mb-6 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Settings
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-black text-secondary tracking-tight">Customer Support</h1>
          <p className="text-sm text-text-light mt-1 font-medium">We're here to help</p>
        </div>

        {/* Contact channels */}
        <p className="text-[11px] font-black uppercase tracking-widest text-text-light/50 mb-3 px-1">Contact Us</p>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50 mb-8">
          {channels.map((ch, i) => (
            <a
              key={i}
              href={ch.href}
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/70 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <ch.icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-secondary">{ch.title}</p>
                  <p className="text-xs text-text-light font-medium">{ch.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:block text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {ch.badge}
                </span>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-400" />
              </div>
            </a>
          ))}
        </div>

        {/* FAQs */}
        <p className="text-[11px] font-black uppercase tracking-widest text-text-light/50 mb-3 px-1">Frequently Asked</p>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50 mb-8">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50/70 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <HelpCircle size={16} className="text-gray-300 shrink-0" />
                  <span className="text-sm font-semibold text-secondary">{faq.q}</span>
                </div>
                <motion.div
                  animate={{ rotate: openFaq === i ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight size={16} className="text-gray-300 shrink-0 ml-4" />
                </motion.div>
              </button>
              <motion.div
                initial={false}
                animate={{ height: openFaq === i ? "auto" : 0, opacity: openFaq === i ? 1 : 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="px-6 pb-4 pl-14 text-sm text-text-light font-medium leading-relaxed">{faq.a}</p>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Help Centre */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 flex items-center justify-between hover:bg-gray-50/70 transition-colors cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center">
              <HelpCircle size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-secondary">Help Centre</p>
              <p className="text-xs text-text-light font-medium">Full guides and documentation</p>
            </div>
          </div>
          <ExternalLink size={16} className="text-gray-300" />
        </div>

      </div>
    </div>
  );
}
