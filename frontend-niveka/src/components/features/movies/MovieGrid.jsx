import MovieCard from "./MovieCard";
import SkeletonCard from "../../ui/SkeletonCard";

export default function MovieGrid({ movies, loading, title, darkMode }) {
  const dk = darkMode;
  return (
    <div className="mb-14">
      {title && (
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-5 bg-red-500 rounded-full" />
          <h2 className={`text-base font-semibold tracking-tight
            ${dk ? "text-white" : "text-gray-900"}`}>
            {title}
          </h2>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4
        lg:grid-cols-5 gap-4 sm:gap-5">
        {loading
          ? Array(10).fill(0).map((_, i) => (
              <SkeletonCard key={i} darkMode={darkMode} />
            ))
          : movies?.map((movie) => (
              <MovieCard key={movie.id} movie={movie} darkMode={darkMode} />
            ))}
      </div>
    </div>
  );
}