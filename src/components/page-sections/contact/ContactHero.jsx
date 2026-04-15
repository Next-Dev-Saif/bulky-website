"use client";

import React from "react";
import { motion } from "framer-motion";

const ContactHero = () => {
  return (
    <section className="pt-32 pb-16 bg-white">
      <div className="container-custom text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1A1A1A] mb-8"
        >
          Contact Us
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg md:text-xl text-[#525558] max-w-4xl mx-auto leading-relaxed"
        >
          Have questions about moving bulky items? Whether you're a business looking for logistics solutions 
          or an individual needing a one-time move, our team is here to help you every step of the way.
        </motion.p>
      </div>
    </section>
  );
};

export default ContactHero;
