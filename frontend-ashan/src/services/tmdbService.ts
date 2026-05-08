const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

export interface Movie {
  id: number
  title: string
  poster_path: string | null
  vote_average: number
  release_date: string
  overview: string
}

export const tmdbService = {
  getTrendingMovies: async (timeWindow: 'day' | 'week' = 'week'): Promise<Movie[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/movie/${timeWindow}?api_key=${TMDB_API_KEY}`
    )
    if (!response.ok) throw new Error('Failed to fetch trending movies')
    const data = await response.json()
    return data.results
  },

  getPopularMovies: async (): Promise<Movie[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`
    )
    if (!response.ok) throw new Error('Failed to fetch popular movies')
    const data = await response.json()
    return data.results
  },

  getTopRatedMovies: async (): Promise<Movie[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}`
    )
    if (!response.ok) throw new Error('Failed to fetch top rated movies')
    const data = await response.json()
    return data.results
  },

  getNowPlayingMovies: async (): Promise<Movie[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}`
    )
    if (!response.ok) throw new Error('Failed to fetch now playing movies')
    const data = await response.json()
    return data.results
  },
}