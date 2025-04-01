// src/app/auth/register/route.js
import { NextResponse } from 'next/server';
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});
client.connect();

export async function POST() {
  // const { username, email, password } = await request.json();

  // Hash the password
  // const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Check if user already exists
    const res = '';
    if (res.rows.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Insert the new user into the database
    // await client.query(
    //   'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
    //   [username, email, hashedPassword]
    // );

    return NextResponse.json({ message: 'User registered successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
