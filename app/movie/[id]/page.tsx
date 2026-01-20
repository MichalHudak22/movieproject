"use client";

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  getMovieDetails,
  getMovieCredits,
  getMovieVideos,
  getMovieImages,
} from "@/lib/tmdb";

import Reviews from "../../components/Reviews";

interface MovieDetailProps {
  params: { id: string };
}

export default function MovieDetail({ params }: MovieDetailProps) {
  const id = Number(params.id);
  const { token } = useContext(AuthContext);

  const [movie, setMovie] = useState<any>(null);
  const [credits, setCredits] = useState<any>(null);
  const [videos, setVideos] = useState<any>(null);
  const [images, setImages] = useState<any>(null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [activeScreenshot, setActiveScreenshot] = useState<number | null>(null);
  const [ratingsCount, setRatingsCount] = useState(0);

  const API = process.env.NEXT_PUBLIC_API_URL; // 🔥 použijeme jednotné API

  useEffect(() => {
    const fetchData = async () => {
      const [movieData, creditsData, videosData, imagesData] = await Promise.all([
        getMovieDetails(id),
        getMovieCredits(id),
        getMovieVideos(id),
        getMovieImages(id),
      ]);
      setMovie(movieData);
      setCredits(creditsData);
      setVideos(videosData);
      setImages(imagesData);

      // fetch all ratings for this movie
      // fetch all ratings for this movie
      try {
        const res = await fetch(`${API}/api/ratings/${movieData.id}`);
        const data = await res.json();


        console.log("ratings data:", data); // <-- pridaj toto

        if (data.length > 0) {
          const avg = data.reduce((acc: number, r: any) => acc + r.rating, 0) / data.length;
          setAverageRating(Number(avg.toFixed(1)));
          setRatingsCount(data.length); // <-- počet ľudí, ktorí hodnotili
        } else {
          setRatingsCount(0); // ak ešte nikto nehodnotil
        }




        // fetch current user's rating
        if (token) {
          const userRes = await fetch(`${API}/api/ratings/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const myRatings = await userRes.json();
          const myRating = myRatings.find((r: any) => r.imdb_id === movieData.id.toString());
          if (myRating) setUserRating(myRating.rating);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id, token]);

  const handleRatingChange = async (value: number) => {
    if (!token) return;
    setUserRating(value);

    try {
      await fetch(`${API}/api/ratings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imdb_id: movie.id.toString(), type: "movie", rating: value }),
      });

      // reload average rating
      const res = await fetch(`${API}/api/ratings/${movie.id}`);
      const data = await res.json();
      if (data.length > 0) {
        const avg = data.reduce((acc: number, r: any) => acc + r.rating, 0) / data.length;
        setAverageRating(Number(avg.toFixed(1)));
        setRatingsCount(data.length); // <-- pridaj toto, aby sa zobrazil aj počet ľudí
      } else {
        setRatingsCount(0);
      }
    } catch (err) {
      console.error(err);
    }
  };


  if (!movie || !credits || !videos || !images) return <p className="text-white">Loading...</p>;

  const director = credits.crew.find((c: any) => c.job === "Director");
  const composer = credits.crew.find((c: any) => c.job === "Original Music Composer");
  const mainCast = credits.cast.slice(0, 10);
  const trailer = videos.results.find((v: any) => v.type === "Trailer" && v.site === "YouTube");
  const screenshots = images.backdrops.slice(0, 10);

  return (
    <div className="min-h-screen text-white px-6 py-8">
      {/* Hlavný blok */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 mb-8">
        {/* Poster */}
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="rounded-lg md:w-1/3"
        />

        {/* Info */}
        <div className="md:w-2/3 flex flex-col gap-2">
          <h1 className="text-4xl font-bold text-gray-100">{movie.title}</h1>

          {/* Ratings */}
          <div className="flex flex-col gap-1 mt-2">
            {/* Users Rating – priemer našich používateľov + počet hodnotiacich */}
            {averageRating !== null && (
              <p className="mt-4">
                <span className="font-semibold text-gray-100">Users Rating:</span>{" "}
                <span className="text-yellow-400 font-bold">{averageRating.toFixed(1)} / 10 ⭐</span>
                {ratingsCount > 0 && (
                  <span className="text-gray-200 ml-2 font-normal">
                    ({ratingsCount} {ratingsCount === 1 ? "user" : "users"} rated)
                  </span>
                )}
              </p>
            )}


            {/* TMDB Rating */}
            {movie.vote_average !== undefined && (
              <p>
                <span className="font-semibold text-gray-100">TMDB Rating:</span>{" "}
                <span className="text-yellow-400 font-bold">
                  {Number(movie.vote_average).toFixed(1)} / 10 ⭐
                  <span className="text-gray-200 ml-2 font-normal">
                    ({movie.vote_count.toLocaleString()} users rated)
                  </span>
                </span>
              </p>
            )}

          </div>

          <p>
            <span className="font-semibold text-gray-100">Release Date:</span>{" "}
            <span className="text-green-300">{movie.release_date}</span>
          </p>

          <p>
            <span className="font-semibold text-gray-100">Genres:</span>{" "}
            <span className="text-green-300">{movie.genres.map((g: any) => g.name).join(", ")}</span>
          </p>

          {director && (
            <p>
              <span className="font-semibold text-gray-100">Director:</span>{" "}
              <Link href={`/person/${director.id}`} className="text-red-300 hover:underline">
                {director.name}
              </Link>
            </p>
          )}

          {mainCast.length > 0 && (
            <p>
              <span className="font-semibold text-gray-100">Cast:</span>{" "}
              {mainCast.map((actor: any, idx: number) => (
                <span key={actor.id}>
                  <Link href={`/person/${actor.id}`} className="text-red-300 hover:underline">
                    {actor.name}
                  </Link>
                  {idx < mainCast.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
          )}


          {/* Overview */}
          <p className="text-gray-100 text-lg leading-relaxed tracking-wide mt-4">{movie.overview}</p>

          {/* User Rating */}
          {token && (
            <div className="mt-6">
              <h2 className="text-2xl font-semibold text-gray-200 mb-2">Your Rating</h2>
              <p className="pb-2 text-yellow-400 font-semibold">Set or change your rating here.</p>
              <div className="flex items-center gap-3">
                <label htmlFor="rating" className="font-semibold">Rate this movie:</label>
                <input
                  id="rating"
                  type="text"
                  value={userRating ?? ""}
                  placeholder="0-10"
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") return setUserRating(null);

                    const match = val.match(/^(10(\.0?)?|[0-9](\.[0-9])?)$/);
                    if (match) {
                      const parsed = parseFloat(val);
                      setUserRating(parsed);
                      handleRatingChange(parsed);
                    }
                  }}
                  className="w-20 p-1 rounded text-black"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Trailer */}
      {trailer && (
        <div className="mt-10 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-200 mb-3">Trailer</h2>
          <div className="relative w-full rounded-lg overflow-hidden" style={{ paddingTop: "56.25%" }}>
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title="Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            />
          </div>
        </div>
      )}

      {/* Screenshots */}
      {screenshots.length > 0 && (
        <div className="mt-12 max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">Screenshots</h2>
          <div className="flex overflow-x-auto gap-4 pb-4">
            {screenshots.map((img: any, idx: number) => (
              <img
                key={idx}
                src={`https://image.tmdb.org/t/p/w500${img.file_path}`}
                alt={`Screenshot ${idx + 1}`}
                className="rounded-lg w-64 h-36 object-cover flex-shrink-0 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setActiveScreenshot(idx)}
              />
            ))}
          </div>

          {/* Modal / Lightbox */}
          {activeScreenshot !== null && (
            <div
              className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-4"
              onClick={() => setActiveScreenshot(null)} // kliknutie mimo obrázku zatvorí modal
            >
              {/* X button */}
              <button
                className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-gray-300 z-50"
                onClick={(e) => {
                  e.stopPropagation(); // aby kliknutie na X nezavrelo modal dvakrát
                  setActiveScreenshot(null);
                }}
              >
                &times;
              </button>

              <img
                src={`https://image.tmdb.org/t/p/original${screenshots[activeScreenshot].file_path}`}
                alt={`Screenshot ${activeScreenshot + 1}`}
                className="max-h-[80vh] max-w-[80vw] rounded-lg shadow-lg object-contain z-40"
                onClick={(e) => e.stopPropagation()} // kliknutie na obrázok nezatvára modal
              />
            </div>
          )}


        </div>
      )}

      <Reviews movieId={movie.id} token={token} />


    </div>
  );
}
