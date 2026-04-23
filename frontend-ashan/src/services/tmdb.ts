import axios from 'axios'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: API_KEY,
  },
})

// Error handler
const handleRequest = async (request: Promise<any>, name: string) => {
  try {
    const response = await request
    return response.data
  } catch (error: any) {
    throw new Error(`${name} failed: ${error.response?.data?.status_message || error.message}`)
  }
}

// APIs
export const getTrending = () =>
  handleRequest(tmdb.get('/trending/movie/week'), 'getTrending')

export const getPopular = () =>
  handleRequest(tmdb.get('/movie/popular'), 'getPopular')

export const getTopRated = () =>
  handleRequest(tmdb.get('/movie/top_rated'), 'getTopRated')

export const getNowPlaying = () =>
  handleRequest(tmdb.get('/movie/now_playing'), 'getNowPlaying')

export const searchMovies = (query: string) =>
  handleRequest(tmdb.get('/search/movie', { params: { query } }), 'searchMovies')

export const getMovieDetails = (id: number) =>
  handleRequest(tmdb.get(`/movie/${id}`), 'getMovieDetails')

export const getMovieCredits = (id: number) =>
  handleRequest(tmdb.get(`/movie/${id}/credits`), 'getMovieCredits')

export const getMovieVideos = (id: number) =>
  handleRequest(tmdb.get(`/movie/${id}/videos`), 'getMovieVideos')