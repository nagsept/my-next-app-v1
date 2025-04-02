'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      console.log('All Cookies:', document.cookie);

      const tokenCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='));

      if (!tokenCookie) {
        console.error('Token not found in cookies');
        return;
      }

      const token = tokenCookie.split('=')[1];
      console.log("Extracted Token:", token);

      const decoded = jwtDecode(token);

      if (!decoded || typeof decoded.exp !== "number" || decoded.exp * 1000 < Date.now()) {
        console.error("Token expired or missing expiration");
        return;
      }


      setUser(decoded);
      setLoading(false);
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }, []);

  const handleLogout = () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    setUser(null);
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <div className="text-lg font-semibold text-gray-600 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <nav className="space-x-4">
          {!user ? (
            <>
              <button
                onClick={() => router.push('/auth/login')}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
              >
                Login
              </button>
              <button
                onClick={() => router.push('/auth/register')}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
              >
                Register
              </button>
            </>
          ) : (
            <>
                <button
                  onClick={() => router.push("/")}
                  className="bg-white text-blue-600 px-4 py-2 hover:bg-gray-200 transition"
                >
                  Home
                </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
            </>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md text-center">
          {user ? (
            <>
              <h2 className="text-2xl font-bold text-gray-800">Welcome, {user?.username}!</h2>
              <p className="text-gray-600 mt-2">
                Email: <span className="font-medium">{user?.email}</span>
              </p>
            </>
          ) : (
            <p className="text-lg text-gray-700">Please log in or register to continue.</p>
          )}
        </div>
      </div>
    </div>
  );
}
