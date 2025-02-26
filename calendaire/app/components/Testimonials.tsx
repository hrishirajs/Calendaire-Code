export default function TestimonialsSection() {
	return (
	  <section className=" relative bg-gradient-to-r from-gray-900 via-black to-gray-800 py-16 bg-blue-50">
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		  <h2 className="text-center text-3xl font-extrabold mb-8 text-black">What Our Clients Say</h2>
		  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{[
			  {
				name:"John D., Operations Manager",
				feedback:
				  "\"Calendaire has saved us countless hours with its real-time availability and automated reminders. It's a must-have tool for any team!\"",
				rating: "⭐⭐⭐⭐⭐",
			  },
			  {
				name: "Jane S., Sales Consultant",
 
				feedback:
				  "\"My clients love how easy it is to book meetings with Calendaire, and I never miss an appointment thanks to its reminders!\"",
				rating: "⭐⭐⭐⭐⭐",
			  },
			  {
				name: "Alex J. Project Manager",
				feedback:
				  "\"Managing multiple calendars is effortless with Calendaire. It’s the ultimate scheduling tool for busy professionals!\""
,
				rating: "⭐⭐⭐⭐⭐",
			  },
			].map((testimonial, index) => (
			  <div key={index} className="p-6 bg-white shadow-md rounded-lg">
				<p className="italic">"{testimonial.feedback}"</p>
				<p className="font-bold mt-4">{testimonial.name}</p>
				<p>{testimonial.rating}</p>
			  </div>
			))}
		  </div>
		</div>
	  </section>
	);
  }
  