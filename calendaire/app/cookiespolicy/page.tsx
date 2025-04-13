"use client";

import React, { useEffect, useState } from "react";

export default function CookiesPolicy() {
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
        Cookie Policy
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
          This Cookie Policy explains how Calendaire (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) uses cookies and similar tracking technologies on our website. By using our website, you agree to the use of cookies as described in this policy.
        </p>

        {/* What Are Cookies? */}
        <h2 className="text-xl font-semibold mt-8 text-primary">What Are Cookies?</h2>
        <p className="mt-2 text-zinc-900 leading-relaxed">
          Cookies are small text files stored on your device when you visit a website. They help us enhance your browsing experience by remembering your preferences and providing personalized content.
        </p>

        {/* Types of Cookies We Use */}
        <h2 className="text-xl font-semibold mt-8 text-primary">Types of Cookies We Use</h2>
        <ul className="list-disc ml-6 mt-2 text-zinc-900 leading-relaxed">
          <li>
            <strong>Essential Cookies:</strong> These cookies are necessary for the basic functionality of our website, such as enabling secure logins and remembering your session.
          </li>
          <li>
            <strong>Performance Cookies:</strong> These cookies collect information about how you interact with our website, helping us improve its performance and usability.
          </li>
          <li>
            <strong>Functional Cookies:</strong> These cookies remember your preferences and settings to provide a more personalized experience.
          </li>
          <li>
            <strong>Marketing Cookies:</strong> These cookies track your browsing behavior to deliver targeted advertisements and measure the effectiveness of our marketing campaigns.
          </li>
        </ul>

        {/* How We Use Cookies */}
        <h2 className="text-xl font-semibold mt-8 text-primary">How We Use Cookies</h2>
        <p className="mt-2 text-zinc-900 leading-relaxed">
          We use cookies to:
        </p>
        <ul className="list-disc ml-6 mt-2 text-zinc-900 leading-relaxed">
          <li>Ensure the proper functioning of our website.</li>
          <li>Analyze website traffic and user behavior.</li>
          <li>Remember your preferences and settings.</li>
          <li>Provide relevant advertisements based on your interests.</li>
        </ul>

        {/* Managing Your Cookie Preferences */}
        <h2 className="text-xl font-semibold mt-8 text-primary">Managing Your Cookie Preferences</h2>
        <p className="mt-2 text-zinc-900 leading-relaxed">
          You can manage or disable cookies through your browser settings. Please note that disabling certain cookies may affect the functionality of our website. For more information on managing cookies, refer to your browser&apos;s help documentation:
        </p>
        <ul className="list-disc ml-6 mt-2 text-zinc-900 leading-relaxed">
          <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-zinc-1000 hover:underline">Google Chrome</a></li>
          <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies" target="_blank" rel="noopener noreferrer" className="text-zinc-1000 hover:underline">Mozilla Firefox</a></li>
          <li><a href="https://support.apple.com/en-us/HT201265" target="_blank" rel="noopener noreferrer" className="text-zinc-1000 hover:underline">Safari</a></li>
          <li><a href="https://support.microsoft.com/en-us/topic/delete-and-manage-cookies-df4f3cd0-bd4e-b9af-f93e-fb9ac5e303a3" target="_blank" rel="noopener noreferrer" className="text-zinc-1000 hover:underline">Microsoft Edge</a></li>
        </ul>

        {/* Third-party Cookies */}
        <h2 className="text-xl font-semibold mt-8 text-primary">Third-party Cookies</h2>
        <p className="mt-2 text-zinc-900 leading-relaxed">
          Our website may include third-party services (e.g., analytics tools or advertising platforms) that use their own cookies. We do not control these third-party cookies. Please refer to their respective privacy policies for more information.
        </p>

        {/* Changes to This Policy */}
        <h2 className="text-xl font-semibold mt-8 text-primary">Changes to This Policy</h2>
        <p className="mt-2 text-zinc-900 leading-relaxed">
          We may update this Cookie Policy from time to time to reflect changes in technology, legal requirements, or our practices. We encourage you to review this policy periodically for any updates.
        </p>

        {/* Contact Us */}
        <h2 className="text-xl font-semibold mt-8 text-primary">Contact Us</h2>
        <p className="mt-2 text-zinc-900 leading-relaxed">
          If you have any questions about this Cookie Policy or how we use cookies, please contact us at{" "}
          <a href="mailto:hrs150203@gmail.com" className="text-zinc-1000 hover:underline">
            hrs150203@gmail.com
          </a>.
        </p>

      </div>
    </div>
  );
}
