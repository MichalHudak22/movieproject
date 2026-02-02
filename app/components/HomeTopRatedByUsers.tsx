'use client';

import { useEffect, useState } from 'react';
import SectionRowClient from '@/app/components/SectionRowClient';

async function fetchTmdbDetail(id: string, type: 'movie' | 'series') {
  const tmdbType = type === 'series' ? 'tv' : 'movie';

  const res = await fetch(
    `https://api.themoviedb.org/3/${tmdbType}/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
  );

  if (!res.ok) return null;
  return res.json();
}

export default function HomeTopRatedByUsers() {
  const [topMovies, setTopMovies] = useState<any[]>([]);
  const [topSeries, setTopSeries] = useState<any[]>([]);

  useEffect(() => {
    async function fetchTopRatings() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        // MOVIES
        const movieRes = await fetch(`${apiUrl}/api/ratings/top?type=movie`);
        const movies = await movieRes.json();

        const moviesWithDetails = await Promise.all(
          movies.map(async (m: any) => {
            const detail = await fetchTmdbDetail(m.imdb_id, 'movie');
            if (!detail) return null;
            return {
              ...detail,
              averageRating: m.averageRating,
              votes: m.votes,
            };
          }),
        );

        setTopMovies(moviesWithDetails.filter(Boolean));

        // SERIES
        const seriesRes = await fetch(`${apiUrl}/api/ratings/top?type=series`);
        const series = await seriesRes.json();

        const seriesWithDetails = await Promise.all(
          series.map(async (s: any) => {
            const detail = await fetchTmdbDetail(s.imdb_id, 'series');
            if (!detail) return null;
            return {
              ...detail,
              averageRating: s.averageRating,
              votes: s.votes,
            };
          }),
        );

        setTopSeries(seriesWithDetails.filter(Boolean));
      } catch (err) {
        console.error('Error fetching user ratings:', err);
      }
    }

    fetchTopRatings();
  }, []);

  return (
    <>
      {topMovies.length > 0 && (
        <SectionRowClient title="CinemaSpace Movie Ratings" items={topMovies} type="movie" />
      )}

      {topSeries.length > 0 && (
        <SectionRowClient title="CinemaSpace Series Ratings" items={topSeries} type="series" />
      )}
    </>
  );
}
