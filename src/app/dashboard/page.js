'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import jwtDecode from 'jwt-decode';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // 🔹 Log all cookies
      console.log('All Cookies:', document.cookie);

      // 🔹 Find token in cookies
      const tokenCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='));

      if (!tokenCookie) {
        console.error('Token not found in cookies');
        router.push('/auth/login');
        return;
      }

      // 🔹 Extract token value
      const token = tokenCookie.split('=')[1];
      console.log('Extracted Token:', token);
      console.log("jwtDecode function:", jwtDecode);
      // 🔹 Decode token
      const decoded = jwtDecode(token);
      console.log('Decoded Token:', decoded);

      // 🔹 Check expiry
      if (decoded.exp * 1000 < Date.now()) {
        console.error('Token expired');
        router.push('/auth/login');
        return;
      }

      setUser(decoded);
      setLoading(false);
    } catch (error) {
      console.error('Error decoding token:', error);
      router.push('/auth/login');
    }
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Welcome, {user?.username}!</h2>
      <p>Email: {user?.email}</p>
      <button
        onClick={() => {
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
          router.push('/auth/login');
        }}
      >
        Logout
      </button>
    </div>
  );
}
