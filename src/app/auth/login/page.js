"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      // Store JWT token in cookies
      document.cookie = `token=${data.token}; path=/; max-age=3600; Secure`;

      // Redirect to dashboard
      router.push("/dashboard");
    } else {
      setError(data.error || "Login failed. Please try again.");
    }
  };

  return (
    <div className="h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold">Login</h1>
        <nav className="space-x-4">
          <button
            onClick={() => router.push("/")}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Home
          </button>
          <button
            onClick={() => router.push("/auth/register")}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Register
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <form
          onSubmit={handleSubmit}
          className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md"
        >
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Login</h2>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            className="w-full p-2 mt-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>

          {error && <div className="mt-2 text-red-500 text-center">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
