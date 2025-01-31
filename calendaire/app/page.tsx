
import Image from "next/image";

import { auth } from "./lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "./components/navbar";
import HeroSection from "./components/Hero";
import FeaturesSection from "./components/FeaturesSection";
import TestimonialsSection from "./components/Testimonials";
import Footer from "./components/footer";

export default async function Home() {
  const session = await auth()
  if(session?.user){
    redirect("/dashboard");
  }

  return (
    <div className="bg-emerald-50 text-gray-900">
      {/* Navbar */}
      <Navbar />
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
