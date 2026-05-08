import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import type { Movie } from '../../services/tmdbService'

interface MovieCardProps {
  movie: Movie
}

export default function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : '/placeholder-movie.png'

  return (
    <Link
      to={`/movies/${movie.id}`}
      className="flex-shrink-0 w-48 transition-transform duration-300 transform hover:scale-105"
    >
      <div className="overflow-hidden rounded-lg shadow-lg bg-slate-900">
        <img
          src={posterUrl}
          alt={movie.title}
          className="object-cover w-full h-72"
          loading="lazy"
        />
        <div className="p-4 bg-slate-800">
          <h3 className="text-sm font-semibold text-white truncate">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm text-slate-300">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400 line-clamp-2">
            {movie.release_date}
          </p>
        </div>
      </div>
    </Link>
  )
}