'use client';
import React from 'react';
import Image from 'next/image';

export default function TestimonialsSection() {
  return (
    <section className="relative bg-gradient-to-r from-gray-900 via-black to-gray-800 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-white mb-4">Don&apos;t take our word for it</h2>
          <p className="text-xl text-gray-300">Our users are our best ambassadors. Discover why we&apos;re the top choice for scheduling meetings.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: "Alex Thompson",
              role: "CEO, TechStart",
              
              quote: "Calendaire has revolutionized how we handle meetings. The automated scheduling and reminders have saved us countless hours.",
            },
            {
              name: "Sarah Chen",
              role: "Product Manager, InnovateCo",
             
              quote: "The interface is intuitive and the integration with our existing tools is seamless. It's exactly what we needed.",
            },
            {
              name: "Michael Rodriguez",
              role: "Sales Director, GrowthFirst",
             
              quote: "Since switching to Calendaire, our meeting attendance rate has improved significantly. The reminder system is fantastic!",
            },
          ].map((testimonial, index) => (
            <div key={index} className="relative p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
              <div className="flex items-center mb-6">
                
                <div>
                  <h3 className="text-lg font-semibold text-white">{testimonial.name}</h3>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </div>
              <blockquote className="text-gray-300 italic">&ldquo;{testimonial.quote}&rdquo;</blockquote>
            </div>
          ))}
        </div>

        {/* Technology Stack Section */}
        <div className="mt-24 text-center">
          <h3 className="text-2xl font-bold text-white mb-12">Built using trusted technology</h3>
          <div className="relative w-full overflow-hidden">
            <div className="flex animate-scroll">
              <div className="flex items-center justify-center gap-24 px-16">
                {[
                  { name: "Next.js", logo: "/nextjs logo.jpg" },
                  { name: "Tailwind CSS", logo: "/tailwind logo.png" },
                  { name: "TypeScript", logo: "/typescript logo.png" },
                  { name: "shadcn/ui", logo: "/shadcn logo.png" },
                  { name: "Supabase", logo: "/supabase logo.jpg" },
                  { name: "Nylas", logo: "/nylas logo.png" },
                ].map((tech, index) => (
                  <div key={index} className="flex-shrink-0 w-32">
                    <Image 
                      src={tech.logo} 
                      alt={tech.name} 
                      width={128}
                      height={80}
                      className="h-20 w-full object-contain opacity-50 hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-24 px-16">
                {[
                  { name: "Next.js", logo: "/nextjs logo.jpg" },
                  { name: "Tailwind CSS", logo: "/tailwind logo.png" },
                  { name: "TypeScript", logo: "/typescript logo.png" },
                  { name: "shadcn/ui", logo: "/shadcn logo.png" },
                  { name: "Supabase", logo: "/supabase logo.jpg" },
                  { name: "Nylas", logo: "/nylas logo.png" },
                ].map((tech, index) => (
                  <div key={`duplicate-${index}`} className="flex-shrink-0 w-32">
                    <Image 
                      src={tech.logo} 
                      alt={tech.name} 
                      width={128}
                      height={80}
                      className="h-20 w-full object-contain opacity-50 hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 