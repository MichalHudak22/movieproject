import { getTrendingMovies, getPopularMovies, getTopRatedMovies, getTopRatedTV } from '@/lib/tmdb';
import Link from 'next/link';
import SearchBar from '@/app/components/SearchBar';
import DraggableRow from '@/app/components/DraggableRow';
import SectionRowClient from './components/SectionRowClient';
import HomeTopRatedByUsers from '@/app/components/HomeTopRatedByUsers';
import LeaderboardUsers from '@/app/components/LeaderboardUsers';
import Image from 'next/image';

export default async function Home() {
  const trendingData = await getTrendingMovies();
  const popularData = await getPopularMovies();
  const topRatedData = await getTopRatedMovies();
  const topTVData = await getTopRatedTV();

  const trending = trendingData.results;
  const popular = popularData.results;
  const topRated = topRatedData.results;
  const topSeries = topTVData.results;

  return (
    <div className="min-h-screen bg-transparent text-white font-sans px-2 md:px-6 py-5 lg:py-8">
      <div className="text-center mb-5">
        <h1 className="text-xl md:text-3xl lg:text-5xl font-bold md:my-4">
          Explore the <span className="text-red-700 animate-gradient-red">Cinematic Universe.</span>
        </h1>
        <p className="text-md lg:text-2xl text-gray-200 animate-gradient-lighted pt-2">
          Millions of movies, TV shows, and people are waiting for you. Discover them now.
        </p>
      </div>

      <div className="mb-12">
        <SearchBar searchType="multi" />
      </div>

      <HomeTopRatedByUsers />

      <SectionRowClient title="Trending Movies" items={trending} type="movie" />
      <SectionRowClient title="Popular Movies" items={popular} type="movie" />
      <SectionRowClient title="Top Rated Movies" items={topRated} type="movie" />
      <SectionRowClient title="Top Series" items={topSeries} type="series" />

      <div className="mb-10">
        <LeaderboardUsers />
      </div>
    </div>
  );
}

function SectionRow({
  title,
  items,
  type,
}: {
  title: string;
  items: any[];
  type: 'movie' | 'series';
}) {
  return (
    <div className="mb-12">
      <h2 className="text-xl md:text-2xl font-bold mb-4">{title}</h2>

      {/* Drag scrollbar */}
      <DraggableRow>
        {items.map(item => (
          <Link
            key={item.id}
            href={`/${type}/${item.id}`}
            className="min-w-[150px] bg-gray-800/60 rounded-lg p-2 hover:scale-105 transition-transform"
          >
            <div className="w-[150px] h-[225px] mb-2">
              <Image
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.title || item.name}
                width={150}
                height={225}
                unoptimized
                className="rounded-lg object-cover"
              />
            </div>

            <h3 className="text-sm font-semibold">{item.title || item.name}</h3>
          </Link>
        ))}
      </DraggableRow>
    </div>
  );
}
