import { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "../components/layout/Navbar/Navbar";
import MovieGrid from "../components/features/movies/MovieGrid";
import {
  getTrending, getPopular, getTopRated,
  getNowPlaying, searchMovies,
} from "../services/tmdbService";

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default function HomePage() {
  const [darkMode, setDarkMode]             = useState(true);
  const [trending, setTrending]             = useState([]);
  const [popular, setPopular]               = useState([]);
  const [topRated, setTopRated]             = useState([]);
  const [nowPlaying, setNowPlaying]         = useState([]);
  const [searchResults, setSearchResults]   = useState([]);
  const [loading, setLoading]               = useState(true);
  const [searchQuery, setSearchQuery]       = useState("");
  const [searchLoading, setSearchLoading]   = useState(false);
  const [trendingPage, setTrendingPage]     = useState(1);
  const [popularPage, setPopularPage]       = useState(1);
  const [topRatedPage, setTopRatedPage]     = useState(1);
  const [nowPlayingPage, setNowPlayingPage] = useState(1);
  const [loadingMore, setLoadingMore]       = useState(false);

  const loaderRef     = useRef(null);
  const heroSearchRef = useRef(null);

  // ✅ dk is defined here — used throughout
  const dk = darkMode;

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [t, p, tr, n] = await Promise.all([
          getTrending(1), getPopular(1), getTopRated(1), getNowPlaying(1),
        ]);
        setTrending(t.results   || []);
        setPopular(p.results    || []);
        setTopRated(tr.results  || []);
        setNowPlaying(n.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingMore || searchQuery) return;
    setLoadingMore(true);
    try {
      const nextT  = trendingPage + 1;
      const nextP  = popularPage + 1;
      const nextTR = topRatedPage + 1;
      const nextN  = nowPlayingPage + 1;

      const [t, p, tr, n] = await Promise.all([
        getTrending(nextT), getPopular(nextP),
        getTopRated(nextTR), getNowPlaying(nextN),
      ]);

      setTrending(prev   => [...prev, ...(t.results  || [])]);
      setPopular(prev    => [...prev, ...(p.results  || [])]);
      setTopRated(prev   => [...prev, ...(tr.results || [])]);
      setNowPlaying(prev => [...prev, ...(n.results  || [])]);

      setTrendingPage(nextT);
      setPopularPage(nextP);
      setTopRatedPage(nextTR);
      setNowPlayingPage(nextN);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, searchQuery, trendingPage, popularPage, topRatedPage, nowPlayingPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { threshold: 0.1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  const handleSearch = useCallback(
    debounce(async (query) => {
      setSearchQuery(query);
      if (!query.trim()) { setSearchResults([]); return; }
      setSearchLoading(true);
      try {
        const data = await searchMovies(query);
        setSearchResults(data.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setSearchLoading(false);
      }
    }, 400), []
  );

  const scrollToSearch = () => {
    heroSearchRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => heroSearchRef.current?.focus(), 500);
  };

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div
      className={`min-h-screen transition-colors duration-300
        ${dk ? "bg-[#09090f]" : "bg-[#faf9f7]"}`}
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── HERO SECTION ── */}
        {!isSearching && (
          <div className="min-h-screen flex flex-col items-center justify-center
            text-center pt-16 relative overflow-hidden">

            {/* ── Dark mode background ── */}
            {dk && (
              <>
                <div className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `
                      radial-gradient(ellipse 80% 60% at 50% 40%, rgba(220,38,38,0.08) 0%, transparent 70%),
                      radial-gradient(ellipse 40% 40% at 20% 80%, rgba(220,38,38,0.05) 0%, transparent 60%),
                      radial-gradient(ellipse 40% 40% at 80% 20%, rgba(251,146,60,0.04) 0%, transparent 60%)
                    `,
                  }}
                />
                <div className="absolute inset-0 pointer-events-none opacity-[0.035]"
                  style={{
                    backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
                    backgroundSize: "32px 32px",
                  }}
                />
                <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                      90deg,
                      transparent,
                      transparent 80px,
                      rgba(255,255,255,0.8) 80px,
                      rgba(255,255,255,0.8) 81px
                    )`,
                  }}
                />
                <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
                  style={{ background: "linear-gradient(to bottom, #09090f, transparent)" }}
                />
                <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
                  style={{ background: "linear-gradient(to top, #09090f, transparent)" }}
                />
              </>
            )}

            {/* ── Light mode background ── */}
            {!dk && (
              <>
                <div className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `
                      radial-gradient(ellipse 70% 50% at 50% 30%, rgba(254,226,226,0.8) 0%, transparent 70%),
                      radial-gradient(ellipse 40% 40% at 10% 90%, rgba(254,215,170,0.4) 0%, transparent 60%),
                      radial-gradient(ellipse 40% 40% at 90% 10%, rgba(254,202,202,0.3) 0%, transparent 60%)
                    `,
                  }}
                />
                <div className="absolute inset-0 pointer-events-none opacity-[0.12]"
                  style={{
                    backgroundImage: `radial-gradient(circle, #ef4444 0.8px, transparent 0.8px)`,
                    backgroundSize: "28px 28px",
                  }}
                />
                <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                      45deg,
                      transparent,
                      transparent 20px,
                      rgba(220,38,38,0.8) 20px,
                      rgba(220,38,38,0.8) 21px
                    )`,
                  }}
                />
                <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
                  style={{ background: "linear-gradient(to bottom, #faf9f7, transparent)" }}
                />
                <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
                  style={{ background: "linear-gradient(to top, #faf9f7, transparent)" }}
                />
              </>
            )}

            {/* ── Hero content ── */}
            <div className="relative z-10 w-full max-w-2xl mx-auto">

              {/* Badge */}
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                text-xs font-semibold tracking-widest uppercase mb-6 border
                ${dk
                  ? "bg-red-500/10 border-red-500/30 text-red-400"
                  : "bg-red-50 border-red-200 text-red-600"}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse
                  inline-block" />
                Now Streaming
              </div>

              {/* Heading */}
              <h1
                className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black
                  uppercase tracking-tight mb-4
                  ${dk ? "text-white" : "text-gray-900"}`}
                style={{ fontFamily: "'Bebas Neue', cursive" }}
              >
                Explore
                <span className="text-red-500"> Movies</span>
              </h1>

              <p className={`text-sm sm:text-base md:text-lg max-w-lg mx-auto
                mb-10 leading-relaxed
                ${dk ? "text-gray-400" : "text-gray-600"}`}>
                Discover trending films, write reviews, and curate your
                personal watchlist
              </p>

              {/* Hero Search */}
              <div className="w-full max-w-xl mx-auto">
                <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl
                  border transition-all duration-300
                  ${dk
                    ? "bg-white/5 border-white/10 hover:border-red-500/40 focus-within:border-red-500"
                    : "bg-white border-gray-200 hover:border-red-300 focus-within:border-red-500 shadow-lg"}`}>
                  <svg
                    className={`w-5 h-5 flex-shrink-0
                      ${dk ? "text-gray-500" : "text-gray-400"}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    ref={heroSearchRef}
                    type="text"
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search movies, genres, actors..."
                    className={`flex-1 bg-transparent outline-none text-sm sm:text-base
                      ${dk
                        ? "text-white placeholder-gray-500"
                        : "text-gray-800 placeholder-gray-400"}`}
                  />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── MOVIE SECTIONS ── */}
        <div className="pb-20">
          {!isSearching ? (
            <>
              <MovieGrid title="Trending This Week" movies={trending}
                loading={loading} darkMode={darkMode} />
              <MovieGrid title="Popular Right Now"  movies={popular}
                loading={loading} darkMode={darkMode} />
              <MovieGrid title="Top Rated All Time" movies={topRated}
                loading={loading} darkMode={darkMode} />
              <MovieGrid title="Now Playing"        movies={nowPlaying}
                loading={loading} darkMode={darkMode} />

              <div ref={loaderRef} className="flex justify-center py-8">
                {loadingMore && (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-red-500
                      border-t-transparent rounded-full animate-spin" />
                    <span className={`text-sm
                      ${dk ? "text-gray-400" : "text-gray-500"}`}>
                      Loading more movies...
                    </span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="pt-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl sm:text-2xl font-bold
                  ${dk ? "text-white" : "text-gray-900"}`}>
                  Results for{" "}
                  <span className="text-red-500">"{searchQuery}"</span>
                </h2>
                {!searchLoading && (
                  <span className={`text-sm
                    ${dk ? "text-gray-400" : "text-gray-500"}`}>
                    {searchResults.length} movies found
                  </span>
                )}
              </div>

              {!searchLoading && searchResults.length === 0 && (
                <div className="flex flex-col items-center justify-center
                  py-20 gap-4">
                  <p className={`text-lg
                    ${dk ? "text-gray-400" : "text-gray-500"}`}>
                    No results found for "{searchQuery}"
                  </p>
                </div>
              )}

              <MovieGrid
                movies={searchResults}
                loading={searchLoading}
                darkMode={darkMode}
              />
            </div>
          )}
        </div>

      </main>
    </div>
  );
}