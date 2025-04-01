// src/middleware.js
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.next();
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
}

export const config = {
  matcher: ['/dashboard'], // Protect dashboard route or any other routes you need
};
