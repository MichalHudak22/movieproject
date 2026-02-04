'use client';

import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { getMovieDetails, getTVDetails } from '@/lib/tmdb';
import RatingsGrid from '../components/RatingsGrid';
import DeleteAccount from '../components/DeleteAccount';

const API = process.env.NEXT_PUBLIC_API_URL; // 🔥 jednotné API

interface User {
  username: string;
  email: string;
}

interface Rating {
  imdb_id: string;
  type: 'movie' | 'series';
  rating: number;
  title?: string;
  poster?: string;
  averageRating?: number | null;
}

// Funkcia na rank podľa hlasov
function getRank(votes: number) {
  if (votes >= 40) return '👑 Cinema Legend';
  if (votes >= 20) return '⭐ Movie Master';
  if (votes >= 10) return '🎥 Film Analyst';
  if (votes >= 5) return '🍿 Cinema Explorer';
  return '🎬 Movie Rookie';
}

export default function ProfilePage() {
  const { token, setToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [userRank, setUserRank] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!token) return;

    const init = async () => {
      try {
        // 1️⃣ načítame údaje používateľa
        const userRes = await fetch(`${API}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData: User = await userRes.json();
        setUser(userData);

        // 2️⃣ načítame hodnotenia používateľa
        const ratingsRes = await fetch(`${API}/api/ratings/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data: Rating[] = await ratingsRes.json();

        // 3️⃣ obohatíme hodnotenia o title, poster, averageRating
        const enriched: Rating[] = await Promise.all(
          data.map(async r => {
            try {
              const details =
                r.type === 'movie'
                  ? await getMovieDetails(Number(r.imdb_id))
                  : await getTVDetails(Number(r.imdb_id));

              const title = r.type === 'movie' ? details.title : details.name;
              const poster = details.poster_path ?? null;

              const avgRes = await fetch(`${API}/api/ratings/${r.imdb_id}`);
              const allRatings = await avgRes.json();
              const average =
                allRatings.length > 0
                  ? Number(
                      (
                        allRatings.reduce((sum: number, x: any) => sum + x.rating, 0) /
                        allRatings.length
                      ).toFixed(1),
                    )
                  : null;

              return { ...r, title, poster, averageRating: average };
            } catch {
              return r;
            }
          }),
        );

        setRatings(enriched);

        // 4️⃣ načítame hlasovanie pre rank
        const leaderboardRes = await fetch(`${API}/api/leaderboard?type=all`);
        const leaderboardData = await leaderboardRes.json();

        // nájdeme používateľa podľa username
        const currentUser = leaderboardData.find((u: any) => u.username === userData.username);
        if (currentUser) {
          const votes = Number(currentUser.votes_count);
          setUserRank(getRank(votes));
        } else {
          setUserRank(getRank(0));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [token]);

  useEffect(() => {
    if (token === null && !loading) {
      router.push('/login');
    }
  }, [token, loading, router]);

  const handleRatingChange = async (
    imdb_id: string,
    type: 'movie' | 'series',
    newRating: number,
  ) => {
    if (!token) return;

    setRatings(prev => prev.map(r => (r.imdb_id === imdb_id ? { ...r, rating: newRating } : r)));

    try {
      await fetch(`${API}/api/ratings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ imdb_id, type, rating: newRating }),
      });

      const ratingsRes = await fetch(`${API}/api/ratings/${imdb_id}`);
      const allRatings = await ratingsRes.json();
      const avg =
        allRatings.length > 0
          ? Number(
              (
                allRatings.reduce((a: number, b: any) => a + b.rating, 0) / allRatings.length
              ).toFixed(1),
            )
          : null;

      setRatings(prev => prev.map(r => (r.imdb_id === imdb_id ? { ...r, averageRating: avg } : r)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveRating = async (imdb_id: string) => {
    if (!token) return;

    try {
      await fetch(`${API}/api/ratings/${imdb_id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      setRatings(prev => prev.filter(r => r.imdb_id !== imdb_id));
    } catch (err) {
      console.error(err);
    }
  };

  const getUrlType = (type: 'movie' | 'series') => (type === 'movie' ? 'movie' : 'series');

  if (loading || !user) {
    return <p className="text-white text-center mt-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-transparent text-white font-sans px-2 md:px-6 py-5 lg:py-8">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="text-xl md:text-3xl lg:text-5xl font-bold md:my-4 text-gray-100">
          Welcome <span className="text-red-400 animate-gradient-red">{user.username}</span>
        </h1>

        {/* 🏆 Rank používateľa */}
        {userRank && (
          <p className="text-sm lg:text-lg text-yellow-400 font-semibold mt-1">{userRank}</p>
        )}

        <p className="text-md lg:text-2xl max-w-7xl mx-auto text-left lg:text-center p-2 text-gray-200 animate-gradient-lighted pt-2">
          This is your personal profile in our movie database. Here you can see the movies and TV
          shows you’ve rated, update your ratings, and check out the average ratings from other
          users. Have fun exploring and discovering new favorites!
        </p>
      </div>

      {/* Ratings Grid */}
      <RatingsGrid
        ratings={ratings}
        token={token}
        onRatingChange={handleRatingChange}
        onDeleteRating={handleRemoveRating}
        getUrlType={getUrlType}
      />

      {token && (
        <DeleteAccount
          token={token}
          onAccountDeleted={() => {
            setToken(null);
            router.push('/login');
          }}
        />
      )}
    </div>
  );
}
