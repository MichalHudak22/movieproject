'use client';

import { useEffect, useState } from 'react';
import { getPersonDetails, getPersonCredits } from '@/lib/tmdb';
import Link from 'next/link';
import DraggableRow from '@/app/components/DraggableRow';
import Image from 'next/image';

interface PersonDetailProps {
  params: { id: string };
}

export default function PersonDetail({ params }: PersonDetailProps) {
  const id = Number(params.id);

  const [person, setPerson] = useState<any | null>(null);
  const [credits, setCredits] = useState<any[]>([]);
  const [popularity, setPopularity] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [personData, creditsData] = await Promise.all([
        getPersonDetails(id),
        getPersonCredits(id),
      ]);

      setPerson(personData);

      // Spojíme cast + crew, filtrujeme a zoradíme podľa popularity
      const allCredits = [...creditsData.cast, ...creditsData.crew]
        .filter((c: any) => c.poster_path || c.profile_path)
        .sort((a: any, b: any) => (b.popularity || 0) - (a.popularity || 0));

      setCredits(allCredits);

      // popularity len na client side, aby sme predišli hydration warning
      setPopularity(personData.popularity || null);
    };

    fetchData();
  }, [id]);

  if (!person) return <p className="text-white">Loading...</p>;

  // Rozdelenie podľa media_type
  const movies = credits.filter((c: any) => c.media_type === 'movie');
  const tvShows = credits.filter((c: any) => c.media_type === 'tv');
  const others = credits.filter((c: any) => c.media_type !== 'movie' && c.media_type !== 'tv');

  return (
    <div className="min-h-screen text-white px-4 md:px-6 py-6 lg:py-8">
      {/* Hlavný blok: profil + info */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 mb-10">
        <div className="w-full md:w-1/3 h-[400px] flex-none relative rounded-lg overflow-hidden">
          <Image
            src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
            alt={person.name}
            width={300}
            height={400}
            className="object-cover w-full h-full rounded-lg"
          />
        </div>

        <div className="md:w-2/3 flex flex-col gap-2 md:gap-4 text-xs md:text-sm lg:text-base">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-100">{person.name}</h1>

          <p>
            <span className="font-semibold text-gray-100">Birthday:</span>{' '}
            <span className="text-green-300">{person.birthday || 'Unknown'}</span>
          </p>

          <p>
            <span className="font-semibold text-gray-100">Place of Birth:</span>{' '}
            <span className="text-green-300">{person.place_of_birth || 'Unknown'}</span>
          </p>

          <p>
            <span className="font-semibold text-gray-100">Popularity:</span>{' '}
            <span className="text-yellow-400 font-bold">
              {popularity !== null ? popularity.toFixed(1) : 'N/A'}
            </span>
          </p>

          <p className="text-gray-100 text-xs lg:text-base leading-relaxed tracking-wide mt-2 md:mt-4">
            {person.biography || 'No biography available.'}
          </p>
        </div>
      </div>

      {/* Carousely */}
      {movies.length > 0 && <SectionCarousel title="Movies" credits={movies} />}
      {tvShows.length > 0 && <SectionCarousel title="TV Shows" credits={tvShows} />}
      {others.length > 0 && <SectionCarousel title="Other Projects" credits={others} />}
    </div>
  );
}

// --------------------------------------------------
// Reusable Carousel komponent
// --------------------------------------------------
function SectionCarousel({ title, credits }: { title: string; credits: any[] }) {
  return (
    <div className="mb-12 max-w-6xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-200 mb-4">{title}</h2>
      <div className="overflow-x-auto no-scrollbar pb-4">
        <DraggableRow>
          {credits.map((item: any, idx: number) => (
            <Link
              key={`${item.media_type}-${item.id}-${idx}`} // unikátny key
              href={`/${item.media_type === 'tv' ? 'series' : item.media_type}/${item.id}`}
              className="min-w-[150px] md:min-w-[180px] bg-gray-800/70 rounded-lg p-2 hover:scale-105 transition-transform flex-shrink-0"
            >
              <div className="w-full h-48 md:h-56 mb-2 rounded-lg overflow-hidden">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path || item.profile_path}`}
                  alt={item.title || item.name}
                  width={180}
                  height={270}
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>

              <h3 className="text-sm md:text-base font-semibold text-gray-100">
                {item.title || item.name}
              </h3>
              <p className="text-xs md:text-sm text-gray-400">
                {item.character ? `as ${item.character}` : item.job || ''}
              </p>
            </Link>
          ))}
        </DraggableRow>
      </div>
    </div>
  );
}
