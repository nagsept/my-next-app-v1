"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwtDecode from "jwt-decode"; // Install with `npm install jwt-decode`

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cookie = document.cookie.split("; ").find(row => row.startsWith("token="));
    if (!cookie) {
      router.push("/auth/login");
      return;
    }

    const token = cookie.split("=")[1];

    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch (error) {
      console.error("Invalid token", error);
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0"; // Clear token
    router.push("/auth/login");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="p-6 bg-gray-100 rounded-lg shadow-md">
        <h2 className="mb-4 text-lg font-semibold">Welcome, {user?.username}!</h2>
        <p>Email: {user?.email}</p>
        <p>User ID: {user?.id}</p>

        <button
          onClick={handleLogout}
          className="w-full p-2 mt-4 text-white bg-red-500 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
