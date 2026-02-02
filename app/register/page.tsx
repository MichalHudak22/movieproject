'use client'; // client component pre useState, fetch

import { useState } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        setUsername('');
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      console.error(err);
      setMessage('Server error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <form
        className="md:border border-red-800 bg-gray-950/70 p-8 lg:p-16 md:rounded-xl shadow-md w-full max-w-lg"
        onSubmit={handleRegister}
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
          required
        />

        <button
          type="submit"
          className="w-full bg-red-700 py-2 rounded hover:bg-red-600 transition"
        >
          Register
        </button>

        <p className="mt-4 text-center text-gray-300">
          Already have an account?{' '}
          <Link href="/login" className="text-red-600 hover:text-red-500">
            Login here
          </Link>
        </p>

        {message && <p className="mt-4 text-center">{message}</p>}
      </form>
    </div>
  );
}
