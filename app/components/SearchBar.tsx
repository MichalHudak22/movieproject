'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type SearchType = 'multi' | 'tv' | 'person';

const PLACEHOLDERS: Record<SearchType, string> = {
  multi: 'Search for movies, TV shows, or actors...',
  tv: 'Search for TV shows...',
  person: 'Search for actors...',
};

export default function SearchBar({ searchType = 'multi' }: { searchType?: SearchType }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (!value) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(value)}&type=${searchType}`);
      const data = await res.json();

      setResults(data.results || []);
      setIsOpen(data.results.length > 0);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
      setIsOpen(false);
    }
  };

  // 👇 bezpečné získanie URL s fallbackom
  const getPosterUrl = (item: any) => {
    if (!item) return '/defaultimg.jpg';
    if (item.poster_path) return `https://image.tmdb.org/t/p/w200${item.poster_path}`;
    if (item.profile_path) return `https://image.tmdb.org/t/p/w200${item.profile_path}`;
    return '/defaultimg.jpg';
  };

  const getHref = (item: any) => {
    if (item.media_type === 'movie') return `/movie/${item.id}`;
    if (item.media_type === 'tv') return `/series/${item.id}`;
    if (item.media_type === 'person') return `/person/${item.id}`;

    // fallback pre searchType
    if (searchType === 'tv') return `/series/${item.id}`;
    if (searchType === 'person') return `/person/${item.id}`;

    return `/movie/${item.id}`;
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto" ref={containerRef}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={PLACEHOLDERS[searchType]}
        className="px-4 py-2 w-full rounded-lg text-black border border-black
                   focus:border-gray-200 focus:ring-1 focus:ring-blue-500
                   outline-none transition
                   relative z-20"
      />

      {isOpen && results.length > 0 && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-85 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute top-full left-0 right-0 mt-1 z-20">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-black p-3 rounded-lg">
              {results.map((item, index) => (
                <Link
                  key={item.id}
                  href={getHref(item)}
                  onClick={() => setIsOpen(false)}
                  className="bg-gray-900 rounded-lg p-2 hover:scale-105 transition relative"
                >
                  <div className="relative w-full h-32">
                    <Image
                      src={getPosterUrl(item)}
                      alt={item.title || item.name || 'Poster'}
                      width={200}
                      height={300}
                      unoptimized // ⚡ dôležité pre zabránenie 500 Internal Server Error
                      className="rounded-lg object-cover w-full h-32"
                    />
                  </div>
                  <p className="text-white text-sm mt-1 truncate">{item.title || item.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
