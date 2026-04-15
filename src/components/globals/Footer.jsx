"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { cn } from "@/utils/cn";

const Footer = () => {
  const socialIcons = [
    { name: "facebook", src: "/icons/social/facebook.png", href: "#" },
    { name: "twitter", src: "/icons/social/twitter.png", href: "#" },
    { name: "instagram", src: "/icons/social/instagram.png", href: "#" },
    { name: "linkedin", src: "/icons/social/linkedin.png", href: "#" },
  ];

  return (
    <footer className="bg-white border-t border-gray-100">
      {/* Upper Footer: Newsletter */}
      <div className="bg-keep-touch-bg py-12">
        <div className="container-custom flex-wrap  flex flex-col md:flex-row items-center md:justify-between justify-center gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-2">Keep in touch</h3>
            <p className="text-text-light">
              Get the latest news and updates from Bulky.
            </p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start w-full md:w-auto max-w-md md:gap-2 gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-primary transition-colors"
            />
            <button className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-16 md:py-24 container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand & Social */}
          <div className="space-y-6">
            <Link href="/" className="relative h-10 w-32 block">
              <Image
                src="/logos/footer.png"
                alt="Bulky Logo"
                fill
                className="object-contain"
              />
            </Link>
            <p className="text-text-light leading-relaxed">
              We provide the most reliable and efficient delivery solutions for
              all your bulky transportation needs.
            </p>
            <div className="flex gap-4">
              {socialIcons.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-grey-bg hover:bg-primary transition-all p-2 group"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={social.src}
                      alt={social.name}
                      fill
                      className="object-contain filter grayscale group-hover:grayscale-0 group-hover:invert transition-all"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-8">Company</h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/about-us"
                  className="text-text-light hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-text-light hover:text-primary transition-colors"
                >
                  Our Services
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-text-light hover:text-primary transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-text-light hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-bold mb-8">Legal</h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-text-light hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-text-light hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/settings/support"
                  className="text-text-light hover:text-primary transition-colors"
                >
                  Customer Support
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="text-text-light hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold mb-8">Get In Touch</h4>
            <div className="flex items-start gap-3">
              <Phone className="text-primary mt-1" size={20} />
              <div className="text-text-light">
                <p>+1 (555) 000-0000</p>
                <p className="text-sm">Mon - Fri, 9am - 6pm</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="text-primary mt-1" size={20} />
              <p className="text-text-light">support@bulky.com</p>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="text-primary mt-1" size={20} />
              <p className="text-text-light">
                123 Logistics Way, Suite 100, San Francisco, CA
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-100 py-8">
        <div className="container-custom flex flex-col md:flex-row justify-between items-center gap-4 text-text-light text-sm">
          <p>© 2024 Bulky. All rights reserved.</p>
          <div className="flex gap-6">
            <Link
              href="/privacy-policy"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
