"use client";

import React, { useState } from "react";
import InputField from "@/core-components/InputField";
import Button from "@/core-components/Button";
import { User, Mail, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    // Add success toast or transition here later
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-white p-2"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Your Name"
          placeholder="Enter Name"
          variant="outlined"
          icon={User}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <InputField
          label="Email"
          type="email"
          placeholder="Enter Email"
          variant="outlined"
          icon={Mail}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-heading">Message</label>
          <div className="relative group">
            <textarea
              placeholder="Message...."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              rows={4}
              className="w-full border border-gray-300 focus:border-primary rounded-xl py-3 px-4 bg-white transition-all duration-300 outline-none resize-none placeholder:text-gray-400 text-secondary"
            ></textarea>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full md:w-auto px-12 py-4 rounded-full text-lg shadow-lg hover:shadow-primary/25 transition-all"
        >
          Send Message
        </Button>
      </form>
    </motion.div>
  );
};

export default ContactForm;
