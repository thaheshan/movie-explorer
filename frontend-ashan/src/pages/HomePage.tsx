import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { Bookmark, Star, Film, TrendingUp, Clock, Heart, Play, Zap } from 'lucide-react'
import { useMovies } from '../hooks/useMovies'
import { tmdbService } from '../services/tmdbService'
import MovieCard from '../components/MovieCard/MovieCard'

const MovieSection = ({ 
  title, 
  icon: Icon, 
  movies, 
  loading 
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  movies: any[]
  loading: boolean
}) => (
  <section className="mt-12">
    <div className="flex items-center gap-3 mb-6">
      <Icon className="w-6 h-6 text-red-400" />
      <h2 className="text-2xl font-bold">{title}</h2>
    </div>
    
    {loading ? (
      <div className="flex gap-4 pb-4 overflow-x-auto">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-48 rounded-lg h-80 bg-slate-800 animate-pulse"
          />
        ))}
      </div>
    ) : movies.length > 0 ? (
      <div className="flex gap-4 pb-4 overflow-x-auto">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    ) : (
      <div className="py-8 text-center text-slate-400">
        <p>No movies available</p>
      </div>
    )}
  </section>
)

export default function HomePage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  // Fetch movies from TMDb
  const { movies: trending, loading: trendingLoading } = useMovies(() =>
    tmdbService.getTrendingMovies()
  )
  const { movies: popular, loading: popularLoading } = useMovies(() =>
    tmdbService.getPopularMovies()
  )
  const { movies: topRated, loading: topRatedLoading } = useMovies(() =>
    tmdbService.getTopRatedMovies()
  )
  const { movies: nowPlaying, loading: nowPlayingLoading } = useMovies(() =>
    tmdbService.getNowPlayingMovies()
  )

  const handleLogOut = async (): Promise<void> => {
    try {
      await signOut()
      navigate('/login')
    } catch (err: unknown) {
      console.error('Error logging out:', err)
    }
  }

  return (
    <div className="min-h-screen text-white bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(239,68,68,0.18),_transparent_30%),radial-gradient(circle_at_top_left,_rgba(168,85,247,0.12),_transparent_25%)]" />

      <div className="relative z-10">
        {/* Navbar */}
        <nav className="px-4 py-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
          <div className="flex items-center justify-between mx-auto max-w-7xl">
            <div className="flex items-center gap-2">
              <Film className="w-6 h-6 text-red-500" />
              <span className="text-xl font-bold text-white">Movie Explorer</span>
            </div>
            <button
              onClick={handleLogOut}
              className="px-4 py-2 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        </nav>

        <main className="px-4 py-10 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Hero Section */}
          <section className="relative p-8 overflow-hidden border shadow-2xl rounded-3xl border-slate-800 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 md:p-12">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-transparent" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-sm text-red-300">
                  <Film className="w-4 h-4" />
                  Your personal cinema hub
                </div>

                <h1 className="mb-4 text-4xl font-bold leading-tight md:text-6xl">
                  Welcome back,
                  <span className="block text-transparent bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text">
                    {user?.email?.split('@')[0] || 'Movie Lover'}
                  </span>
                </h1>

                <p className="mb-6 text-lg leading-relaxed text-slate-300 md:text-xl">
                  Discover trending films, write reviews, and build your ultimate watchlist all in one place.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    to="/movies"
                    className="inline-flex items-center gap-2 px-6 py-3 font-semibold transition-all duration-300 shadow-lg rounded-xl bg-gradient-to-r from-red-600 to-red-500 shadow-red-500/25 hover:scale-105 hover:from-red-500 hover:to-pink-500"
                  >
                    <Play className="w-5 h-5" />
                    Explore Movies
                  </Link>

                  <Link
                    to="/watchlist"
                    className="inline-flex items-center gap-2 px-6 py-3 font-semibold transition-all duration-300 border rounded-xl border-slate-700 bg-slate-800/70 text-slate-200 hover:border-red-500/50 hover:bg-slate-800 hover:text-white"
                  >
                    <Bookmark className="w-5 h-5" />
                    My Watchlist
                  </Link>
                </div>
              </div>

              <div className="p-6 border rounded-2xl border-slate-700 bg-slate-900/80 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-red-500/20">
                    <Heart className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Logged in as</p>
                    <p className="font-semibold text-white">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="grid grid-cols-1 gap-6 mt-10 md:grid-cols-3">
            {[
              {
                title: 'Saved to Watchlist',
                value: '0',
                subtitle: 'Movies',
                icon: Bookmark,
              },
              {
                title: 'Reviews Written',
                value: '0',
                subtitle: 'Reviews',
                icon: Star,
              },
              {
                title: 'Movies Watched',
                value: '0',
                subtitle: 'Completed',
                icon: Clock,
              },
            ].map((stat) => (
              <div
                key={stat.title}
                className="p-6 transition-all duration-300 border shadow-xl group rounded-2xl border-slate-800 bg-slate-900/80 hover:-translate-y-1 hover:border-red-500/40 hover:shadow-red-500/10"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                    <p className="mt-2 text-4xl font-bold text-white">{stat.value}</p>
                    <p className="text-slate-500">{stat.subtitle}</p>
                  </div>
                  <div className="p-4 transition-transform duration-300 shadow-lg rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 group-hover:scale-110">
                    <stat.icon className="text-white h-7 w-7" />
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Movie Sections */}
          <MovieSection
            title="Trending Now"
            icon={TrendingUp}
            movies={trending}
            loading={trendingLoading}
          />

          <MovieSection
            title="Popular Movies"
            icon={Star}
            movies={popular}
            loading={popularLoading}
          />

          <MovieSection
            title="Top Rated"
            icon={Zap}
            movies={topRated}
            loading={topRatedLoading}
          />

          <MovieSection
            title="Now Playing in Theaters"
            icon={Film}
            movies={nowPlaying}
            loading={nowPlayingLoading}
          />
        </main>
      </div>
    </div>
  )
}