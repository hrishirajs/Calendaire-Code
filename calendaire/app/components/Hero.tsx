export default function HeroSection() {
	return (
	  <div className="relative bg-gradient-to-r from-emerald-500 to-teal-600 text-white h-screen flex items-center justify-center">
		<div className="text-center max-w-3xl px-6">
		  <h1 className="text-5xl font-extrabold mb-4 text-gold">
			Schedule Meetings Hassle Free
		  </h1>
		  <p className="text-lg font-medium mb-8 leading-relaxed text-white/90">
		     	With calendaire, you can easily schedule meetings with your team, clients, or friends. No more back and forth emails, just send your availability and let calendaire do the rest.							
		  </p>
		  <div className="flex justify-center space-x-4">
			<a
			  href="/"
			  className="bg-transparent border border-white text-white font-semibold py-3 px-6 rounded-lg hover:bg-white hover:text-teal-600 transition duration-300"
			>
			  Get Started
			</a>
			<a
			  href="/"
			  className="bg-transparent border border-white text-white font-semibold py-3 px-6 rounded-lg hover:bg-white hover:text-teal-600 transition duration-300"
			>
			  Learn More
			</a>
		  </div>
		</div>
	  </div>
	);
  }
  