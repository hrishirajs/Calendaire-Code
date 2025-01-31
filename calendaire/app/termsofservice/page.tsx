"use client";

import React, { useEffect, useState } from "react";

export default function TermsOfService() {
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
        Terms of Service
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
          These Terms of Service ("Terms") govern your use of the Calendaire website and services ("Service"). By accessing or using our Service, you agree to comply with these Terms. If you do not agree, you may not use our Service.
        </p>

        {/* User Guidelines */}
        <h2 className="text-xl font-semibold mt-8 text-primary">User Guidelines</h2>
        <ul className="list-disc ml-6 mt-2 text-zinc-900 leading-relaxed">
         
          <li>You agree not to misuse the Service or violate any applicable laws.</li>
          <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
          <li>Do not engage in activities that harm the platform or other users.</li>
        </ul>

        {/* User Accounts */}
        <h2 className="text-xl font-semibold mt-8 text-primary">User Accounts</h2>
        <p className="mt-2 text-zinc-900 leading-relaxed">
          To access certain features of our Service, you may need to create an account. You are responsible for providing accurate and complete information during registration. We reserve the right to suspend or terminate accounts that violate these Terms.
        </p>

        {/* Intellectual Property */}
        <h2 className="text-xl font-semibold mt-8 text-primary">Intellectual Property</h2>
        <p className="mt-2 text-zinc-900 leading-relaxed">
          All content on this website, including text, graphics, logos, and software, is the property of Calendaire or its licensors and is protected by copyright and trademark laws. You may not reproduce, distribute, or create derivative works without prior written permission.
        </p>

        {/* Limitation of Liability */}
        <h2 className="text-xl font-semibold mt-8 text-primary">Limitation of Liability</h2>
        <p className="mt-2 text-zinc-900 leading-relaxed">
          Calendaire is not liable for any indirect, incidental, or consequential damages arising from your use of the Service. Our total liability is limited to the amount paid by you for the Service.
        </p>

        {/* Warranty Disclaimer */}
        <h2 className="text-xl font-semibold mt-8 text-primary">Warranty Disclaimer</h2>
        <p className="mt-2 text-zinc-900 leading-relaxed">
          The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind. We do not guarantee that the Service will be uninterrupted or error-free.
        </p>

        {/* Governing Law */}
        <h2 className="text-xl font-semibold mt-8 text-primary">Governing Law</h2>
        <p className="mt-2 text-zinc-900 leading-relaxed">
          These Terms are governed by and construed in accordance with the laws of India. Any disputes arising from these Terms will be resolved exclusively in the courts located in [Your Jurisdiction].
        </p>

        {/* Changes to These Terms */}
        <h2 className="text-xl font-semibold mt-8 text-primary">Changes to These Terms</h2>
        <p className="mt-2 text-zinc-900 leading-relaxed">
          We reserve the right to update these Terms at any time. Continued use of the Service after changes are made constitutes acceptance of the updated Terms.
        </p>

        {/* Contact Us */}
        <h2 className="text-xl font-semibold mt-8 text-primary">Contact Us</h2>
        <p className="mt-2 text-zinc-900 leading-relaxed">
          If you have any questions about these Terms, please contact us at{" "}
          <a href="mailto:hrs150203@gmail.com" className="text-zinc-1000 hover:underline">
            hrs150203@gmail.com
          </a>.
        </p>
      </div>
    </div>
  );
}
