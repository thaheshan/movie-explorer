import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar/Navbar";
import MovieGrid from "../components/features/movies/MovieGrid";
import { getMovieById } from "../services/tmdbService";

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default function FavouritesPage() {
  const [darkMode, setDarkMode]           = useState(true);
  const [movies, setMovies]               = useState([]);
  const [allMovies, setAllMovies]         = useState([]);
  const [loading, setLoading]             = useState(true);
  const [searchQuery, setSearchQuery]     = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch]       = useState(false); // ← hidden by default
  const heroSearchRef                     = useRef(null);
  const navigate                          = useNavigate();
  const dk                                = darkMode;

  useEffect(() => {
    const fetchFavourites = async () => {
      setLoading(true);
      try {
        const saved = localStorage.getItem("favourites");
        const ids   = saved ? JSON.parse(saved) : [];
        if (ids.length === 0) {
          setMovies([]);
          setAllMovies([]);
          setLoading(false);
          return;
        }
        const results = await Promise.all(ids.map((id) => getMovieById(id)));
        const valid   = results.filter(Boolean);
        setMovies(valid);
        setAllMovies(valid);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchFavourites();
  }, []);

  // search within favourites only
  const handleSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
      if (!query.trim()) { setSearchResults([]); return; }
      const q        = query.toLowerCase();
      const filtered = allMovies.filter((m) =>
        m.title?.toLowerCase().includes(q) ||
        m.release_date?.includes(q) ||
        m.overview?.toLowerCase().includes(q)
      );
      setSearchResults(filtered);
    }, 300), [allMovies]
  );

  // ✅ clicking search icon — reveals search box and scrolls to it
  const scrollToSearch = () => {
    setShowSearch(true);
    setTimeout(() => {
      heroSearchRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      heroSearchRef.current?.focus();
    }, 100);
  };

  const isSearching = searchQuery.trim().length > 0;
  const displayList = isSearching ? searchResults : movies;

  return (
    <div
      className={`min-h-screen transition-colors duration-300
        ${dk ? "bg-[#09090f]" : "bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50"}`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Bebas+Neue&display=swap"
        rel="stylesheet"
      />

      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onSearch={handleSearch}
        onSearchIconClick={scrollToSearch}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">

        {/* ── Default header — always visible ── */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-6 bg-red-500 rounded-full" />
          <h1 className={`text-2xl sm:text-3xl font-bold
            ${dk ? "text-white" : "text-gray-900"}`}>
            My Favourites
          </h1>
        </div>
        <p className={`mb-8 text-sm pl-4
          ${dk ? "text-gray-500" : "text-gray-400"}`}>
          {loading
            ? "Loading..."
            : `${movies.length} saved movie${movies.length !== 1 ? "s" : ""}`}
        </p>

        {/* ── Search section — only shown after clicking search icon ── */}
        {showSearch && (
          <div className={`relative rounded-3xl overflow-hidden mb-10 p-6 sm:p-8
            ${dk
              ? "bg-white/3 border border-white/8"
              : "bg-white/70 border border-rose-200/60 shadow-xl shadow-rose-100/40"}`}>

            {/* Background decorations */}
            {dk && (
              <>
                <div className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `
                      radial-gradient(ellipse 60% 80% at 0% 50%, rgba(220,38,38,0.08) 0%, transparent 60%),
                      radial-gradient(ellipse 40% 60% at 100% 50%, rgba(220,38,38,0.05) 0%, transparent 60%)
                    `,
                  }}
                />
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                  style={{
                    backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
                    backgroundSize: "24px 24px",
                  }}
                />
              </>
            )}
            {!dk && (
              <>
                <div className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `
                      radial-gradient(ellipse 60% 80% at 0% 50%, rgba(254,205,211,0.5) 0%, transparent 60%),
                      radial-gradient(ellipse 40% 60% at 100% 50%, rgba(253,186,116,0.3) 0%, transparent 60%)
                    `,
                  }}
                />
                <div className="absolute inset-0 pointer-events-none opacity-[0.08]"
                  style={{
                    backgroundImage: `radial-gradient(circle, #ef4444 0.8px, transparent 0.8px)`,
                    backgroundSize: "24px 24px",
                  }}
                />
              </>
            )}

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <p className={`text-sm font-medium
                  ${dk ? "text-gray-300" : "text-gray-700"}`}>
                  Search within your favourites
                </p>
                {/* Close button */}
                <button
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className={`p-1.5 rounded-lg transition-colors
                    ${dk
                      ? "text-gray-500 hover:text-white hover:bg-white/10"
                      : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Search input */}
              <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border
                transition-all max-w-lg
                ${dk
                  ? "bg-white/5 border-white/10 focus-within:border-red-500/50"
                  : "bg-white border-rose-200 focus-within:border-red-400 shadow-sm"}`}>
                <svg className={`w-4 h-4 flex-shrink-0
                  ${dk ? "text-gray-500" : "text-rose-400"}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={heroSearchRef}
                  type="text"
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search within your favourites..."
                  className={`flex-1 bg-transparent outline-none text-sm
                    ${dk
                      ? "text-white placeholder-gray-600"
                      : "text-gray-900 placeholder-rose-300"}`}
                />
                {/* Heart indicator */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor"
                    viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5
                      4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className={`text-xs font-medium
                    ${dk ? "text-gray-600" : "text-rose-400"}`}>
                    only
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Search results header ── */}
        {isSearching && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5
                  4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <p className={`text-sm ${dk ? "text-gray-400" : "text-gray-600"}`}>
                Results for
                <span className="text-red-500 font-semibold"> "{searchQuery}"</span>
              </p>
            </div>
            <span className={`text-xs ${dk ? "text-gray-600" : "text-gray-400"}`}>
              {searchResults.length} found
            </span>
          </div>
        )}

        {/* ── No search results ── */}
        {isSearching && searchResults.length === 0 && (
          <div className="flex flex-col items-center py-20 gap-4">
            <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center
              ${dk ? "border-white/10 bg-white/4" : "border-rose-200 bg-rose-50"}`}>
              <svg className={`w-6 h-6 ${dk ? "text-gray-600" : "text-rose-300"}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className={`text-sm ${dk ? "text-gray-500" : "text-gray-400"}`}>
              No favourites match "{searchQuery}"
            </p>
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && movies.length === 0 && !isSearching && (
          <div className="flex flex-col items-center justify-center py-32 gap-5">
            <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center
              ${dk ? "border-white/10 bg-white/4" : "border-rose-200 bg-rose-50"}`}>
              <svg className={`w-7 h-7 ${dk ? "text-gray-600" : "text-rose-300"}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5
                    4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="text-center">
              <p className={`text-base font-medium mb-1
                ${dk ? "text-gray-300" : "text-gray-700"}`}>
                No favourites yet
              </p>
              <p className={`text-sm ${dk ? "text-gray-600" : "text-gray-400"}`}>
                Click the heart icon on any movie to save it here
              </p>
            </div>
            <button
              onClick={() => navigate("/home")}
              className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white
                text-sm font-semibold rounded-xl transition-all hover:scale-105
                active:scale-95"
            >
              Browse Movies
            </button>
          </div>
        )}

        {/* ── Favourites Grid ── */}
        {!loading && displayList.length > 0 && (
          <MovieGrid
            movies={displayList}
            loading={loading}
            darkMode={darkMode}
            onRemove={(id) => {
              setMovies((prev) => prev.filter((m) => m.id !== id));
              setAllMovies((prev) => prev.filter((m) => m.id !== id));
            }}
          />
        )}

      </main>
    </div>
  );
}