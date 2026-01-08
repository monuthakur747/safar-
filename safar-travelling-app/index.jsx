import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, MapPin, Calendar } from "lucide-react";

export default function SafarTravelApp() {
  const [destination, setDestination] = useState("");

  const packages = [
    { place: "Goa", days: "5 Days / 4 Nights", price: "₹18,000" },
    { place: "Manali", days: "6 Days / 5 Nights", price: "₹22,000" },
    { place: "Jaipur", days: "4 Days / 3 Nights", price: "₹15,000" },
    { place: "Kerala", days: "7 Days / 6 Nights", price: "₹30,000" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Safar Travelling 🇮🇳</h1>
      <p className="text-center text-gray-600 mb-8">
        Explore beautiful destinations across India with us
      </p>

      {/* Search Section */}
      <div className="max-w-xl mx-auto mb-10 flex gap-2">
        <input
          type="text"
          placeholder="Search destination (Goa, Manali...)"
          className="flex-1 p-2 rounded-lg border"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <Button>Search</Button>
      </div>

      {/* Packages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages
          .filter((p) =>
            p.place.toLowerCase().includes(destination.toLowerCase())
          )
          .map((pkg, index) => (
            <Card key={index} className="rounded-2xl shadow-md">
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <MapPin size={18} /> {pkg.place}
                </h2>
                <p className="text-gray-600 flex items-center gap-2 mt-2">
                  <Calendar size={16} /> {pkg.days}
                </p>
                <p className="text-lg font-bold mt-3">{pkg.price}</p>
                <Button className="w-full mt-4 flex items-center gap-2">
                  <Plane size={16} /> Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-500 mt-12">
        © 2025 Safar Travelling | India Tour & Travel
      </footer>
    </div>
  );
}