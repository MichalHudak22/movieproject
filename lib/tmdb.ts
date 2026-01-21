const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const BASE_URL = "https://api.themoviedb.org/3";

if (!API_KEY) {
  console.warn("TMDB API key is missing! Fetches will fail.");
}

/* =====================================================================================
   HELPER – FETCH VIAC STRÁN (TMDB má max 20 / page)
===================================================================================== */
async function fetchMultiplePages(
  endpoint: string,
  totalResults: number,
  language = "en-US"
) {
  if (!API_KEY) return []; // ak nie je API key, vrátime prázdne pole

  const results: any[] = [];
  let page = 1;

  while (results.length < totalResults) {
    const res = await fetch(
      `${BASE_URL}${endpoint}?api_key=${API_KEY}&language=${language}&page=${page}`
    );

    if (!res.ok) {
      console.error(`TMDB fetch failed at ${endpoint}, page ${page}`);
      return results; // vrátime to, čo sme stihli nazbierať
    }

    const data = await res.json();
    results.push(...data.results);

    if (page >= data.total_pages) break;
    page++;
  }

  return results.slice(0, totalResults);
}


/* =====================================================================================
   FILMY
===================================================================================== */

// Trending movies – 30
export async function getTrendingMovies(limit = 30) {
  const results = await fetchMultiplePages(
    "/trending/movie/week",
    limit
  );
  return { results };
}

// Popular movies – 30
export async function getPopularMovies(limit = 30) {
  const results = await fetchMultiplePages(
    "/movie/popular",
    limit
  );
  return { results };
}

// Top rated movies – 30
export async function getTopRatedMovies(limit = 30) {
  const results = await fetchMultiplePages(
    "/movie/top_rated",
    limit
  );
  return { results };
}

// Movies by genre (ponechané na 20 – zvyčajne paginované)
export async function getMoviesByGenre(genreId: number, page: number = 1) {
  const res = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=en-US&page=${page}`
  );
  if (!res.ok) throw new Error("Failed to fetch movies by genre");
  return res.json();
}

// All movie genres
export async function getAllMovieGenres() {
  const res = await fetch(
    `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`
  );
  if (!res.ok) throw new Error("Failed to fetch genres list");
  return res.json();
}

/* =====================================================================================
   DETAIL FILMU
===================================================================================== */

export async function getMovieDetails(id: number) {
  const res = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`
  );
  if (!res.ok) throw new Error("Failed to fetch movie details");
  return res.json();
}

export async function getMovieCredits(id: number) {
  const res = await fetch(
    `${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}&language=en-US`
  );
  if (!res.ok) throw new Error("Failed to fetch movie credits");
  return res.json();
}

export async function getMovieVideos(id: number) {
  const res = await fetch(
    `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=en-US`
  );
  if (!res.ok) throw new Error("Failed to fetch movie videos");
  return res.json();
}

export async function getMovieImages(id: number) {
  const res = await fetch(
    `${BASE_URL}/movie/${id}/images?api_key=${API_KEY}`
  );
  if (!res.ok) throw new Error("Failed to fetch movie images");
  return res.json();
}

export async function getSimilarMovies(id: number) {
  const res = await fetch(
    `${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}&language=en-US&page=1`
  );
  if (!res.ok) throw new Error("Failed to fetch similar movies");
  return res.json();
}

/* =====================================================================================
   SERIÁLY
===================================================================================== */

// Trending TV – 30
export async function getTrendingTV(limit = 30) {
  const results = await fetchMultiplePages(
    "/trending/tv/week",
    limit
  );
  return { results };
}

// Popular TV – 30
export async function getPopularTV(limit = 30) {
  const results = await fetchMultiplePages(
    "/tv/popular",
    limit
  );
  return { results };
}

// Top rated TV – 30
export async function getTopRatedTV(limit = 30) {
  const results = await fetchMultiplePages(
    "/tv/top_rated",
    limit
  );
  return { results };
}

/* =====================================================================================
   DETAIL SERIÁLU
===================================================================================== */

export async function getTVDetails(id: number) {
  const res = await fetch(
    `${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=en-US`
  );
  if (!res.ok) throw new Error("Failed to fetch TV show details");
  return res.json();
}

export async function getTVCredits(id: number) {
  const res = await fetch(
    `${BASE_URL}/tv/${id}/credits?api_key=${API_KEY}&language=en-US`
  );
  if (!res.ok) throw new Error("Failed to fetch TV show credits");
  return res.json();
}

export async function getTVVideos(id: number) {
  const res = await fetch(
    `${BASE_URL}/tv/${id}/videos?api_key=${API_KEY}&language=en-US`
  );
  if (!res.ok) throw new Error("Failed to fetch TV show videos");
  return res.json();
}

export async function getTVImages(id: number) {
  const res = await fetch(
    `${BASE_URL}/tv/${id}/images?api_key=${API_KEY}`
  );
  if (!res.ok) throw new Error("Failed to fetch TV show images");
  return res.json();
}

/* =====================================================================================
   PERSON / ACTORS
===================================================================================== */

export async function getPersonDetails(personId: number) {
  const res = await fetch(
    `${BASE_URL}/person/${personId}?api_key=${API_KEY}&language=en-US`
  );
  if (!res.ok) throw new Error("Failed to fetch person details");
  return res.json();
}

export async function getPersonCredits(personId: number) {
  const res = await fetch(
    `${BASE_URL}/person/${personId}/combined_credits?api_key=${API_KEY}&language=en-US`
  );
  if (!res.ok) throw new Error("Failed to fetch person credits");
  return res.json();
}

export async function getPopularPeople(page: number = 1) {
  const res = await fetch(
    `${BASE_URL}/person/popular?api_key=${API_KEY}&language=en-US&page=${page}`
  );
  if (!res.ok) throw new Error("Failed to fetch popular people");
  return res.json();
}

export async function getTrendingPeople() {
  const res = await fetch(
    `${BASE_URL}/trending/person/week?api_key=${API_KEY}`
  );
  if (!res.ok) throw new Error("Failed to fetch trending actors");
  return res.json();
}

export async function getRisingPeople() {
  const res = await fetch(
    `${BASE_URL}/person/popular?api_key=${API_KEY}&page=2`
  );
  if (!res.ok) throw new Error("Failed to fetch rising stars");
  return res.json();
}

/* =====================================================================================
   SEARCH
===================================================================================== */

export async function searchMulti(query: string) {
  const res = await fetch(
    `${BASE_URL}/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
      query
    )}&page=1&include_adult=false`
  );
  if (!res.ok) throw new Error("Failed to search TMDB");
  return res.json();
}

export async function searchTV(query: string) {
  const res = await fetch(
    `${BASE_URL}/search/tv?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
      query
    )}`
  );
  return res.json();
}

export async function searchPerson(query: string) {
  const res = await fetch(
    `${BASE_URL}/search/person?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
      query
    )}`
  );
  return res.json();
}
