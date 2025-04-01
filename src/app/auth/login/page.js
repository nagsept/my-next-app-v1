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
      // Store JWT token in cookies (must be set server-side for HttpOnly)
      document.cookie = `token=${data.token}; path=/; max-age=3600; Secure`;

      // Redirect to dashboard without reload
      router.push("/dashboard");
    } else {
      setError(data.error || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="p-6 bg-gray-100 rounded-lg shadow-md">
        <h2 className="mb-4 text-lg font-semibold">Login</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 mb-2 border rounded"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 mb-2 border rounded"
          required
        />

        <button type="submit" className="w-full p-2 mt-2 text-white bg-blue-500 rounded">
          Login
        </button>

        {error && <div className="mt-2 text-red-500">{error}</div>}
      </form>
    </div>
  );
};

export default LoginPage;
