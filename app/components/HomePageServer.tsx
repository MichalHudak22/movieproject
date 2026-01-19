import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getTopRatedTV,
} from "@/lib/tmdb";
import SectionRowClient from "./SectionRowClient"; // client komponent pre modal
import SearchBar from "@/app/components/SearchBar";

export default async function HomePageServer() {
  const trendingData = await getTrendingMovies();
  const popularData = await getPopularMovies();
  const topRatedData = await getTopRatedMovies();
  const topTVData = await getTopRatedTV();

  const trending = trendingData.results;
  const popular = popularData.results;
  const topRated = topRatedData.results;
  const topSeries = topTVData.results;

  return (
    <div className="min-h-screen bg-transparent text-white font-sans px-2 md:px-6 py-8">
      <div className="text-center mb-5">
        <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold md:my-4">
          Welcome to the <span className="text-red-700 animate-gradient-red">CinemaSpace</span>
        </h1>
        <p className="text-lg lg:text-2xl text-gray-200 animate-gradient-lighted">
          Millions of movies, TV shows, and people are waiting for you. Discover them now.
        </p>
      </div>

      <div className="mb-12">
        <SearchBar searchType="multi" />
      </div>

      <SectionRowClient title="Trending" items={trending} type="movie" />
      <SectionRowClient title="Popular" items={popular} type="movie" />
      <SectionRowClient title="Top Rated" items={topRated} type="movie" />
      <SectionRowClient title="Top Series" items={topSeries} type="series" />
    </div>
  );
}
