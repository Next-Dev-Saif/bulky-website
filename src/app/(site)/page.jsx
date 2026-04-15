import React from "react";
import Hero from "@/components/page-sections/landing/Hero";
import WhyChooseUs from "@/components/page-sections/landing/WhyChooseUs";
import HowItWorks from "@/components/page-sections/landing/HowItWorks";
import MarketingSections from "@/components/page-sections/landing/MarketingSections";
import AppDownload from "@/components/page-sections/landing/AppDownload";
import FAQ from "@/components/page-sections/landing/FAQ";
import ContactCTA from "@/components/page-sections/landing/ContactCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <WhyChooseUs />
      <HowItWorks />
      <MarketingSections />
      <AppDownload />
      <FAQ />
      <ContactCTA />
    </>
  );
}
