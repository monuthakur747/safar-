'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { LogOut } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/packages`
        );
        const data = await response.json();
        setPackages(data);
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };

    fetchPackages();
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header with Logout */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <span className="text-4xl">✈️</span>
          <h1 className="text-3xl font-bold">Safar Travelling</h1>
        </div>
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

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome, {user.name || user.email}!
          </h2>
          <p className="text-gray-600">
            Explore amazing travel destinations and book your next adventure with Safar.
          </p>
        </div>

        {/* Packages Section */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Travel Packages</h3>
          {packages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg: any) => (
                <div key={pkg._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                  <div className="h-48 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                    <span className="text-6xl">🏔️</span>
                  </div>
                  <div className="p-4">
                    <h4 className="text-xl font-bold text-gray-800 mb-2">{pkg.name}</h4>
                    <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold text-orange-600">₹{pkg.price}</span>
                      <span className="text-sm text-gray-500">{pkg.duration} days</span>
                    </div>
                    <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition">
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <p className="text-gray-600">No packages available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
