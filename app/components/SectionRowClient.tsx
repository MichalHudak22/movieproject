"use client";

import { useState, useEffect } from "react";
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

    // ⬇️ VÝPOČET PRIEMERU – IDENTICKÁ LOGIKA AKO NA PROFILE
    useEffect(() => {
        if (!selectedItem) return;

        setAverageRating(null); // reset pri prepnutí filmu

        const loadAverageRating = async () => {
            try {
                const res = await fetch(`${API}/api/ratings/${selectedItem.id}`);

                const allRatings = await res.json();

                const avg =
                    allRatings.length > 0
                        ? Number(
                            (
                                allRatings.reduce(
                                    (sum: number, x: any) => sum + x.rating,
                                    0
                                ) / allRatings.length
                            ).toFixed(1)
                        )
                        : null;

                setAverageRating(avg);
            } catch (err) {
                console.error("Failed to load average rating", err);
                setAverageRating(null);
            }
        };

        loadAverageRating();
    }, [selectedItem?.id]);

    return (
        <div className="mb-12">
            <h2 className="text-lg md:text-xl lg:text-2xl text-gray-200 font-bold mb-4">{title}</h2>

            <DraggableRow>
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="min-w-[150px] bg-gray-800/60 rounded-lg p-2 hover:scale-105 transition-transform cursor-pointer"
                        onClick={() => setSelectedItem(item)}
                    >
                        <img
                            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                            alt={item.title || item.name}
                            className="rounded-lg mb-2 w-full h-48 object-cover"
                        />
                        <h3 className="text-sm font-semibold">
                            {item.title || item.name}
                        </h3>
                    </div>
                ))}
            </DraggableRow>

            {/* ================= MODAL ================= */}
            {selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 md:p-8 overflow-auto">
                    <div className="bg-black/85 rounded-lg shadow-xl max-w-4xl w-full md:flex md:gap-6 relative">
                        {/* Close button */}
                        <button
                            className="absolute top-3 right-3 text-red-600 hover:text-red-500 hover:scale-125 transition text-2xl font-bold"
                            onClick={() => setSelectedItem(null)}
                        >
                            &times;
                        </button>

                        {/* Poster */}
                        <div className="md:w-1/3 flex-shrink-0">
                            <img
                                src={`https://image.tmdb.org/t/p/w500${selectedItem.poster_path}`}
                                alt={selectedItem.title || selectedItem.name}
                                className="rounded-lg w-full object-cover"
                            />
                        </div>

                        {/* Info */}
                        <div className="md:w-2/3 p-4 flex flex-col gap-2">
                            <h2 className="text-2xl md:text-3xl font-bold">
                                {selectedItem.title || selectedItem.name}
                            </h2>

                            {/* ⭐ USER AVERAGE RATING */}
                            {averageRating !== null && (
                                <p>
                                    <span className="font-semibold text-gray-200">Users Rating: </span>
                                    <span className="text-yellow-400 font-bold">
                                        {averageRating.toFixed(1)} / 10 ⭐
                                    </span>
                                </p>
                            )}


                            {/* TMDB rating (voliteľné) */}
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
                                    <span className="font-semibold text-gray-200">
                                        Release Date:{" "}
                                    </span>
                                    <span className="text-green-300">
                                        {selectedItem.release_date}
                                    </span>
                                </p>
                            )}

                            {selectedItem.first_air_date && (
                                <p>
                                    <span className="font-semibold text-gray-200">
                                        First Air Date:{" "}
                                    </span>
                                    <span className="text-green-300">
                                        {selectedItem.first_air_date}
                                    </span>
                                </p>
                            )}

                            <p className="text-gray-300 text-sm md:text-base line-clamp-5">
                                {selectedItem.overview}
                            </p>

                            <div className="mt-4 flex gap-3">
                                <Link
                                    href={`/${type}/${selectedItem.id}`}
                                    className="inline-block bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
                                >
                                    More Info
                                </Link>

                                <button
                                    onClick={() => setSelectedItem(null)}
                                    className="inline-block bg-gray-800 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
