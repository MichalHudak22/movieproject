'use client';

import Link from 'next/link';
import Image from 'next/image';

interface Rating {
  imdb_id: string;
  type: 'movie' | 'series';
  rating: number;
  title?: string;
  poster?: string;
  averageRating?: number | null;
}

interface RatingCardProps {
  rating: Rating;
  token: string | null;
  onRatingChange: (imdb_id: string, type: 'movie' | 'series', newRating: number) => void;
  onDeleteClick: (imdb_id: string) => void;
  getUrlType: (type: 'movie' | 'series') => string;
}

export default function RatingCard({
  rating,
  token,
  onRatingChange,
  onDeleteClick,
  getUrlType,
}: RatingCardProps) {
  return (
    <div
      className="
        relative bg-gray-900 rounded-xl shadow-lg overflow-hidden 
        transform-gpu hover:scale-105 
        transition-transform duration-500 ease-in-out 
        backface-hidden will-change-transform
        group
      "
    >
      {/* Priemerné hodnotenie */}
      <div className="absolute top-2 left-2 bg-yellow-400 text-black font-bold px-2 py-1 rounded-md text-base shadow-md">
        {rating.averageRating ?? '-'} ⭐
      </div>

      {/* Hover X */}
      <button
        onClick={() => onDeleteClick(rating.imdb_id)}
        className="absolute top-2 right-2 text-white bg-red-700 hover:bg-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
      >
        ✕
      </button>

      {/* Poster */}
      {rating.poster && (
        <Link href={`/${getUrlType(rating.type)}/${rating.imdb_id}`} className="block w-full">
          <Image
            src={`https://image.tmdb.org/t/p/w300${rating.poster}`}
            alt="poster"
            width={300}
            height={384}
            className="object-cover w-full h-64 rounded-lg"
          />
        </Link>
      )}

      {/* Info */}
      <div className="p-3">
        <Link
          href={`/${getUrlType(rating.type)}/${rating.imdb_id}`}
          className="block text-lg font-semibold tracking-wider text-white h-[32px] overflow-hidden text-ellipsis whitespace-nowrap"
        >
          {rating.title}
        </Link>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-gray-300">Your rating:</span>
          <span className="text-yellow-400 font-bold">{rating.rating}/10</span>
        </div>

        {token && (
          <select
            value={rating.rating}
            onChange={e => onRatingChange(rating.imdb_id, rating.type, Number(e.target.value))}
            className="mt-2 w-full bg-gray-800 text-white p-1 rounded-md"
          >
            {Array.from({ length: 11 }, (_, i) => i).map(n => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
