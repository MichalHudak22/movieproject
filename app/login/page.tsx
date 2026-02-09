'use client';

import { useState, useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AuthContext } from '../context/AuthContext'; // cesta k AuthContext

const API = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get('verified');

  const { setToken, setUser } = useContext(AuthContext);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        console.log('Login successful, received user:', data.user);

        // Token platí 2 minúty → 2 * 60 sekúnd
        setToken(data.token, 3 * 60 * 60);
        setUser(data.user);

        router.push('/');
      }
    } catch (err) {
      console.error(err);
      setMessage('Server error');
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center pt-[10vh] text-white">

      <form
        className="md:border border-red-800/50 bg-black/80 p-8 lg:p-16 md:rounded-lg shadow-md w-full max-w-lg flex flex-col gap-3"
        onSubmit={handleLogin}
      >
        <div>
          <h1 className="text-xl md:text-2xl font-bold mb-1 text-center">
            Welcome back to <span className="animate-gradient-red text-xl">CinemaSpace</span>
          </h1>

          <p className="text-xs md:text-base text-center text-gray-200 mb-5">
            Sign in and continue your cinematic journey 🎬
          </p>

        </div>

        <div>
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full p-2 mb-4 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />

          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full p-2 mb-4 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-700"
            required
          />

          <button
            type="submit"
            className="w-full py-2 bg-red-700 rounded hover:bg-red-600 transition"
          >
            Login
          </button>

        </div>



        <p className="mt-4 text-center text-gray-300">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-red-600 hover:text-red-500">
            Register here
          </Link>
        </p>

        {message && (
          <p
            className={`mt-4 text-center text-sm ${verified === '1' ? 'text-green-500' : 'text-red-500'
              }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
