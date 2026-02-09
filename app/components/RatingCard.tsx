'use client';

import { useState, useRef, useEffect } from 'react';
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
  onRatingChange: (
    imdb_id: string,
    type: 'movie' | 'series',
    newRating: number
  ) => void;
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
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // zatvorenie dropdownu pri kliknutí mimo
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className={`
    relative bg-gray-900 rounded-xl shadow-lg 
    transform-gpu hover:scale-105 
    transition-transform duration-500 ease-in-out 
    backface-hidden will-change-transform
    group
    ${open ? 'z-50' : 'z-0'}
  `}
    >

      {/* Priemerné hodnotenie */}
      <div className="absolute top-2 left-2 bg-red-700/90 text-black border border-black font-bold px-2 py-1 rounded-md text-base shadow-md">
        {rating.averageRating ?? '-'} ⭐
      </div>

      {/* Hover X */}
      <button
        onClick={() => onDeleteClick(rating.imdb_id)}
        className="absolute top-2 right-2 text-white font-bold bg-red-700 hover:bg-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
      >
        ✕
      </button>

      {/* Poster */}
      {rating.poster && (
        <Link
          href={`/${getUrlType(rating.type)}/${rating.imdb_id}`}
          className="block w-full"
        >
          <Image
            src={`https://image.tmdb.org/t/p/w300${rating.poster}`}
            alt="poster"
            width={300}
            height={384}
            unoptimized
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
          <span className="text-sm lg:text-base text-gray-300">
            Your rating:
          </span>
          <span className="text-yellow-400 font-bold">
            {rating.rating}/10
          </span>
        </div>

        {/* CUSTOM DROPDOWN */}
        {token && (
          <div
            ref={dropdownRef}
            className="relative mt-2"
          >
            {/* Toggle button */}
            <button
              onClick={() => setOpen(prev => !prev)}
              className="w-full bg-gray-800 text-white p-2 rounded-md text-left flex justify-between items-center hover:bg-gray-700 transition"
            >
              <span>{rating.rating}</span>
              <span
                className={`transition-transform duration-300 ${open ? 'rotate-180' : ''
                  }`}
              >
                ▼
              </span>
            </button>

            {/* Options */}
            {open && (
              <div className="absolute left-0 top-full z-[9999] mt-1 w-full bg-gray-900 rounded-md shadow-2xl border border-gray-700 max-h-48 overflow-y-auto">

                {Array.from({ length: 11 }, (_, i) => i).map(n => (
                  <div
                    key={n}
                    onClick={() => {
                      onRatingChange(
                        rating.imdb_id,
                        rating.type,
                        n
                      );
                      setOpen(false);
                    }}
                    className={`
                      px-3 py-2 cursor-pointer transition
                      ${n === rating.rating
                        ? 'bg-red-700 text-white'
                        : 'text-gray-300 hover:bg-red-600 hover:text-white'
                      }
                    `}
                  >
                    {n}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
