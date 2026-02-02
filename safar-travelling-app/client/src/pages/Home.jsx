import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, MapPin, Calendar, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Home({ packages: initialPackages }) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [packages, setPackages] = useState(initialPackages || []);
  const [destination, setDestination] = useState("");

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("/api/packages");
        const data = await response.json();
        setPackages(data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    if (!initialPackages || initialPackages.length === 0) {
      fetchPackages();
    }
  }, [initialPackages]);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header with Logout */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Safar Travelling 🇮🇳</h1>
        <div className="flex items-center gap-4">
          {user && <span className="text-gray-600 text-sm">{user.email}</span>}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
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
              <div className="p-4">
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
              </div>
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
