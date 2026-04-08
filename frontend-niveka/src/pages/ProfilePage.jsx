import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar/Navbar";
import { supabase } from "../services/supabaseClient";
import { getImageUrl } from "../services/tmdbService";

export default function ProfilePage() {
  const [darkMode, setDarkMode]   = useState(true);
  const [profile, setProfile]     = useState(null);
  const [reviews, setReviews]     = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate                  = useNavigate();
  const dk                        = darkMode;

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { navigate("/login"); return; }

        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        const { data: reviewsData } = await supabase
          .from("reviews")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        const { data: watchlistData } = await supabase
          .from("watchlist")
          .select("*")
          .eq("user_id", user.id)
          .order("added_at", { ascending: false });

        setProfile({ ...profileData, email: user.email });
        setReviews(reviewsData    || []);
        setWatchlist(watchlistData || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  const handleSearch   = () => {};
  const scrollToSearch = () => {};

  const removeFromWatchlist = async (movieId) => {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("watchlist").delete()
      .eq("user_id", user.id)
      .eq("movie_id", movieId);
    setWatchlist((prev) => prev.filter((m) => m.movie_id !== movieId));
  };

  const deleteReview = async (reviewId) => {
    await supabase.from("reviews").delete().eq("id", reviewId);
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  const TABS = ["overview", "watchlist", "reviews"];

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center
        ${dk ? "bg-[#09090f]" : "bg-[#faf9f7]"}`}>
        <div className="w-6 h-6 border-2 border-red-500 border-t-transparent
          rounded-full animate-spin" />
      </div>
    );
  }

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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">

        {/* ── Profile Card ── */}
        <div className={`relative rounded-3xl overflow-hidden mb-8 p-8 border
          ${dk
            ? "bg-white/3 border-white/8"
            : "bg-white border-gray-200 shadow-lg"}`}>

          <div className="absolute inset-0 pointer-events-none"
            style={{
              background: dk
                ? `radial-gradient(ellipse 60% 80% at 0% 50%,
                    rgba(220,38,38,0.07) 0%, transparent 60%)`
                : `radial-gradient(ellipse 60% 80% at 0% 50%,
                    rgba(254,226,226,0.6) 0%, transparent 60%)`,
            }}
          />

          <div className="relative z-10 flex items-center gap-6 flex-wrap">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-red-500
              flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4
                  7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6
                  1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-4 h-px bg-red-500" />
                <span className={`text-xs font-semibold tracking-widest uppercase
                  ${dk ? "text-red-400" : "text-red-500"}`}>
                  Member
                </span>
              </div>
              <h1
                className={`text-2xl sm:text-3xl font-black uppercase mb-1
                  ${dk ? "text-white" : "text-gray-900"}`}
                style={{ fontFamily: "'Bebas Neue', cursive" }}
              >
                {profile?.username || "Movie Explorer"}
              </h1>
              <p className={`text-sm ${dk ? "text-gray-500" : "text-gray-400"}`}>
                {profile?.email}
              </p>
              {profile?.bio && (
                <p className={`text-sm mt-2
                  ${dk ? "text-gray-400" : "text-gray-600"}`}>
                  {profile.bio}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className={`relative z-10 grid grid-cols-3 gap-3 mt-8 pt-6 border-t
            ${dk ? "border-white/6" : "border-gray-100"}`}>
            {[
              { label: "Reviews",    value: reviews.length },
              { label: "Avg Rating", value: avgRating },
              { label: "Watchlist",  value: watchlist.length },
            ].map((s) => (
              <div key={s.label}
                className={`rounded-2xl p-4 text-center border
                  ${dk
                    ? "bg-white/4 border-white/8"
                    : "bg-gray-50 border-gray-100"}`}>
                <p className={`text-2xl font-black mb-0.5
                  ${dk ? "text-white" : "text-gray-900"}`}
                  style={{ fontFamily: "'Bebas Neue', cursive" }}>
                  {s.value}
                </p>
                <p className={`text-xs ${dk ? "text-gray-500" : "text-gray-400"}`}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className={`flex gap-1 p-1 rounded-2xl mb-8
          ${dk
            ? "bg-white/4 border border-white/8"
            : "bg-gray-100 border border-gray-200"}`}>
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold
                capitalize transition-all duration-200
                ${activeTab === tab
                  ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                  : dk
                    ? "text-gray-500 hover:text-white"
                    : "text-gray-500 hover:text-gray-900"}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* ── Overview Tab ── */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className={`rounded-2xl p-6 border
              ${dk
                ? "bg-white/3 border-white/8"
                : "bg-white border-gray-200 shadow-sm"}`}>
              <h3 className={`text-sm font-semibold mb-4
                ${dk ? "text-gray-300" : "text-gray-700"}`}>
                Quick Overview
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Total reviews written", value: reviews.length },
                  { label: "Average rating given",
                    value: avgRating === "—" ? "No reviews yet" : `${avgRating} / 5` },
                  { label: "Movies in watchlist",   value: watchlist.length },
                  { label: "Member since",
                    value: profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString(
                          "en-US", { month: "long", year: "numeric" }
                        )
                      : "—" },
                ].map((item) => (
                  <div key={item.label}
                    className={`flex items-center justify-between py-2.5
                      border-b last:border-0
                      ${dk ? "border-white/5" : "border-gray-50"}`}>
                    <span className={`text-sm
                      ${dk ? "text-gray-400" : "text-gray-500"}`}>
                      {item.label}
                    </span>
                    <span className={`text-sm font-semibold
                      ${dk ? "text-white" : "text-gray-900"}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {reviews.length > 0 && (
              <div className={`rounded-2xl p-6 border
                ${dk
                  ? "bg-white/3 border-white/8"
                  : "bg-white border-gray-200 shadow-sm"}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-sm font-semibold
                    ${dk ? "text-gray-300" : "text-gray-700"}`}>
                    Recent Reviews
                  </h3>
                  <button onClick={() => setActiveTab("reviews")}
                    className="text-xs text-red-500 hover:text-red-400">
                    View all
                  </button>
                </div>
                <div className="space-y-3">
                  {reviews.slice(0, 3).map((r) => (
                    <div key={r.id}
                      className={`p-3 rounded-xl
                        ${dk ? "bg-white/4" : "bg-gray-50"}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-yellow-400 text-xs">
                          {"★".repeat(r.rating)}
                          {"☆".repeat(5 - r.rating)}
                        </span>
                        <span className={`text-xs
                          ${dk ? "text-gray-600" : "text-gray-400"}`}>
                          Movie #{r.movie_id}
                        </span>
                      </div>
                      <p className={`text-xs line-clamp-2
                        ${dk ? "text-gray-400" : "text-gray-600"}`}>
                        {r.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Watchlist Tab ── */}
        {activeTab === "watchlist" && (
          <div>
            {watchlist.length === 0 ? (
              <div className="flex flex-col items-center py-24 gap-4">
                <div className={`w-14 h-14 rounded-2xl border flex items-center
                  justify-center
                  ${dk
                    ? "border-white/10 bg-white/4"
                    : "border-gray-200 bg-gray-50"}`}>
                  <svg className={`w-6 h-6
                    ${dk ? "text-gray-600" : "text-gray-400"}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                  </svg>
                </div>
                <div className="text-center">
                  <p className={`text-base font-medium mb-1
                    ${dk ? "text-gray-300" : "text-gray-700"}`}>
                    Watchlist is empty
                  </p>
                  <p className={`text-sm
                    ${dk ? "text-gray-600" : "text-gray-400"}`}>
                    Add movies from the movie detail page
                  </p>
                </div>
                <button onClick={() => navigate("/home")}
                  className="px-5 py-2.5 bg-red-500 hover:bg-red-600
                    text-white text-sm font-semibold rounded-xl
                    transition-all hover:scale-105">
                  Browse Movies
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {watchlist.map((item) => (
                  <div key={item.id}
                    className={`group relative rounded-2xl overflow-hidden
                      border transition-all hover:scale-[1.02]
                      ${dk
                        ? "bg-white/4 border-white/8 hover:border-red-500/40"
                        : "bg-white border-gray-100 hover:border-red-200 shadow-sm"}`}>
                    <div className="aspect-[2/3] overflow-hidden">
                      <img
                        src={getImageUrl(item.poster_path)}
                        alt={item.movie_title}
                        loading="lazy"
                        className="w-full h-full object-cover
                          group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t
                      from-black/95 via-black/20 to-transparent
                      opacity-0 group-hover:opacity-100
                      transition-opacity duration-300">
                      <div className="absolute bottom-0 p-3">
                        <p className="text-white text-xs font-semibold line-clamp-2">
                          {item.movie_title}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromWatchlist(item.movie_id)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-lg
                        bg-black/70 flex items-center justify-center
                        text-gray-400 hover:bg-red-500 hover:text-white
                        transition-all backdrop-blur-sm">
                      <svg className="w-3.5 h-3.5" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Reviews Tab ── */}
        {activeTab === "reviews" && (
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="flex flex-col items-center py-24 gap-4">
                <div className={`w-14 h-14 rounded-2xl border flex items-center
                  justify-center
                  ${dk
                    ? "border-white/10 bg-white/4"
                    : "border-gray-200 bg-gray-50"}`}>
                  <svg className={`w-6 h-6
                    ${dk ? "text-gray-600" : "text-gray-400"}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519
                        4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588
                        1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518
                        4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1
                        1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197
                        -1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976
                        -2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0
                        00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className={`text-base font-medium mb-1
                    ${dk ? "text-gray-300" : "text-gray-700"}`}>
                    No reviews yet
                  </p>
                  <p className={`text-sm
                    ${dk ? "text-gray-600" : "text-gray-400"}`}>
                    Write your first review on any movie page
                  </p>
                </div>
                <button onClick={() => navigate("/home")}
                  className="px-5 py-2.5 bg-red-500 hover:bg-red-600
                    text-white text-sm font-semibold rounded-xl
                    transition-all hover:scale-105">
                  Browse Movies
                </button>
              </div>
            ) : (
              reviews.map((r) => (
                <div key={r.id}
                  className={`rounded-2xl p-5 border
                    ${dk
                      ? "bg-white/3 border-white/8"
                      : "bg-white border-gray-200 shadow-sm"}`}>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-yellow-400 text-sm">
                          {"★".repeat(r.rating)}
                          <span className={dk ? "text-gray-700" : "text-gray-300"}>
                            {"★".repeat(5 - r.rating)}
                          </span>
                        </span>
                        <span className={`text-xs font-semibold
                          ${dk ? "text-white" : "text-gray-900"}`}>
                          {r.rating} / 5
                        </span>
                      </div>
                      <p className={`text-xs
                        ${dk ? "text-gray-600" : "text-gray-400"}`}>
                        Movie #{r.movie_id} ·{" "}
                        {new Date(r.created_at).toLocaleDateString("en-US", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                    </div>
                    <button onClick={() => deleteReview(r.id)}
                      className={`p-1.5 rounded-lg transition-colors flex-shrink-0
                        ${dk
                          ? "text-gray-600 hover:text-red-400 hover:bg-red-500/10"
                          : "text-gray-400 hover:text-red-500 hover:bg-red-50"}`}>
                      <svg className="w-4 h-4" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2
                            2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1
                            1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <p className={`text-sm leading-relaxed
                    ${dk ? "text-gray-300" : "text-gray-700"}`}>
                    {r.body}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

      </main>
    </div>
  );
}