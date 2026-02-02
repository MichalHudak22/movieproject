'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

interface Genre {
  id: number;
  name: string;
}

export default function GenreFilter() {
  const [allGenres, setAllGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchGenres() {
      try {
        const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
        const data = await res.json();
        setAllGenres(data.genres);
      } catch (err) {
        console.error('Failed to fetch genres', err);
      }
    }
    fetchGenres();
  }, []);

  function toggleGenre(id: number) {
    setSelectedGenres(prev => (prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]));
  }

  useEffect(() => {
    if (selectedGenres.length === 0) {
      setMovies([]);
      return;
    }

    async function loadMovies() {
      setLoading(true);
      try {
        let allResults: any[] = [];
        const firstRes = await fetch(
          `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenres.join(
            ',',
          )}&language=en-US&page=1`,
        );
        const firstData = await firstRes.json();
        allResults = allResults.concat(firstData.results);

        const totalPages = Math.min(firstData.total_pages, 10); // nechceme presiahnuť limit 10 stránok

        for (let page = 2; page <= totalPages; page++) {
          const res = await fetch(
            `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenres.join(
              ',',
            )}&language=en-US&page=${page}`,
          );
          const data = await res.json();
          allResults = allResults.concat(data.results);
        }

        // OR filter: aspoň jeden vybraný žáner
        const filtered = allResults.filter((m: any) =>
          m.genre_ids.some((gid: number) => selectedGenres.includes(gid)),
        );

        // odstránenie duplicitných filmov podľa ID
        const uniqueMovies = Array.from(new Map(filtered.map(m => [m.id, m])).values());

        setMovies(uniqueMovies);
      } catch (err) {
        console.error('Failed to fetch movies', err);
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, [selectedGenres]);

  return (
    <div className="text-white mb-10">
      {/* GENRE BUTTONS */}
      <div className="md:p-6 shadow-lg">
        <div className="flex flex-wrap justify-center gap-2">
          {allGenres.map(g => (
            <button
              key={g.id}
              onClick={() => toggleGenre(g.id)}
              className={`px-2 md:px-3 py-1 text-[10px] sm:text-sm rounded-full font-semibold border transition-all
                ${selectedGenres.includes(g.id)
                  ? 'bg-red-700 border-red-500 scale-105'
                  : 'bg-gray-900 border-gray-600 hover:bg-red-700'
                }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      {/* Zobraz výsledky iba ak sú vybrané žánre */}
      {selectedGenres.length > 0 && (
        <>
          <h2 className="text-2xl font-bold my-4 w-[85%] mx-auto">Filter by Genres</h2>

          {loading ? (
            <p className="text-gray-400 text-center mb-4">Loading movies...</p>
          ) : movies.length === 0 ? (
            <p className="text-gray-400 text-center py-16 border border-dashed border-gray-600 rounded-lg">
              No movies match the selected genres.
            </p>
          ) : (
            <div className="max-h-[900px] overflow-y-auto w-[85%] mx-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {movies.map(movie => (
                  <Link
                    key={movie.id}
                    href={`/movie/${movie.id}`}
                    className="bg-gray-800 p-2 rounded-lg hover:scale-105 hover:shadow-xl transition-transform flex flex-col"
                  >
                    <div className="w-full mb-2">
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        width={300}
                        height={450} 
                        className="rounded-lg object-cover"
                      />

                    </div>

                    <h3 className="text-xs sm:text-sm font-semibold text-center truncate">
                      {movie.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
