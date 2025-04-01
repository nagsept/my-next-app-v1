// src/app/auth/register/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';

// Use connection pooling instead of a single persistent client
const pool = new Pool({
  connectionString: 'postgres://postgres:Venki12345@database-1.cteuewyi47px.eu-north-1.rds.amazonaws.com:5432/database-1',
  ssl: {
    rejectUnauthorized: false, // Required for AWS RDS SSL connections
  },
});

export async function POST(request) {
  const { username, email, password } = await request.json();

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(username, hashedPassword, email);

  let client;
  try {
    client = await pool.connect(); // Get a connection from the pool

    // Check if user already exists
    const res = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (res.rows.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Insert the new user into the database
    await client.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
      [username, email, hashedPassword]
    );

    return NextResponse.json({ message: 'User registered successfully' }, { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (client) client.release(); // Release the connection back to the pool
  }
}
