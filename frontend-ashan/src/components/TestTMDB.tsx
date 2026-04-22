import { useEffect } from 'react'
import {
  getTrending,
  getPopular,
  getTopRated,
  getNowPlaying,
  searchMovies,
  getMovieDetails,
  getMovieCredits,
  getMovieVideos,
} from '../services/tmdbService' // ✅ updated

const TestTMDB = () => {
  useEffect(() => {
    const test = async () => {
      try {
        console.log('Trending:', await getTrending())
        console.log('Popular:', await getPopular())
        console.log('Top Rated:', await getTopRated())
        console.log('Now Playing:', await getNowPlaying())

        console.log('Search:', await searchMovies('batman'))

        console.log('Details:', await getMovieDetails(550))
        console.log('Credits:', await getMovieCredits(550))
        console.log('Videos:', await getMovieVideos(550))
      } catch (error) {
        console.error(error)
      }
    }

    test()
  }, [])

  return <div>Check TMDB Console</div>
}

export default TestTMDB