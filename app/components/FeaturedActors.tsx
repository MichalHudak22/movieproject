'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getPersonDetails } from '@/lib/tmdb';
import Image from 'next/image';

interface Person {
  id: number;
  name: string;
  profile_path: string | null;
}

const featuredIds = [
  { id: 1100, label: 'Legendary Icon' }, // Arnold Schwarzenegger – TMDB ID 1100
  { id: 974169, label: 'Rising Star' }, // Jenna Ortega – TMDB ID 974169
  { id: 206, label: 'The Funniest' }, // Jim Carrey – TMDB ID 206
];

export default function FeaturedActors() {
  const [actors, setActors] = useState<(Person & { label: string })[]>([]);

  useEffect(() => {
    async function loadActors() {
      const results: any[] = [];

      for (const a of featuredIds) {
        try {
          const detail: any = await getPersonDetails(a.id);
          results.push({
            id: detail.id,
            name: detail.name,
            profile_path: detail.profile_path,
            label: a.label,
          });
        } catch (err) {
          console.error('Failed to fetch actor', a.id, err);
        }
      }

      setActors(results);
    }

    loadActors();
  }, []);

  return (
    <section className="mb-12 w-[95%] md:w-[75%] mx-auto">
      <h2 className="text-2xl font-bold mb-7 text-gray-200">Star Highlights</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-12">
        {actors.map(actor => (
          <Link
            key={actor.id}
            href={`/person/${actor.id}`}
            className="bg-gray-900/50 hover:bg-black/80 border-2 border-red-800/30 hover:border-red-600/30 rounded-2xl overflow-hidden p-4 flex flex-col items-center hover:scale-105 transition-transform"
          >
            <p className="text-lg md:text-2xl text-red-300 pb-5 font-semibold animate-gradient-red">
              {actor.label}
            </p>

            {actor.profile_path ? (
              <div className="w-40 h-40 mb-3 rounded-full overflow-hidden">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                  alt={actor.name}
                  width={160}
                  height={160}
                  className="rounded-full object-cover"
                  style={{ width: '160px', height: '160px' }} // explicitne obe dimenzie
                  priority
                />
              </div>
            ) : (
              <div className="w-40 h-40 rounded-full bg-gray-700 mb-3 flex items-center justify-center">
                <span className="text-gray-400">No Image</span>
              </div>
            )}

            <h3 className="text-lg font-semibold text-center">{actor.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
