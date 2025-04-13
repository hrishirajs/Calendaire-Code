'use client';
import React from 'react';
import Image from "next/image";

export default function FeaturesSection() {
  return (
    <section id="features" className="relative bg-gradient-to-r from-gray-900 via-black to-gray-800 py-24 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-white mb-4">With us, scheduling is easy</h2>
          <p className="text-xl text-gray-300">Effortless scheduling for individuals, powerful solutions for fast-growing modern companies.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Connect your calendar",
              description: "We'll handle all the cross-referencing, so you don't have to worry about double bookings.",
              icon: "/icons/insights.svg",
              number: "01"
            },
            {
              title: "Set your availability",
              description: "Want to block off weekends? Set up any buffers? We make that easy.",
              icon: "/icons/integration.svg",
              number: "02"
            },
            {
              title: "Choose how to meet",
              description: "It could be a video chat, phone call, or a walk in the park!",
              icon: "/icons/customization.svg",
              number: "03"
            },
          ].map((feature, index) => (
            <div key={index} className="relative p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-2xl font-bold text-white/60">
                {feature.number}
              </div>
              <Image 
                src={feature.icon} 
                alt={feature.title} 
                width={48} 
                height={48} 
                className="mb-6" 
              />
              <h3 className="text-xl font-bold mb-4 text-white">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Integration Section */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Connect your favorite apps</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Google Calendar", logo: "/icons/google-calendar.svg" },
              { name: "Zoom", logo: "/icons/zoom.svg" },
              { name: "Microsoft Teams", logo: "/icons/teams.svg" },
              { name: "Slack", logo: "/icons/slack.svg" },
            ].map((app, index) => (
              <div key={index} className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                <Image 
                  src={app.logo} 
                  alt={app.name} 
                  width={48} 
                  height={48} 
                  className="mx-auto mb-2" 
                />
                <p className="text-sm text-gray-300">{app.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 