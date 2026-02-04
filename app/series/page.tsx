'use client'; // teraz je client component, aby fungovalo useState

import { useState, useEffect } from 'react';
import { getTrendingTV, getPopularTV, getTopRatedTV } from '@/lib/tmdb';
import SearchBar from '@/app/components/SearchBar';
import SectionRowClient from '@/app/components/SectionRowClient';

export default function TVPage() {
  const [trending, setTrending] = useState<any[]>([]);
  const [popular, setPopular] = useState<any[]>([]);
  const [topRated, setTopRated] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const trendingData = await getTrendingTV();
      const popularData = await getPopularTV();
      const topRatedData = await getTopRatedTV();

      const dedupe = (arr: any[]) => Array.from(new Map(arr.map(item => [item.id, item])).values());

      setTrending(dedupe(trendingData.results));
      setPopular(dedupe(popularData.results));
      setTopRated(dedupe(topRatedData.results));
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-transparent text-white font-sans px-2 md:px-6 py-5 lg:py-8">
      {/* Nadpis */}
      <div className="text-center mb-5">
        <h1 className="text-xl md:text-3xl lg:text-5xl font-bold md:my-4 text-gray-100">
          Discover Your <span className="text-red-700 animate-gradient-red">Favorite TV Show</span>
        </h1>
        <p className="text-lg lg:text-2xl text-gray-200 animate-gradient-lighted pt-2">
          Explore the best and most popular TV shows. Choose one and start watching!
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-12">
        <SearchBar searchType="tv" />
      </div>

      {/* Sekcie s modalnými oknami */}
      {trending.length > 0 && <SectionRowClient title="Trending" items={trending} type="series" />}
      {popular.length > 0 && <SectionRowClient title="Popular" items={popular} type="series" />}
      {topRated.length > 0 && <SectionRowClient title="Top Rated" items={topRated} type="series" />}
    </div>
  );
}
