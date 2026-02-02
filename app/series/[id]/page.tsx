'use client';

import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getTVDetails, getTVCredits, getTVVideos, getTVImages } from '@/lib/tmdb';
import Reviews from '../../components/Reviews';
import Image from 'next/image';

const API = process.env.NEXT_PUBLIC_API_URL;

interface TVDetailProps {
  params: { id: string };
}

export default function TVDetail({ params }: TVDetailProps) {
  const id = Number(params.id);
  const { token } = useContext(AuthContext);

  const [tv, setTv] = useState<any>(null);
  const [credits, setCredits] = useState<any>(null);
  const [videos, setVideos] = useState<any>(null);
  const [images, setImages] = useState<any>(null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [activeScreenshot, setActiveScreenshot] = useState<number | null>(null);
  const [ratingsCount, setRatingsCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const [tvData, creditsData, videosData, imagesData] = await Promise.all([
        getTVDetails(id),
        getTVCredits(id),
        getTVVideos(id),
        getTVImages(id),
      ]);

      setTv(tvData);
      setCredits(creditsData);
      setVideos(videosData);
      setImages(imagesData);

      // fetch all ratings for this TV show
      try {
        const res = await fetch(`${API}/api/ratings/${tvData.id}?type=series`);
        const data = await res.json();

        if (data.length > 0) {
          const avg = data.reduce((acc: number, r: any) => acc + r.rating, 0) / data.length;
          setAverageRating(Number(avg.toFixed(1)));
          setRatingsCount(data.length); // pridáme počet hodnotiacich
        } else {
          setRatingsCount(0);
        }

        // fetch current user's rating
        if (token) {
          const userRes = await fetch(`${API}/api/ratings/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const myRatings = await userRes.json();
          const myRating = myRatings.find(
            (r: any) => r.imdb_id === tvData.id.toString() && r.type === 'series',
          );
          if (myRating) setUserRating(myRating.rating);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id, token]);

  const handleRatingChange = async (value: number) => {
    if (!token || !tv) return;
    setUserRating(value);

    try {
      await fetch(`${API}/api/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imdb_id: tv.id.toString(), type: 'series', rating: value }),
      });

      // reload all ratings for average
      const res = await fetch(`${API}/api/ratings/${tv.id}?type=series`);
      const data = await res.json();
      if (data.length > 0) {
        const avg = data.reduce((acc: number, r: any) => acc + r.rating, 0) / data.length;
        setAverageRating(Number(avg.toFixed(1)));
        setRatingsCount(data.length); // aktualizujeme počet
      } else {
        setRatingsCount(0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!tv || !credits || !videos || !images) return <p className="text-white">Loading...</p>;

  const creator = tv.created_by?.[0];
  const composer = credits.crew.find(
    (c: any) => c.job === 'Original Music Composer' || c.job === 'Composer',
  );
  const mainCast = credits.cast.slice(0, 5);
  const trailer = videos.results.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
  const screenshots = images.backdrops.slice(0, 10);

  return (
    <div className="min-h-screen text-white px-6 py-8">
      {/* Hlavný blok */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 mb-8">
        {/* Poster */}
        <div className="w-2/3 md:w-1/3 rounded overflow-hidden">
          <Image
            src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
            alt={tv.name}
            width={300}
            height={450}
            className="object-cover w-full h-auto rounded"
          />
        </div>

        {/* Info */}
        <div className="md:w-2/3 flex flex-col gap-1 md:gap-2 text-xs md:text-sm lg:text-base">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-100">{tv.name}</h1>

          {/* Ratings */}
          <div className="flex flex-col gap-1 md:mt-2">
            {/* Users Rating */}
            {averageRating !== null && (
              <p className="mt-2 md:mt-4">
                <span className="font-semibold text-gray-100">Users Rating:</span>{' '}
                <span className="text-yellow-400 font-bold">
                  {averageRating.toFixed(1)} / 10 ⭐
                </span>
                {ratingsCount > 0 && (
                  <span className="text-gray-200 ml-2 font-normal">
                    ({ratingsCount} {ratingsCount === 1 ? 'user' : 'users'} rated)
                  </span>
                )}
              </p>
            )}

            {/* TMDB Rating */}
            {tv.vote_average !== undefined && (
              <p>
                <span className="font-semibold text-gray-100">TMDB Rating:</span>{' '}
                <span className="text-yellow-400 font-bold">
                  {Number(tv.vote_average).toFixed(1)} / 10 ⭐
                  <span className="text-gray-200 ml-2 font-normal">
                    ({tv.vote_count.toLocaleString()} users rated)
                  </span>
                </span>
              </p>
            )}
          </div>

          <p>
            <span className="font-semibold text-gray-100">First Air Date:</span>{' '}
            <span className="text-green-300">{tv.first_air_date}</span>
          </p>

          <p>
            <span className="font-semibold text-gray-100">Genres:</span>{' '}
            <span className="text-green-300">{tv.genres.map((g: any) => g.name).join(', ')}</span>
          </p>

          {creator && (
            <p>
              <span className="font-semibold text-gray-100">Creator:</span>{' '}
              <Link href={`/person/${creator.id}`} className="text-red-300 hover:underline">
                {creator.name}
              </Link>
            </p>
          )}

          {mainCast.length > 0 && (
            <p>
              <span className="font-semibold text-gray-100">Cast:</span>{' '}
              {mainCast.map((actor: { id: number; name: string }, idx: number) => (
                <span key={actor.id}>
                  <Link href={`/person/${actor.id}`} className="text-red-300 hover:underline">
                    {actor.name}
                  </Link>
                  {idx < mainCast.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>
          )}

          {composer && (
            <p>
              <span className="font-semibold text-gray-100">Music:</span>{' '}
              <Link href={`/person/${composer.id}`} className="text-red-300 hover:underline">
                {composer.name}
              </Link>
            </p>
          )}

          {/* Overview */}
          <p className="text-gray-100 md:text-base lg:text-lg leading-relaxed tracking-wide mt-4">
            {tv.overview}
          </p>

          {/* User Rating */}
          {token && (
            <div className="mt-6">
              <h2 className="text-2xl font-semibold text-gray-200 mb-2">Your Rating</h2>
              <p className="pb-2 text-yellow-400 font-semibold">Set or change your rating here.</p>
              <div className="flex items-center gap-3">
                <label htmlFor="rating" className="font-semibold">
                  Rate this series:
                </label>
                <input
                  id="rating"
                  type="text"
                  value={userRating ?? ''}
                  placeholder="0-10"
                  onChange={e => {
                    const val = e.target.value;
                    if (val === '') return setUserRating(null);

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
          <div
            className="relative w-full rounded-lg overflow-hidden"
            style={{ paddingTop: '56.25%' }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title="Trailer"
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
              <div
                key={idx}
                className="flex-shrink-0 cursor-pointer hover:scale-105 transition-transform rounded-lg w-64 h-36 overflow-hidden"
                onClick={() => setActiveScreenshot(idx)}
              >
                <Image
                  src={`https://image.tmdb.org/t/p/w500${img.file_path}`}
                  alt={`Screenshot ${idx + 1}`}
                  width={256} // w-64 = 16rem ≈ 256px
                  height={144} // h-36 = 9rem ≈ 144px
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <Reviews movieId={tv.id} token={token} type="series" />

      {/* Modal */}
      {activeScreenshot !== null && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActiveScreenshot(null)}
        >
          {/* X button */}
          <button
            className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-gray-300 z-50"
            onClick={e => {
              e.stopPropagation(); // aby kliknutie na X nezavrelo modal dvakrát
              setActiveScreenshot(null);
            }}
          >
            &times;
          </button>

          {/* Screenshot */}
          <div
            className="relative max-h-[80vh] max-w-[80vw] rounded-lg shadow-lg"
            onClick={e => e.stopPropagation()} // kliknutie na obrázok nezatvára modal
          >
            <Image
              src={`https://image.tmdb.org/t/p/original${screenshots[activeScreenshot].file_path}`}
              alt={`Screenshot ${activeScreenshot + 1}`}
              width={1024} // približná šírka podľa max-w-[80vw]
              height={576} // zachovanie pomeru 16:9 alebo podľa potreby
              className="object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
