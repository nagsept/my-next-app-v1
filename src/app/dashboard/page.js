'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import jwtDecode from 'jwt-decode';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));

    if (!tokenCookie) {
      router.push('/auth/login');
    } else {
      try {
        const token = tokenCookie.split('=')[1];
        const decoded = jwtDecode(token);

        // Check if the token has expired
        if (decoded.exp * 1000 < Date.now()) {
          console.error('Token expired');
          router.push('/auth/login');
          return;
        }

        setUser(decoded);
        setLoading(false);
      } catch (error) {
        console.error('Invalid token:', error);
        router.push('/auth/login');
      }
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
