"use client";

import React, { useEffect, useState } from "react";

export default function PrivacyPolicy() {
  const [animate, setAnimate] = useState(false);

  // Trigger animation on page load
  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className="container mx-auto py-16 px-6 lg:px-20">
      {/* Title Section */}
      <h1
        className={`text-4xl font-extrabold text-center mb-6 text-primary transition-all duration-1000 ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        Privacy Policy
      </h1>
      <p
        className={`text-center text-zinc-600 text-sm transition-all duration-1000 delay-200 ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        Last updated: January 30, 2025
      </p>

      {/* Content Section */}
      <div
        className={`mt-10 transition-all duration-1000 delay-300 ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Introduction */}
        <h2 className="text-xl font-semibold mt-8 text-primary">Introduction</h2>
        <p className="mt-2 text-zinc-900 leading-relaxed">
          This Privacy Policy explains how Calendaire ("we," "us," or "our") collects,
          uses, and shares your personal information when you visit or use our website.
          We are committed to protecting your privacy and ensuring that your personal
          data is handled securely and responsibly.
        </p>

        {/* Data We Collect */}
        <h2 className="text-xl font-semibold mt-8 text-primary">Data We Collect</h2>
        <ul className="list-disc ml-6 mt-2 text-zinc-900 leading-relaxed">
          <li>Personal information such as name, email address, and phone number.</li>
          <li>Usage data such as IP address, browser type, and pages visited.</li>
          <li>Payment details for transactions (if applicable).</li>
          <li>Cookies and similar tracking technologies.</li>
        </ul>

        {/* How We Collect Data */}
        <h2 className="text-xl font-semibold mt-8 text-primary">How We Collect Data</h2>
        <p className="mt-2 text-zinc-900 leading-relaxed">
          We collect data through various methods:
        </p>
        <ul className="list-disc ml-6 mt-2 text-zinc-900 leading-relaxed">
          <li>When you fill out forms on our website (e.g., contact forms).</li>
          <li>Automatically through cookies and tracking technologies.</li>
          <li>When you interact with our customer support team.</li>
          <li>When you make a purchase or subscribe to our services.</li>
        </ul>

        {/* How We Use Your Information */}
        <h2 className="text-xl font-semibold mt-8 text-primary">How We Use Your Information</h2>
        <p className="mt-2 text-zinc-900 leading-relaxed">We use your information to:</p>
        <ul className="list-disc ml-6 mt-2 text-zinc-900 leading-relaxed">
          <li>Provide and improve our services.</li>
          <li>Communicate with you about updates, offers, and promotions.</li>
          <li>Process transactions securely.</li>
          <li>Comply with legal obligations.</li>
        </ul>

        {/* Cookies and Tracking Technologies */}
        <h2 className="text-xl font-semibold mt-8 text-primary">
          Cookies and Tracking Technologies
        </h2>
        <p className="mt-2 text-zinc-900 leading-relaxed">
          Our website uses cookies to enhance your browsing experience. Cookies are small
          files stored on your device that help us analyze website traffic, remember your
          preferences, and provide personalized content. You can manage or disable cookies
          through your browser settings.
        </p>

        {/* Data Sharing */}
        <h2 className="text-xl font-semibold mt-8 text-primary">Data Sharing</h2>
        <p className="mt-2 text-zinc-900 leading-relaxed">
          We may share your data with trusted third-party service providers who assist us in operating our website. These include:
        </p>
        <ul className="list-disc ml-6 mt-2 text-zinc-900 leading-relaxed">
          <li>Payment processors for secure transactions.</li>
          <li>Email marketing platforms for sending newsletters.</li>
          <li>Analytics tools to monitor website performance.</li>
          <li>Legal authorities if required by law.</li>
        </ul>

        {/* Data Protection */}
        <h2 className="text-xl font-semibold mt-8 text-primary">Data Protection</h2>
        <p className="mt-2 text-zinc-900 leading-relaxed">
          We implement industry-standard security measures to protect your personal data from unauthorized access, disclosure, or misuse. These measures include encryption, firewalls, and secure servers.
        </p>

        {/* Your Rights */}
        <h2 className="text-xl font-semibold mt-8 text-primary">Your Rights</h2>
        <p className="mt-2 text-zinc-900 leading-relaxed">You have the right to:</p>
        <ul className="list-disc ml-6 mt-2 text-zinc-900 leading-relaxed">
          <li>Access, update, or delete your personal data at any time.</li>
          <li>Opt-out of receiving marketing communications.</li>
          <li>Withdraw consent for data processing where applicable.</li>
          <li>Lodge a complaint with a data protection authority if needed.</li>
        </ul>

        {/* Data Retention */}
        <h2 className="text-xl font-semibold mt-8 text-primary">Data Retention</h2>
        <p className="mt-2 text-zinc-900 leading-relaxed">
          We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy or comply with legal obligations. Once the retention period expires, we securely delete or anonymize your data.
        </p>

        {/* Contact Us */}
        <h2 className="text-xl font-semibold mt-8 text-primary">Contact Us</h2>
        <p className="mt-2 text-zinc-900 leading-relaxed">
          If you have any questions about this Privacy Policy or wish to exercise your rights,
          please contact us at{" "}
          <a href="mailto:hrs150203@gmail.com" className="text-zinc-1000 hover:underline">
            hrs150203@gmail.com
          </a>.
        </p>

      </div>
    </div>
  );
}
