import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar/Navbar";
import { supabase } from "../services/supabaseClient";
import {
  getMovieById,
  getMovieCredits,
  getMovieVideos,
  getImageUrl,
} from "../services/tmdbService";

const StarPicker = ({ value, onChange, darkMode }) => {
  const [hover, setHover] = useState(0);
  const dk = darkMode;
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="text-2xl transition-transform hover:scale-110"
        >
          <span className={
            star <= (hover || value)
              ? "text-yellow-400"
              : dk ? "text-gray-700" : "text-gray-300"
          }>★</span>
        </button>
      ))}
    </div>
  );
};

export default function MovieDetailPage() {
  const { id }                        = useParams();
  const navigate                      = useNavigate();

  // ✅ persist darkMode in localStorage
  const [darkMode, setDarkMode]       = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [movie, setMovie]             = useState(null);
  const [credits, setCredits]         = useState([]);
  const [trailer, setTrailer]         = useState(null);
  const [reviews, setReviews]         = useState([]);
  const [userReview, setUserReview]   = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [rating, setRating]           = useState(0);
  const [body, setBody]               = useState("");
  const [editing, setEditing]         = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [formMsg, setFormMsg]         = useState("");
  const [inWatchlist, setInWatchlist] = useState(false);
  const [wlLoading, setWlLoading]     = useState(false);
  const dk                            = darkMode;

  // ✅ save darkMode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);

        const [movieData, creditsData, videosData] = await Promise.all([
          getMovieById(id),
          getMovieCredits(id),
          getMovieVideos(id),
        ]);

        setMovie(movieData);
        setCredits(creditsData.cast?.slice(0, 12) || []);

        const yt = videosData.results?.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        setTrailer(yt || null);

        const { data: reviewsData, error: reviewsError } = await supabase
          .from("reviews")
          .select("*, profiles(username, avatar_url)")
          .eq("movie_id", Number(id))
          .order("created_at", { ascending: false });

        if (reviewsError) console.error("Reviews error:", reviewsError);
        setReviews(reviewsData || []);

        if (user) {
          const existing = reviewsData?.find((r) => r.user_id === user.id);
          if (existing) {
            setUserReview(existing);
            setRating(existing.rating);
            setBody(existing.body);
          }

          const { data: wl } = await supabase
            .from("watchlist")
            .select("id")
            .eq("user_id", user.id)
            .eq("movie_id", Number(id))
            .maybeSingle();
          setInWatchlist(!!wl);
        }
      } catch (err) {
        console.error("fetchAll error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  // ── Watchlist toggle ──
  const toggleWatchlist = async () => {
    if (!currentUser) return;
    setWlLoading(true);
    try {
      if (inWatchlist) {
        await supabase.from("watchlist").delete()
          .eq("user_id", currentUser.id)
          .eq("movie_id", Number(id));
        setInWatchlist(false);
      } else {
        await supabase.from("watchlist").insert({
          user_id:     currentUser.id,
          movie_id:    Number(id),
          movie_title: movie.title,
          poster_path: movie.poster_path,
        });
        setInWatchlist(true);
      }
    } catch (err) {
      console.error("watchlist error:", err);
    } finally {
      setWlLoading(false);
    }
  };

  // ── Submit / Edit review ──
  const handleSubmitReview = async () => {
    if (!rating) { setFormMsg("Please select a star rating."); return; }
    if (body.trim().length < 20) {
      setFormMsg("Review must be at least 20 characters.");
      return;
    }
    if (!currentUser) { setFormMsg("You must be logged in."); return; }

    setSubmitting(true);
    setFormMsg("");

    try {
      if (userReview && editing) {
        // ── UPDATE — no page refresh ──
        const { error: updateError } = await supabase
          .from("reviews")
          .update({
            rating,
            body,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userReview.id)
          .eq("user_id", currentUser.id);

        if (updateError) {
          setFormMsg(`Update failed: ${updateError.message}`);
          return;
        }

        // ✅ update state directly — no refresh needed
        const updated = {
          ...userReview,
          rating,
          body,
          updated_at: new Date().toISOString(),
        };

        setReviews((prev) =>
          prev.map((r) => r.id === updated.id ? updated : r)
        );
        setUserReview(updated);
        setEditing(false);
        setFormMsg("Review updated!");

      } else {
        // ── INSERT ──
        const { data: inserted, error: insertError } = await supabase
          .from("reviews")
          .insert({
            user_id:  currentUser.id,
            movie_id: Number(id),
            rating:   Number(rating),
            body:     body.trim(),
          })
          .select()
          .single();

        if (insertError) {
          setFormMsg(`Failed: ${insertError.message}`);
          return;
        }

        // fetch with profile joined
        const { data: newReview } = await supabase
          .from("reviews")
          .select("*, profiles(username, avatar_url)")
          .eq("id", inserted.id)
          .single();

        const reviewToAdd = newReview || {
          ...inserted,
          profiles: { username: "You", avatar_url: null },
        };

        // ✅ add to top of community list — no refresh
        setReviews((prev) => [reviewToAdd, ...prev]);
        setUserReview(reviewToAdd);
        setFormMsg("Review submitted!");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setFormMsg("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete review ──
  const handleDeleteReview = async () => {
    if (!userReview) return;
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", userReview.id)
      .eq("user_id", currentUser.id);

    if (error) { console.error("Delete error:", error); return; }

    // ✅ remove from list — no refresh
    setReviews((prev) => prev.filter((r) => r.id !== userReview.id));
    setUserReview(null);
    setRating(0);
    setBody("");
    setEditing(false);
    setFormMsg("");
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center
        ${dk ? "bg-[#09090f]" : "bg-[#faf9f7]"}`}>
        <div className="w-6 h-6 border-2 border-red-500 border-t-transparent
          rounded-full animate-spin" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className={`min-h-screen flex flex-col items-center
        justify-center gap-4
        ${dk ? "bg-[#09090f]" : "bg-[#faf9f7]"}`}>
        <p className={dk ? "text-gray-400" : "text-gray-500"}>
          Movie not found.
        </p>
        <button onClick={() => navigate("/home")}
          className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm">
          Go Home
        </button>
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

      {/* ✅ Navbar — no search props needed */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onSearch={() => {}}
        onSearchIconClick={() => navigate("/home")}
      />

      {/* Backdrop */}
      {movie.backdrop_path && (
        <div className="relative h-72 sm:h-96 w-full mt-16 overflow-hidden">
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0"
            style={{
              background: dk
                ? "linear-gradient(to bottom, rgba(9,9,15,0.3), rgba(9,9,15,1))"
                : "linear-gradient(to bottom, rgba(250,249,247,0.1), rgba(250,249,247,1))",
            }}
          />
        </div>
      )}

      <main className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20
        ${movie.backdrop_path ? "-mt-75 relative z-10" : "pt-24"}`}>

        {/* Movie Info Card */}
        <div className={`rounded-3xl overflow-hidden border mb-8
          ${dk
            ? "bg-[#0e0e18] border-white/8"
            : "bg-white border-gray-200 shadow-xl"}`}>
          <div className="p-6 sm:p-8">
            <div className="flex gap-6 flex-wrap sm:flex-nowrap">

              {/* Poster */}
              <div className="w-32 sm:w-44 flex-shrink-0 rounded-2xl
                overflow-hidden border border-white/15 self-start">
                <img
                  src={getImageUrl(movie.poster_path)}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <button
                  onClick={() => navigate(-1)}
                  className={`flex items-center gap-1.5 text-xs mb-4
                    transition-colors
                    ${dk
                      ? "text-gray-500 hover:text-white"
                      : "text-gray-400 hover:text-gray-900"}`}
                >
                  <svg className="w-3.5 h-3.5" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>

                <h1
                  className={`text-3xl sm:text-4xl font-black uppercase
                    leading-none mb-2
                    ${dk ? "text-white" : "text-gray-900"}`}
                  style={{ fontFamily: "'Bebas Neue', cursive" }}
                >
                  {movie.title}
                </h1>

                {movie.tagline && (
                  <p className={`text-sm italic mb-4
                    ${dk ? "text-gray-500" : "text-gray-400"}`}>
                    "{movie.tagline}"
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    movie.release_date?.slice(0, 4),
                    movie.runtime ? `${movie.runtime} min` : null,
                    movie.original_language?.toUpperCase(),
                  ].filter(Boolean).map((m) => (
                    <span key={m}
                      className={`px-3 py-1 rounded-xl text-xs font-medium border
                        ${dk
                          ? "bg-white/5 border-white/10 text-gray-300"
                          : "bg-gray-100 border-gray-200 text-gray-600"}`}>
                      {m}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.genres?.map((g) => (
                    <span key={g.id}
                      className="px-3 py-1 rounded-xl text-xs font-medium
                        bg-red-500/15 text-red-400 border border-red-500/20">
                      {g.name}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 mb-5 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="text-yellow-400 text-sm">★</span>
                    <span className={`text-sm font-bold
                      ${dk ? "text-white" : "text-gray-900"}`}>
                      {movie.vote_average?.toFixed(1)}
                    </span>
                    <span className={`text-xs
                      ${dk ? "text-gray-500" : "text-gray-400"}`}>
                      TMDb
                    </span>
                  </div>
                  {avgRating && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-red-400 text-sm">★</span>
                      <span className={`text-sm font-bold
                        ${dk ? "text-white" : "text-gray-900"}`}>
                        {avgRating}
                      </span>
                      <span className={`text-xs
                        ${dk ? "text-gray-500" : "text-gray-400"}`}>
                        Community ({reviews.length})
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={toggleWatchlist}
                  disabled={wlLoading}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl
                    text-sm font-semibold border transition-all
                    hover:scale-105 active:scale-95 disabled:opacity-50
                    ${inWatchlist
                      ? "bg-red-500 text-white border-red-500"
                      : dk
                        ? "bg-white/5 border-white/15 text-white hover:bg-white/10"
                        : "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200"}`}
                >
                  <svg className="w-4 h-4"
                    fill={inWatchlist ? "currentColor" : "none"}
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                  </svg>
                  {wlLoading ? "..." : inWatchlist ? "In Watchlist" : "Add to Watchlist"}
                </button>
              </div>
            </div>

            {movie.overview && (
              <div className={`mt-6 pt-6 border-t
                ${dk ? "border-white/6" : "border-gray-100"}`}>
                <h3 className={`text-xs font-semibold tracking-widest
                  uppercase mb-3
                  ${dk ? "text-gray-500" : "text-gray-400"}`}>
                  Overview
                </h3>
                <p className={`text-sm leading-relaxed
                  ${dk ? "text-gray-300" : "text-gray-700"}`}>
                  {movie.overview}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Trailer */}
        {trailer && (
          <div className="mb-8">
            <h2 className={`text-xs font-semibold tracking-widest uppercase
              mb-4 flex items-center gap-3
              ${dk ? "text-gray-500" : "text-gray-400"}`}>
              <div className="w-4 h-px bg-red-500" />
              Trailer
            </h2>
            <div className="rounded-2xl overflow-hidden aspect-video
              border border-white/8">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title="Trailer"
                allow="accelerometer; autoplay; clipboard-write;
                  encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        )}

        {/* Cast */}
        {credits.length > 0 && (
          <div className="mb-8">
            <h2 className={`text-xs font-semibold tracking-widest uppercase
              mb-4 flex items-center gap-3
              ${dk ? "text-gray-500" : "text-gray-400"}`}>
              <div className="w-4 h-px bg-red-500" />
              Cast
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {credits.map((actor) => (
                <div key={actor.id}
                  className={`rounded-2xl overflow-hidden border text-center
                    transition-all hover:scale-105
                    ${dk
                      ? "bg-white/4 border-white/8 hover:border-red-500/30"
                      : "bg-white border-gray-100 shadow-sm hover:border-red-200"}`}>
                  <div className="aspect-[2/3] overflow-hidden">
                    {actor.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                        alt={actor.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center
                        justify-center
                        ${dk ? "bg-white/8" : "bg-gray-100"}`}>
                        <svg className={`w-8 h-8
                          ${dk ? "text-gray-600" : "text-gray-300"}`}
                          fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7
                            2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12
                            12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2
                            v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className={`text-xs font-semibold line-clamp-1
                      ${dk ? "text-white" : "text-gray-900"}`}>
                      {actor.name}
                    </p>
                    <p className={`text-xs line-clamp-1 mt-0.5
                      ${dk ? "text-gray-600" : "text-gray-400"}`}>
                      {actor.character}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Write / Edit Review */}
        <div className={`rounded-3xl p-6 sm:p-8 border mb-8
          ${dk
            ? "bg-white/3 border-white/8"
            : "bg-white border-gray-200 shadow-lg"}`}>

          <h2 className={`text-xs font-semibold tracking-widest uppercase
            mb-6 flex items-center gap-3
            ${dk ? "text-gray-500" : "text-gray-400"}`}>
            <div className="w-4 h-px bg-red-500" />
            {userReview && !editing
              ? "Your Review"
              : editing ? "Edit Review" : "Write a Review"}
          </h2>

          {userReview && !editing ? (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-yellow-400">
                  {"★".repeat(userReview.rating)}
                  <span className={dk ? "text-gray-700" : "text-gray-300"}>
                    {"★".repeat(5 - userReview.rating)}
                  </span>
                </span>
                <span className={`text-xs
                  ${dk ? "text-gray-500" : "text-gray-400"}`}>
                  {new Date(userReview.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className={`text-sm leading-relaxed mb-4
                ${dk ? "text-gray-300" : "text-gray-700"}`}>
                {userReview.body}
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(true);
                    setRating(userReview.rating);
                    setBody(userReview.body);
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold
                    border transition-all hover:scale-105
                    ${dk
                      ? "bg-white/5 border-white/15 text-white hover:bg-white/10"
                      : "bg-gray-100 border-gray-200 text-gray-700"}`}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={handleDeleteReview}
                  className="px-4 py-2 rounded-xl text-sm font-semibold
                    bg-red-500/10 text-red-400 border border-red-500/20
                    hover:bg-red-500 hover:text-white transition-all
                    hover:scale-105"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <p className={`text-xs mb-2
                  ${dk ? "text-gray-500" : "text-gray-400"}`}>
                  Your Rating
                </p>
                <StarPicker
                  value={rating}
                  onChange={setRating}
                  darkMode={darkMode}
                />
              </div>

              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your review (minimum 20 characters)..."
                rows={4}
                className={`w-full px-4 py-3 rounded-2xl border text-sm
                  outline-none resize-none transition-all mb-1
                  ${dk
                    ? "bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-red-500/50"
                    : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-red-400"}`}
              />

              <p className={`text-xs mb-3
                ${body.trim().length >= 20 ? "text-green-400" : "text-red-400"}`}>
                {body.trim().length} / 20 minimum characters
              </p>

              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleSubmitReview}
                    disabled={submitting}
                    className="px-5 py-2.5 bg-red-500 hover:bg-red-600
                      text-white text-sm font-semibold rounded-xl
                      transition-all hover:scale-105 active:scale-95
                      disabled:opacity-50"
                  >
                    {submitting
                      ? "Submitting..."
                      : editing ? "Update Review" : "Submit Review"}
                  </button>
                  {editing && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setRating(userReview.rating);
                        setBody(userReview.body);
                        setFormMsg("");
                      }}
                      className={`px-5 py-2.5 rounded-xl text-sm
                        font-semibold border transition-all
                        ${dk
                          ? "border-white/15 text-white hover:bg-white/5"
                          : "border-gray-200 text-gray-700 hover:bg-gray-100"}`}
                    >
                      Cancel
                    </button>
                  )}
                </div>
                {formMsg && (
                  <p className={`text-xs font-medium
                    ${formMsg.includes("!") ? "text-green-400" : "text-red-400"}`}>
                    {formMsg}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Community Reviews */}
        <div>
          <h2 className={`text-xs font-semibold tracking-widest uppercase
            mb-6 flex items-center gap-3
            ${dk ? "text-gray-500" : "text-gray-400"}`}>
            <div className="w-4 h-px bg-red-500" />
            Community Reviews
            {reviews.length > 0 && (
              <span className={`text-xs normal-case tracking-normal
                ${dk ? "text-gray-600" : "text-gray-400"}`}>
                ({reviews.length})
              </span>
            )}
          </h2>

          {reviews.length === 0 ? (
            <div className={`rounded-2xl p-8 border text-center
              ${dk
                ? "bg-white/3 border-white/8"
                : "bg-white border-gray-200"}`}>
              <p className={`text-sm
                ${dk ? "text-gray-500" : "text-gray-400"}`}>
                No reviews yet — be the first to review this movie
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id}
                  className={`rounded-2xl p-5 border
                    ${dk
                      ? "bg-white/3 border-white/8"
                      : "bg-white border-gray-200 shadow-sm"}`}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-red-500/20
                      flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-red-400"
                        fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4
                          12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4
                          c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4
                          c0-3.2-6.4-4.8-9.6-4.8z"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between
                        flex-wrap gap-2">
                        <p className={`text-sm font-semibold
                          ${dk ? "text-white" : "text-gray-900"}`}>
                          {r.profiles?.username || "Anonymous"}
                        </p>
                        <span className={`text-xs
                          ${dk ? "text-gray-600" : "text-gray-400"}`}>
                          {new Date(r.created_at).toLocaleDateString("en-US", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-yellow-400 text-xs">
                          {"★".repeat(r.rating)}
                        </span>
                        <span className={`text-xs
                          ${dk ? "text-gray-700" : "text-gray-300"}`}>
                          {"★".repeat(5 - r.rating)}
                        </span>
                        <span className={`text-xs ml-1
                          ${dk ? "text-gray-500" : "text-gray-400"}`}>
                          {r.rating}/5
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className={`text-sm leading-relaxed
                    ${dk ? "text-gray-300" : "text-gray-700"}`}>
                    {r.body}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}