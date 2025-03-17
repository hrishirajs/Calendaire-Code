'use client';
import React from 'react';

export default function TestimonialsSection() {
  return (
    <section className="relative bg-gradient-to-r from-gray-900 via-black to-gray-800 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-white mb-4">Don't take our word for it</h2>
          <p className="text-xl text-gray-300">Our users are our best ambassadors. Discover why we're the top choice for scheduling meetings.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: "Alex Thompson",
              role: "CEO, TechStart",
              image: "/testimonials/alex.jpg",
              quote: "Calendaire has revolutionized how we handle meetings. The automated scheduling and reminders have saved us countless hours.",
            },
            {
              name: "Sarah Chen",
              role: "Product Manager, InnovateCo",
              image: "/testimonials/sarah.jpg",
              quote: "The interface is intuitive and the integration with our existing tools is seamless. It's exactly what we needed.",
            },
            {
              name: "Michael Rodriguez",
              role: "Sales Director, GrowthFirst",
              image: "/testimonials/michael.jpg",
              quote: "Since switching to Calendaire, our meeting attendance rate has improved significantly. The reminder system is fantastic!",
            },
          ].map((testimonial, index) => (
            <div key={index} className="relative p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{testimonial.name}</h3>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </div>
              <blockquote className="text-gray-300 italic">"{testimonial.quote}"</blockquote>
            </div>
          ))}
        </div>

        {/* Trusted By Section */}
        <div className="mt-24 text-center">
          <h3 className="text-2xl font-bold text-white mb-12">Trusted by fast-growing companies</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: "Company 1", logo: "/logos/company1.svg" },
              { name: "Company 2", logo: "/logos/company2.svg" },
              { name: "Company 3", logo: "/logos/company3.svg" },
              { name: "Company 4", logo: "/logos/company4.svg" },
            ].map((company, index) => (
              <div key={index} className="flex items-center justify-center">
                <img 
                  src={company.logo} 
                  alt={company.name} 
                  className="h-8 opacity-50 hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 