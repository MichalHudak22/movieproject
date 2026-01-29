"use client";

import { useEffect, useState } from "react";

interface LeaderboardUser {
    id: number;
    username: string;
    votes_count: number;
    rank: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function LeaderboardUsers() {
    const [allUsers, setAllUsers] = useState<LeaderboardUser[]>([]);
    const [movieUsers, setMovieUsers] = useState<LeaderboardUser[]>([]);
    const [seriesUsers, setSeriesUsers] = useState<LeaderboardUser[]>([]);

    useEffect(() => {
        console.log("API URL used:", apiUrl);

        const fetchLeaderboard = async (type: "all" | "movie" | "series") => {
            try {
                const res = await fetch(`${apiUrl}/api/leaderboard?type=${type}`);
                if (!res.ok) throw new Error(`Failed to fetch leaderboard (${type})`);

                return await res.json();
            } catch (err) {
                console.error(err);
                return [];
            }
        };

        const loadLeaderboards = async () => {
            const [allData, movieData, seriesData] = await Promise.all([
                fetchLeaderboard("all"),
                fetchLeaderboard("movie"),
                fetchLeaderboard("series"),
            ]);

            setAllUsers(allData);
            setMovieUsers(movieData);
            setSeriesUsers(seriesData);
        };

        loadLeaderboards();
    }, []);

    const renderTable = (title: string, data: LeaderboardUser[]) => (
       <div className="mb-8 lg:mb-0 lg:flex-1 bg-black/70 lg:border border-gray-700 rounded-lg shadow-md overflow-hidden w-full max-w-[650px] mx-auto">
    <h2 className="text-sm sm:text-lg md:text-xl text-center font-bold px-3 py-2 sm:px-4 sm:py-3 bg-gray-800 animate-gradient-red border-b border-gray-700">
        {title}
    </h2>

    <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
            <thead>
                <tr className="bg-gray-900/70 text-red-700 text-center">
                    <th className="px-2 sm:px-3 py-2 border-r border-gray-700">#</th>
                    <th className="px-2 sm:px-3 py-2 border-r border-gray-700">User</th>
                    <th className="px-2 sm:px-3 py-2 border-r border-gray-700">Votes</th>
                    <th className="px-2 sm:px-3 py-2 hidden sm:table-cell">
                        Rank
                    </th>
                </tr>
            </thead>

            <tbody>
                {data.map((user, idx) => (
                    <tr
                        key={user.id}
                        className={idx % 2 === 0 ? "bg-black/70" : "bg-gray-900/70"}
                    >
                        <td className="px-2 sm:px-3 py-2 border-r border-gray-700 text-yellow-400 text-center">
                            {idx + 1}
                        </td>

                        <td className="px-2 sm:px-3 py-2 border-r border-gray-700 font-semibold tracking-wide text-center truncate max-w-[120px] sm:max-w-none">
                            {user.username}
                        </td>

                        <td className="px-2 sm:px-3 py-2 border-r border-gray-700 text-center">
                            {user.votes_count}
                        </td>

                        <td className="px-2 sm:px-3 py-2 hidden sm:table-cell text-yellow-400 text-center">
                            {user.rank}
                        </td>
                    </tr>
                ))}

                {data.length === 0 && (
                    <tr>
                        <td colSpan={4} className="px-3 py-4 text-center text-red-500">
                            No data available
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
</div>

    );

    return (
        <div className="w-full mx-auto">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-200">Top Voters & Rankings</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {renderTable("Film & Series Champions", allUsers)}
                {renderTable("Movie Masters", movieUsers)}
                {renderTable("Serial Experts", seriesUsers)}
            </div>
        </div>
    );
}
