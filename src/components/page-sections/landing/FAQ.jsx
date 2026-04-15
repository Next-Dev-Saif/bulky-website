"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const faqs = [
  {
    question: "How do I book a delivery with Bulky?",
    answer:
      "Booking is simple. Enter your pickup and drop-off locations, select the appropriate vehicle size for your items, review the instant price quote, and confirm your booking. You will be matched with a verified driver within minutes.",
  },
  {
    question: "What types of items can I deliver?",
    answer:
      "Bulky specializes in large and heavy items that traditional courier services cannot handle. This includes furniture, appliances, gym equipment, large boxes, and more. We offer various vehicle sizes from vans to trucks to accommodate your needs.",
  },
  {
    question: "How is the delivery price calculated?",
    answer:
      "Our pricing is transparent and based on distance, vehicle type, and any additional services like extra helpers. You will see an instant quote before confirming your booking with no hidden fees.",
  },
  {
    question: "Can I track my delivery in real-time?",
    answer:
      "Yes. Once your driver is assigned, you can track their location on the map in real-time. You will also receive notifications at key stages: driver assigned, pickup completed, and delivery completed.",
  },
  {
    question: "Are the drivers verified?",
    answer:
      "Absolutely. All drivers on our platform go through a thorough verification process including background checks, vehicle inspections, and license validation. You can also see driver ratings and reviews from previous customers.",
  },
  {
    question: "What if I need to cancel or reschedule?",
    answer:
      "You can cancel or reschedule your booking through the app. Cancellations made within a reasonable time frame before pickup are fully refundable. Check our terms for specific cancellation windows.",
  },
];

const FAQItem = ({ faq, isOpen, onClick, index }) => {
  return (
    <div
      className={cn(
        "group border rounded-2xl overflow-hidden mb-4 transition-all duration-500",
        isOpen
          ? "border-primary/30 shadow-lg shadow-primary/5 bg-white"
          : "border-gray-200 hover:border-primary/20 hover:shadow-md bg-white",
      )}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-5 md:p-6 text-left transition-colors"
      >
        <div className="flex items-center gap-4">
          <span
            className={cn(
              "text-lg font-semibold transition-colors",
              isOpen ? "text-primary" : "text-heading",
            )}
          >
            {faq.question}
          </span>
        </div>
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
            isOpen
              ? "bg-primary text-white rotate-180"
              : "bg-gray-100 text-gray-500",
          )}
        >
          <ChevronDown size={18} />
        </div>
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-500 ease-in-out",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="px-6 pb-6 pt-0">
          <div className=" border-t border-gray-100 pt-4">
            <p className="text-text-light leading-relaxed">{faq.answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();

  return (
    <section className="section-padding bg-gradient-to-b from-[#f7f7f7] to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />

      <div className="container-custom relative">
        <div ref={headerRef} className="text-center mb-16">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-4 transition-all duration-700 ${
              headerVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-5"
            }`}
          >
            <HelpCircle size={16} />
            Got Questions?
          </div>
          <h2
            className={`text-3xl md:text-5xl font-bold mb-4 text-heading transition-all duration-700 delay-100 ${
              headerVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-5"
            }`}
          >
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p
            className={`text-text-light text-lg max-w-2xl mx-auto transition-all duration-700 delay-200 ${
              headerVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-5"
            }`}
          >
            Everything you need to know about our delivery service. Can not find
            what you are looking for?
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-x-6">
          <div>
            {faqs.slice(0, 3).map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                index={index}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              />
            ))}
          </div>
          <div>
            {faqs.slice(3).map((faq, index) => (
              <FAQItem
                key={index + 3}
                faq={faq}
                index={index + 3}
                isOpen={openIndex === index + 3}
                onClick={() =>
                  setOpenIndex(openIndex === index + 3 ? -1 : index + 3)
                }
              />
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-wrap md:justify-between justify-center items-center gap-4 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-blue-600 md:flex hidden items-center justify-center">
              <MessageCircle size={28} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-heading font-semibold">
                Still have questions?
              </p>
              <p className="text-text-light text-sm">
                Our team is here to help
              </p>
            </div>
            <button className="ml-4 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
