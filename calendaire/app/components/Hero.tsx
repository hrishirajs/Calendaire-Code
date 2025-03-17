import React from 'react';

export default function HeroSection() {
  return (
    <div className="relative bg-gradient-to-r from-gray-900 via-black to-gray-800 text-white min-h-[calc(100vh-5rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left side - Text content */}
        <div className="flex-1 text-center lg:text-left max-w-2xl">
          <h1 className="text-5xl lg:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            The better way to schedule your meetings
          </h1>
          <p className="text-lg lg:text-xl mb-8 text-gray-300">
            A fully customizable scheduling experience for individuals and businesses. Take control of your time with our intelligent scheduling platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a
              href="/api/auth"
              className="bg-white text-gray-900 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-300"
            >
              Get Started
            </a>
            <a
              href="#features"
              className="border border-white/20 text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/10 transition duration-300"
            >
              Learn More
            </a>
          </div>
        </div>
        
        {/* Right side - Demo Calendar */}
        <div className="flex-1 w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/10">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Book a Demo</h3>
              <p className="text-sm text-gray-300">See how Calendaire can transform your scheduling</p>
            </div>
            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition cursor-pointer">
                <p className="text-sm font-medium">30 min Discovery Call</p>
                <p className="text-xs text-gray-400 mt-1">Learn about our features</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition cursor-pointer">
                <p className="text-sm font-medium">60 min Product Demo</p>
                <p className="text-xs text-gray-400 mt-1">Deep dive into capabilities</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 