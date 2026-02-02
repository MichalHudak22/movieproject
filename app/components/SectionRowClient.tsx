"use client";

import { useState } from "react";
import Link from "next/link";
import DraggableRow from "./DraggableRow";

const API = process.env.NEXT_PUBLIC_API_URL;

interface SectionRowClientProps {
  title: string;
  items: any[];
  type: "movie" | "series";
}

export default function SectionRowClient({ title, items, type }: SectionRowClientProps) {
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [loadingModal, setLoadingModal] = useState(false);

  // Otvor modal **až po fetch**, aby všetko bolo pripravené
  const handleOpenModal = async (item: any) => {
    setLoadingModal(true);
    setAverageRating(null);

    try {
      const res = await fetch(`${API}/api/ratings/${item.id}`);
      const data = await res.json();
      const avg =
        data.length > 0
          ? Number((data.reduce((sum: number, x: any) => sum + x.rating, 0) / data.length).toFixed(1))
          : null;
      setAverageRating(avg);
    } catch (err) {
      console.error("Failed to load rating", err);
      setAverageRating(null);
    } finally {
      // minimalny delay, aby modal neblikol pri extrémne rychlom fetchi
      setTimeout(() => {
        setSelectedItem(item); // otvor modal až keď máme rating
        setLoadingModal(false);
      }, 300); // 0.3s delay, môžeš zvýšiť na 500ms ak treba
    }
  };

  return (
    <div className="mb-12">
      <h2 className="text-lg md:text-xl lg:text-2xl text-gray-200 font-bold mb-4">{title}</h2>
      <DraggableRow>
        {items.map((item, index) => (
          <div
            key={`${type}-${item.id}-${index}`} // unikátny key
            className="min-w-[150px] md:min-w-[180px] bg-gray-800/60 rounded-lg p-2 hover:scale-105 transition-transform cursor-pointer"
            onClick={() => handleOpenModal(item)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              alt={item.title || item.name}
              className="rounded-lg mb-2 w-full h-48 md:h-56 object-cover"
            />
            <h3 className="text-sm md:text-base font-semibold text-gray-100">
              {item.title || item.name}
            </h3>
          </div>
        ))}
      </DraggableRow>

      {/* ================= MODAL ================= */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-black/85 rounded-lg shadow-xl w-full max-w-md sm:max-w-xl md:max-w-4xl max-h-[90vh] md:max-h-none overflow-hidden flex flex-col md:flex-row relative">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-3 right-3 z-20 text-red-600 text-2xl font-bold hover:scale-125 transition"
            >
              &times;
            </button>

            <div className="flex flex-col md:flex-row overflow-y-auto md:overflow-visible">
              <div className="md:w-1/3 flex-shrink-0 p-3 md:p-4">
                <img
                  src={`https://image.tmdb.org/t/p/w500${selectedItem.poster_path}`}
                  alt={selectedItem.title || selectedItem.name}
                  className="rounded-lg w-full object-cover max-h-[35vh] md:max-h-none mx-auto"
                />
              </div>

              <div className="md:w-2/3 p-3 md:p-4 flex flex-col gap-2">
                <h2 className="text-lg sm:text-xl md:text-3xl font-bold">
                  {selectedItem.title || selectedItem.name}
                </h2>

                {/* Users Rating je už načítaný */}
                {averageRating !== null && (
                  <p>
                    <span className="font-semibold text-gray-200">Users Rating: </span>
                    <span className="text-yellow-400 font-bold">
                      {averageRating.toFixed(1)} / 10 ⭐
                    </span>
                  </p>
                )}

                {selectedItem.vote_average !== undefined && (
                  <p>
                    <span className="font-semibold text-gray-200">TMDB Rating: </span>
                    <span className="text-yellow-400 font-semibold">
                      {Number(selectedItem.vote_average).toFixed(1)} / 10 ⭐
                    </span>
                  </p>
                )}

                {selectedItem.release_date && (
                  <p>
                    <span className="font-semibold text-gray-200">Release Date: </span>
                    <span className="text-green-300">{selectedItem.release_date}</span>
                  </p>
                )}
                {selectedItem.first_air_date && (
                  <p>
                    <span className="font-semibold text-gray-200">First Air Date: </span>
                    <span className="text-green-300">{selectedItem.first_air_date}</span>
                  </p>
                )}

                <p className="text-gray-300 text-sm md:text-base line-clamp-5 md:line-clamp-none">
                  {selectedItem.overview}
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href={`/${type}/${selectedItem.id}`}
                    className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition shadow-md"
                  >
                    More Info
                  </Link>

                  <button
                    onClick={() => setSelectedItem(null)}
                    className="bg-gray-800 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition shadow-md"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Malý loading overlay ak treba */}
      {loadingModal && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center text-white font-bold text-xl">
          Loading...
        </div>
      )}
    </div>
  );
}
