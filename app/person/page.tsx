import Link from 'next/link';
import DraggableRow from '@/app/components/DraggableRow';
import SearchBar from '@/app/components/SearchBar';
import FeaturedActors from '@/app/components/FeaturedActors';
import { getPopularPeople, getTrendingPeople, getRisingPeople } from '@/lib/tmdb';
import Image from 'next/image';

export default async function ActorsPage() {
  // Popular Actors
  const popularData = await getPopularPeople();
  const popular = popularData.results.filter((p: any) => p.profile_path);

  // Trending Actors
  const trendingData = await getTrendingPeople();
  const trending = trendingData.results.filter((p: any) => p.profile_path);

  return (
    <div className="min-h-screen bg-transparent text-white font-sans px-2 md:px-6 py-5 lg:py-8">
      {/* HEADER - identický ako v Home */}
      <div className="text-center mb-5">
          <h1 className="text-xl md:text-3xl lg:text-5xl font-bold md:my-4 text-gray-100">
          Discover the <span className="text-red-700 animate-gradient-red">Stars</span>
        </h1>
        <p className="text-md lg:text-2xl text-gray-200 animate-gradient-lighted pt-2">
          Explore trending actors, famous icons and rising stars of cinema.
        </p>
      </div>

      {/* SearchBar - presne ako Home */}
      <div className="mb-12">
        <SearchBar searchType="person" />
      </div>

      {/* Featured Actors */}
      <FeaturedActors />

      {/* Carousely */}
      <SectionCarousel title="Popular Actors" actors={popular} />
      <SectionCarousel title="Trending Actors" actors={trending} />
    </div>
  );
}

function SectionCarousel({ title, actors }: { title: string; actors: any[] }) {
  return (
    <div className="mb-12">
      <h2 className="text-lg md:text-xl lg:text-2xl text-gray-200 font-bold mb-4">{title}</h2>

      <div className="overflow-x-auto no-scrollbar pb-4 min-w-full">
        <DraggableRow>
          {actors.map((person: any) => (
            <Link
              key={person.id}
              href={`/person/${person.id}`}
              className="min-w-[150px] bg-gray-800/60 rounded-lg p-2 hover:scale-105 transition-transform"
            >
              <div className="relative w-full h-48 mb-2 rounded-lg overflow-hidden">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                  alt={person.name}
                  width={150}
                  height={150}
                  unoptimized
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-sm font-semibold">{person.name}</h3>
            </Link>
          ))}
        </DraggableRow>
      </div>
    </div>
  );
}
