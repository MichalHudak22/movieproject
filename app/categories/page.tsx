"use client";

import { useEffect, useState } from "react";
import { getMoviesByGenre } from "@/lib/tmdb";
import SectionRowClient from "@/app/components/SectionRowClient";
import GenreFilter from "@/app/components/GenreFilter";

const categories = [
  { id: 28, name: "Action" },
  { id: 18, name: "Drama" },
  { id: 12, name: "Adventure" },
  { id: 53, name: "Thriller" },
  { id: 878, name: "Science Fiction" },
  { id: 27, name: "Horror" },
  { id: 35, name: "Comedy" },
  { id: 16, name: "Animation" },
];

export default function CategoriesPage() {
  const [genreData, setGenreData] = useState<any[]>([]);
  const [topMovies, setTopMovies] = useState<any[]>([]);
  const [topSeries, setTopSeries] = useState<any[]>([]);



async function fetchTmdbDetail(id: string, type: "movie" | "series") {
  const tmdbType = type === "series" ? "tv" : "movie";

  const res = await fetch(
    `https://api.themoviedb.org/3/${tmdbType}/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
  );

  if (!res.ok) return null;
  return res.json();
}


  useEffect(() => {
async function fetchTopRatings() {
  try {
    // MOVIES
    const movieRes = await fetch("http://localhost:5000/api/ratings/top?type=movie");
    const movies = await movieRes.json();

    const moviesWithDetails = await Promise.all(
      movies.map(async (m: any) => {
        const detail = await fetchTmdbDetail(m.imdb_id, "movie");
        if (!detail) return null;
        return {
          ...detail,
          averageRating: m.averageRating,
          votes: m.votes,
        };
      })
    );

    setTopMovies(moviesWithDetails.filter(Boolean));

    // SERIES
    const seriesRes = await fetch("http://localhost:5000/api/ratings/top?type=series");
    const series = await seriesRes.json();

    const seriesWithDetails = await Promise.all(
      series.map(async (s: any) => {
        const detail = await fetchTmdbDetail(s.imdb_id, "series");
        if (!detail) return null;
        return {
          ...detail,
          averageRating: s.averageRating,
          votes: s.votes,
        };
      })
    );

    setTopSeries(seriesWithDetails.filter(Boolean));
  } catch (err) {
    console.error("Error fetching top ratings:", err);
  }
}


    async function fetchGenres() {
      try {
        const data = await Promise.all(
          categories.map(async (cat) => {
            const res = await getMoviesByGenre(cat.id);
            return { name: cat.name, items: res.results };
          })
        );
        console.log("Fetched genre data:", data);
        setGenreData(data);
      } catch (err) {
        console.error("Error fetching genre data:", err);
      }
    }

    fetchTopRatings();
    fetchGenres();
  }, []);

  return (
    <div className="min-h-screen bg-transparent text-white font-sans px-2 md:px-6 py-5 lg:py-8">
      <div className="text-center mb-8">
        <h1 className="text-xl md:text-3xl lg:text-5xl font-bold md:my-4">
          Browse by <span className="text-red-700 animate-gradient-red">Categories</span>
        </h1>
        <p className="text-md lg:text-2xl text-gray-200 animate-gradient-lighted pt-2">
          Discover movies from every genre and find your next unforgettable story.
        </p>
      </div>

      <GenreFilter />

      {/* Top Rated Movies */}
      {topMovies.length > 0 && (
        <SectionRowClient title="Top Rated Movies by Our Users" items={topMovies} type="movie" />
      )}

      {/* Top Rated Series */}
      {topSeries.length > 0 && (
        <SectionRowClient title="Top Rated Series by Our Users" items={topSeries} type="series" />
      )}

      {/* TMDB Genres */}
      {genreData.map((genre) => (
        <SectionRowClient
          key={genre.name}
          title={genre.name}
          items={genre.items}
          type="movie" // TMDB fetchujeme ako "movie"
        />
      ))}
    </div>
  );
}
