const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY  = import.meta.env.VITE_TMDB_API_KEY;

const get = async (endpoint, params = "") => {
  const res = await fetch(
    `${BASE_URL}${endpoint}?api_key=${API_KEY}&${params}`
  );
  return res.json();
};

export const getTrending    = (page = 1) => get("/trending/movie/week",  `page=${page}`);
export const getPopular     = (page = 1) => get("/movie/popular",        `page=${page}`);
export const getTopRated    = (page = 1) => get("/movie/top_rated",      `page=${page}`);
export const getNowPlaying  = (page = 1) => get("/movie/now_playing",    `page=${page}`);
export const searchMovies   = (query)    => get("/search/movie",         `query=${encodeURIComponent(query)}`);
export const getMovieById   = (id)       => get(`/movie/${id}`);
export const getMovieCredits = (id)      => get(`/movie/${id}/credits`);
export const getMovieVideos  = (id)      => get(`/movie/${id}/videos`);
export const getImageUrl     = (path)    => path ? `https://image.tmdb.org/t/p/w500${path}` : "/no-image.png";