import { getPersonDetails, getPersonCredits } from "@/lib/tmdb";
import Link from "next/link";
import DraggableRow from "@/app/components/DraggableRow";

interface PersonDetailProps {
  params: { id: string };
}

export default async function PersonDetail({ params }: PersonDetailProps) {
  const id = Number(params.id);

  const [person, credits] = await Promise.all([
    getPersonDetails(id),
    getPersonCredits(id),
  ]);

  // Spojíme cast + crew a zoradíme podľa popularity
  const allCredits = [...credits.cast, ...credits.crew]
    .filter((c: any) => c.poster_path || c.profile_path)
    .sort((a: any, b: any) => (b.popularity || 0) - (a.popularity || 0));

  // Rozdelenie podľa media_type
  const movies = allCredits.filter((c: any) => c.media_type === "movie");
  const tvShows = allCredits.filter((c: any) => c.media_type === "tv");
  const others = allCredits.filter(
    (c: any) => c.media_type !== "movie" && c.media_type !== "tv"
  );

  return (
    <div className="min-h-screen text-white px-6 py-8">
      {/* Hlavný blok: profil + info */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 mb-8">
        <img
          src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
          alt={person.name}
          className="rounded-lg md:w-1/3 md:h-[500px] object-cover flex-none"
        />

        <div className="md:w-2/3 flex flex-col gap-4">
          <h1 className="text-4xl font-bold text-gray-100">{person.name}</h1>

          <p>
            <span className="font-semibold text-gray-100">Birthday:</span>{" "}
            <span className="text-green-300">{person.birthday || "Unknown"}</span>
          </p>

          <p>
            <span className="font-semibold text-gray-100">Place of Birth:</span>{" "}
            <span className="text-green-300">{person.place_of_birth || "Unknown"}</span>
          </p>

          <p>
            <span className="font-semibold text-gray-100">Popularity:</span>{" "}
            <span className="text-green-300">{person.popularity?.toFixed(1) || "N/A"}</span>
          </p>

          <p className="text-gray-100 text-base leading-relaxed tracking-wide">
            {person.biography || "No biography available."}
          </p>
        </div>
      </div>

      {/* Credits Carousely */}
      {movies.length > 0 && <SectionCarousel title="Movies" credits={movies} />}
      {tvShows.length > 0 && <SectionCarousel title="TV Shows" credits={tvShows} />}
      {others.length > 0 && <SectionCarousel title="Other Projects" credits={others} />}
    </div>
  );
}

// Reusable Carousel komponent
function SectionCarousel({ title, credits }: { title: string; credits: any[] }) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-200 mb-4">{title}</h2>
      <div className="overflow-x-auto no-scrollbar pb-4 min-w-full">
        <DraggableRow>
          {credits.map((item: any) => (
            <Link
              key={item.id + item.media_type}
              href={`/${item.media_type === "tv" ? "series" : item.media_type}/${item.id}`}
              className="min-w-[150px] bg-gray-800 rounded-lg p-2 hover:scale-105 transition-transform flex-shrink-0"
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path || item.profile_path}`}
                alt={item.title || item.name}
                className="rounded-lg mb-2 object-cover w-full h-48"
              />
              <h3 className="text-sm font-semibold text-gray-100">{item.title || item.name}</h3>
              <p className="text-xs text-gray-400">
                {item.character ? `as ${item.character}` : item.job || ""}
              </p>
            </Link>
          ))}
        </DraggableRow>
      </div>
    </div>
  );
}
