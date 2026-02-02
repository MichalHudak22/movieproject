'use client';

import { useState } from 'react';
import RatingCard from './RatingCard';

interface Rating {
  imdb_id: string;
  type: 'movie' | 'series';
  rating: number;
  title?: string;
  poster?: string;
  averageRating?: number | null;
}

interface RatingsGridProps {
  ratings: Rating[];
  token: string | null;
  onRatingChange: (imdb_id: string, type: 'movie' | 'series', newRating: number) => void;
  onDeleteRating: (imdb_id: string) => void; // funkcia na odstránenie ratingu
  getUrlType: (type: 'movie' | 'series') => string;
}

export default function RatingsGrid({
  ratings,
  token,
  onRatingChange,
  onDeleteRating,
  getUrlType,
}: RatingsGridProps) {
  const [modal, setModal] = useState<{ open: boolean; imdb_id: string | null }>({
    open: false,
    imdb_id: null,
  });

  const handleConfirmDelete = () => {
    if (modal.imdb_id) {
      onDeleteRating(modal.imdb_id);
      setModal({ open: false, imdb_id: null });
    }
  };

  const renderCards = (type: 'movie' | 'series') =>
    ratings
      .filter(r => r.type === type)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .map(r => (
        <RatingCard
          key={r.imdb_id}
          rating={r}
          token={token}
          getUrlType={getUrlType}
          onRatingChange={onRatingChange}
          onDeleteClick={imdb_id => setModal({ open: true, imdb_id })}
        />
      ));

  return (
    <div className="max-w-7xl mx-auto mt-8">
      {ratings.length === 0 && (
        <p className="text-gray-400">You have not rated any movies or series yet.</p>
      )}

      {ratings.some(r => r.type === 'movie') && (
        <div className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-gray-200">Movies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-6">
            {renderCards('movie')}
          </div>
        </div>
      )}

      {ratings.some(r => r.type === 'series') && (
        <div className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-gray-200">Series</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-6">
            {renderCards('series')}
          </div>
        </div>
      )}

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-gray-800 p-6 rounded-md text-white">
            <p className="mb-4">Are you sure you want to remove this rating?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setModal({ open: false, imdb_id: null })}
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
              >
                No
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
