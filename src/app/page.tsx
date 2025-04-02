"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
  username?: string;
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<CustomJwtPayload | null>(null);

  useEffect(() => {
    try {
      const tokenCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));

      if (!tokenCookie) return;

      const token = tokenCookie.split("=")[1];

      if (!token) {
        console.error("Token not found");
        return;
      }

      const decoded = jwtDecode<CustomJwtPayload>(token);

      if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
        console.error("Token expired or invalid");
        return;
      }

      setUser(decoded);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    setUser(null);
    router.push("/auth/login");
  };

  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen font-[family-name:var(--font-geist-sans)]">
      {/* Header - Removed extra space */}
      <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold">Home</h1>
        <nav className="space-x-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-white text-blue-600 px-4 py-2 hover:bg-gray-200 transition"
          >
            Dashboard
          </button>
          {!user ? (
            <>
              <button
                onClick={() => router.push("/auth/login")}
                className="bg-white text-blue-600 px-4 py-2 hover:bg-gray-200 transition"
              >
                Login
              </button>
              <button
                onClick={() => router.push("/auth/register")}
                className="bg-white text-blue-600 px-4 py-2 hover:bg-gray-200 transition"
              >
                Register
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 transition"
            >
              Logout
            </button>
          )}
        </nav>
      </header>

      {/* Main Content - Social Media Placeholder */}
      <main className="flex flex-col gap-8 items-center sm:items-start text-center sm:text-left px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-800">
          {user
            ? `Welcome, ${user?.username || "User"}!`
            : "Welcome to Our Social Platform"}
        </h2>
        <p className="text-gray-600 max-w-lg">
          Stay connected with your friends and family. Share your thoughts,
          updates, and moments with the world.
        </p>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <button className="bg-blue-500 text-white px-6 py-3 hover:bg-blue-600 transition">
            Explore Content
          </button>
          <button className="bg-gray-300 text-black px-6 py-3 hover:bg-gray-400 transition">
            Create a Post
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-4 text-center">
        <div className="flex gap-6 justify-center">
          <a className="hover:underline" href="#">
            📄 Terms of Service
          </a>
          <a className="hover:underline" href="#">
            🔒 Privacy Policy
          </a>
          <a className="hover:underline" href="#">
            📧 Contact Us
          </a>
        </div>
      </footer>
    </div>
  );
}
