export default function FeaturesSection() {
	return (
	  <section className="py-16 bg-white">
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		  <h2 className="text-center text-3xl font-extrabold mb-8 text-teal-600">Key Features</h2>
		  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
			{[
			  {
				title: "Schedule Meetings",
				description: "Gain actionable insights with our advanced AI analytics.",
				icon: "/icons/insights.svg",
			  },
			  {
				title: "Seamless Integration",
				description: "Get your meetings scheduled with your favorite apps like Google Calendar, Zoom, and more.",
				icon: "/icons/integration.svg",
			  },
			  {
				title: "Customizable Availibilty",
				description: "Set your availibility that suits you. We will take care of the rest.",
				icon: "/icons/customization.svg",
			  },
			].map((feature, index) => (
			  <div key={index} className="p-6 bg-gray-50 shadow-md rounded-lg text-center">
				<img src={feature.icon} alt={feature.title} className="mx-auto mb-4 w-16 h-16" />
				<h3 className="text-xl font-bold mb-2 text-teal-700">{feature.title}</h3>
				<p className="text-gray-600">{feature.description}</p>
			  </div>
			))}
		  </div>
		</div>
	  </section>
	);
  }
  