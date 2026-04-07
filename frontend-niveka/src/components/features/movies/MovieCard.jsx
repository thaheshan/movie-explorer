import { useState } from "react";
import { getImageUrl } from "../../../services/tmdbService";
import { useNavigate } from "react-router-dom";

export default function MovieCard({ movie, darkMode, onRemove }) {
  const navigate = useNavigate();
  const dk = darkMode;

  const [isFav, setIsFav] = useState(() => {
    const saved = localStorage.getItem("favourites");
    const favs  = saved ? JSON.parse(saved) : [];
    return favs.includes(movie.id);
  });

  const toggleFav = (e) => {
    e.stopPropagation();
    const saved = localStorage.getItem("favourites");
    let favs    = saved ? JSON.parse(saved) : [];

    if (isFav) {
      favs = favs.filter((id) => id !== movie.id);
      // if on favourites page — remove card from list
      if (onRemove) onRemove(movie.id);
    } else {
      favs.push(movie.id);
    }

    localStorage.setItem("favourites", JSON.stringify(favs));
    setIsFav(!isFav);
  };

  return (
    <div
      onClick={() => navigate(`/movie/${movie.id}`)}
      className={`cursor-pointer group relative rounded-2xl overflow-hidden
        transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1
        ${dk
          ? "bg-white/4 border border-white/8 hover:border-red-500/40 hover:shadow-xl hover:shadow-red-900/20"
          : "bg-white border border-gray-100 hover:border-red-200 hover:shadow-xl hover:shadow-red-100/60"}`}
    >
      <div className="aspect-[2/3] overflow-hidden">
        <img
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105
            transition-transform duration-500"
        />
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95
        via-black/30 to-transparent opacity-0 group-hover:opacity-100
        transition-opacity duration-300">
        <div className="absolute bottom-0 p-3">
          <p className="text-white text-xs font-semibold line-clamp-2
            leading-snug">
            {movie.title}
          </p>
          <p className="text-gray-400 text-xs mt-0.5">
            {movie.release_date?.slice(0, 4)}
          </p>
        </div>
      </div>

      {/* Rating — top left */}
      <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-sm
        rounded-lg px-1.5 py-0.5">
        <span className="text-yellow-400 text-xs font-bold">
          ★ {movie.vote_average?.toFixed(1)}
        </span>
      </div>

      {/* Favourite — top right */}
      <button
        onClick={toggleFav}
        className={`absolute top-2 right-2 w-7 h-7 rounded-lg flex items-center
          justify-center transition-all duration-200 backdrop-blur-sm
          hover:scale-110 active:scale-95
          ${isFav
            ? "bg-red-500 text-white"
            : "bg-black/60 text-gray-400 hover:bg-black/80 hover:text-red-400"}`}
      >
        <svg
          className="w-3.5 h-3.5"
          fill={isFav ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={isFav ? 0 : 2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5
              4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>
    </div>
  );
}