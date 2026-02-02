'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your account...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }

    console.log('API URL:', API);
    console.log('Token:', token);

    let didCancel = false;

    const verifyAccount = async () => {
      try {
        const res = await fetch(`${API}/api/auth/verify?token=${token}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        if (!didCancel) {
          setStatus('success');
          setMessage('Your account has been successfully verified 🎉');

          // odstráni token z URL, aby sa fetch nespustil znova
          router.replace('/verify');

          setTimeout(() => {
            router.push('/login');
          }, 3000);
        }
      } catch (err: any) {
        if (!didCancel) {
          console.error('Verification error:', err);
          setStatus('error');
          setMessage(err.message || 'Verification failed');
        }
      }
    };

    verifyAccount();

    return () => {
      didCancel = true;
    };
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">
          {status === 'loading' && 'Verifying...'}
          {status === 'success' && 'Success'}
          {status === 'error' && 'Error'}
        </h1>
        <p className="text-gray-300 mb-6">{message}</p>
        {status === 'success' && (
          <p className="text-sm text-gray-400">Redirecting to login page...</p>
        )}
        {status === 'error' && (
          <button
            onClick={() => router.push('/login')}
            className="mt-4 bg-red-700 hover:bg-red-600 px-4 py-2 rounded"
          >
            Go to Login
          </button>
        )}
      </div>
    </div>
  );
}
