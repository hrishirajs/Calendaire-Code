import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import CalendaireLogo from "@/public/Calendaire Logo.png";

export default function Footer() {
  return (
    <div className="bg-muted/100 text-primary py-10">
      {/* Top Section */}
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Branding */}
        <div>
          <Image src={CalendaireLogo} alt="Calendaire Logo" width={150} height={50} />
          <p className="mt-4 text-sm text black leading-relaxed">
            Simplify your scheduling with <span className="font-semibold">real-time availability</span> and <span className="font-semibold">automated reminders</span>. Let Calendaire handle the hard work for you.
          </p>
        </div>

        {/* Quick Links Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {[
              { href: "https://www.x.com/hrishi_rajs", label: "X (Twitter)" },
              { href: "https://github.com/hrishirajs", label: "My GitHub Profile" },
              { href: "https://www.instagram.com/hrishi.rajs", label: "Instagram" },
              { href: "https://linkedin.com/in/hrishi-raj-saxena-667094206", label: "LinkedIn" },
            ].map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:text-green-600 transition-colors duration-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Form */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <p className="text-black leading-relaxed">
            Have questions or feedback? Send us a message directly!
          </p>
          <form
            action={`mailto:hrs150203@gmail.com`}
            method="POST"
            encType="text/plain"
            className="mt-4 flex flex-col space-y-4"
          >
            {/* Name Input */}
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              className="w-full px-4 py-2 rounded-lg text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            {/* Email Input */}
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              className="w-full px-4 py-2 rounded-lg text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-greem-600"
            />
            {/* Message Textarea */}
            <textarea
              name="message"
              placeholder="Your Message"
              rows={4}
              required
              className="w-full px-4 py-2 rounded-lg text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
            ></textarea>
            {/* Submit Button */}
            <button
              type="submit"
              className="bg-green-600 px-4 py-2 rounded-lg text-white font-medium hover:bg-greem-700 transition-colors duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Middle Section */}
      <div className="container mx-auto mt-10 flex justify-center space-x-6">
        {[{ Icon: Facebook, label: "Facebook" }, { Icon: Twitter, label: "Twitter" }, { Icon: Instagram, label: "Instagram" }, { Icon: Linkedin, label: "LinkedIn" }].map(({ Icon, label }) => (
          <a
            key={label}
            href="#"
            aria-label={label}
            className="hover:text-blue-400 transition-colors duration-300"
          >
            <Icon size={24} />
          </a>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="container mx-auto mt-10 border-t border-gray-700 pt-6 text-center text-sm">
        {/* Legal Information */}
        <p className="mb-2">
          {[
            { href: "/privacypolicy", label: "Privacy Policy" },
            { href: "/termsofservice", label: "Terms of Service" },
            { href: "/cookiespolicy", label: "Cookie Policy" },
          ].map((link, index) => (
            <>
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-blue-600 transition-colors duration-300"
              >
                {link.label}
              </Link>
              {index < 2 && " | "}
            </>
          ))}
        </p>

        {/* Copyright */}
        <p>© {new Date().getFullYear()} Calendaire. All rights reserved.</p>
      </div>
    </div>
  );
}
