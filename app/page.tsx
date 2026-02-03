'use client';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl">✈️</span>
            <h1 className="text-2xl font-bold text-orange-600">Safar</h1>
          </div>
          <nav className="flex gap-4">
            <a href="/login" className="text-gray-600 hover:text-orange-600 font-semibold">
              Login
            </a>
            <a href="/signup" className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition">
              Sign Up
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Discover Amazing Travel Destinations
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Explore beautiful travel packages across India and book your next adventure with Safar
          </p>
          <a
            href="/signup"
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition text-lg"
          >
            Get Started
          </a>
        </div>

        {/* Featured Packages */}
        <div>
          <h3 className="text-3xl font-bold mb-8 text-center">Popular Destinations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Goa Beach Paradise", description: "Experience the sandy beaches and vibrant nightlife of Goa", price: "₹15,999" },
              { name: "Himalayan Trek", description: "Adventure through the majestic Himalayan mountains", price: "₹21,999" },
              { name: "Kerala Backwaters", description: "Peaceful boat rides through the scenic backwaters of Kerala", price: "₹12,999" },
              { name: "Rajasthan Heritage", description: "Explore the magnificent palaces and forts of Rajasthan", price: "₹17,999" },
              { name: "Northeast Explorer", description: "Discover the hidden gems of India's Northeast region", price: "₹19,999" },
              { name: "Andaman Islands", description: "Pristine beaches and crystal clear waters await you", price: "₹24,999" }
            ].map((pkg, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
              >
                <div className="bg-gradient-to-r from-orange-400 to-orange-600 h-32"></div>
                <div className="p-6">
                  <h4 className="text-xl font-semibold mb-2 text-gray-800">{pkg.name}</h4>
                  <p className="text-gray-600 mb-4">{pkg.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-orange-600">{pkg.price}</span>
                    <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
