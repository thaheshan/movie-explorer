import axios from 'axios'
import type { AxiosResponse } from 'axios'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

// Runtime guard
if (!API_KEY) {
  throw new Error(
    'VITE_TMDB_API_KEY environment variable is not set. ' +
    'Please add it to your .env file.'
  )
}

const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: API_KEY,
  },
})

// Error handler with proper TypeScript type safety
const handleRequest = async <T,>(
  request: Promise<AxiosResponse<T>>,
  name: string
): Promise<T> => {
  try {
    const response = await request
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Now TypeScript knows this is an Axios error
      throw new Error(
        `${name} failed: ${error.response?.data?.status_message || error.message}`
      )
    }
    // Handle unexpected non-Axios errors
    throw new Error(
      `${name} failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
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