import { useState, useEffect } from 'react'
import type { Movie } from '../services/tmdbService'

interface UseMoviesReturn {
  movies: Movie[]
  loading: boolean
  error: string | null
}

export const useMovies = (
  fetchFn: () => Promise<Movie[]>
): UseMoviesReturn => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadMovies = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchFn()
        
        if (isMounted) {
          setMovies(data.slice(0, 10))
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error')
          console.error('Error fetching movies:', err)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadMovies()

    return () => {
      isMounted = false
    }
  }, []) // ← IMPORTANT: Empty dependency array - only run once!

  return { movies, loading, error }
}