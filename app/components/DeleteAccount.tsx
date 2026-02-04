'use client';

import { useState } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

interface DeleteAccountProps {
  token: string;
  onAccountDeleted: () => void;
}

export default function DeleteAccount({ token, onAccountDeleted }: DeleteAccountProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Delete failed');

      setModalOpen(false);
      onAccountDeleted();
    } catch (err) {
      console.error(err);
      alert('Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 max-w-xl mx-auto">
      {/* Karta pre Delete Account */}
      <div className="bg-gray-900 rounded-xl shadow-xl border border-red-700/40 p-6 flex flex-col gap-4">
        {/* Header s ikonou */}
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-white">Delete your account</h3>
        </div>

        {/* Upozornenie */}
        <p className="text-gray-300 text-base lg:text-lg">
          ⚠️ Deleting your account will permanently remove all your ratings and profile information.
          This action cannot be undone.
        </p>

        {/* Tlačidlo */}
        <button
          onClick={() => setModalOpen(true)}
          className="mt-2 w-full max-w-xs mx-auto py-2 bg-red-700 hover:bg-red-600 rounded-lg shadow-md text-white text-lg font-semibold transition"
        >
          Delete account
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl shadow-2xl w-96 p-6 relative">
            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-bold text-white">Delete your account?</h2>
            </div>

            {/* Modal Upozornenie */}
            <div className="bg-red-800/20 p-4 rounded-lg border border-red-700 text-base text-gray-200 mb-6">
              ⚠️ By deleting your account,{' '}
              <strong>all your data, ratings, and profile information</strong> will be permanently
              lost. This action cannot be undone.
            </div>

            {/* Modal Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-md transition"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
