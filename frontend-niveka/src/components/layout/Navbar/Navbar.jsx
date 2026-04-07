import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/slices/authSlice";
import { supabase } from "../../../services/supabaseClient";

export default function Navbar({ darkMode, setDarkMode, onSearch, onSearchIconClick }) {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const dk = darkMode;
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(logout());
    navigate("/login");
  };

  // Navbar always dark — matches the dark hero background
  const nav = "bg-[#080810]/95 border-b border-white/5";
  const inputWrap = "bg-white/5 border-white/10 focus-within:border-red-500/40";
  const inputText = "text-white placeholder-gray-600";
  const iconBtn   = "text-gray-500 hover:text-white hover:bg-white/8";
  const textBtn   = "text-gray-500 hover:text-white hover:bg-white/5";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl transition-colors
        duration-300 ${nav}`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-7 h-7 bg-red-500 rounded-lg flex items-center
              justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8
                  17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>
              </svg>
            </div>
            <span className="font-bold text-base text-white tracking-tight hidden sm:block">
              MovieExplorer
            </span>
          </Link>

          {/* Desktop search */}
          <div className="hidden md:flex flex-1 max-w-xs">
            <div className={`flex items-center gap-2 w-full px-4 py-2 rounded-xl
              border transition-all ${inputWrap}`}>
              <svg className="w-4 h-4 flex-shrink-0 text-gray-600"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search movies..."
                className={`flex-1 bg-transparent outline-none text-sm ${inputText}`}
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1">

            {/* Mobile search */}
            <button
              onClick={onSearchIconClick}
              className={`md:hidden p-2 rounded-lg transition-colors ${iconBtn}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
              {/* Favourites */}
<Link
  to="/favourites"
  className={`p-2 rounded-lg transition-colors relative
    ${dk
      ? "text-gray-500 hover:text-red-400 hover:bg-white/5"
      : "text-gray-500 hover:text-red-500 hover:bg-gray-100"}`}
>
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5
        4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
</Link>
            {/* Theme toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-all duration-300 ${iconBtn}`}
              title={darkMode ? "Light mode" : "Dark mode"}
            >
              {darkMode ? (
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17a5 5 0 100-10 5 5 0 000 10zm0-12a1 1 0 100-2 1
                    1 0 000 2zm0 14a1 1 0 100 2 1 1 0 000-2zm-7-7a1 1 0 100-2 1
                    1 0 000 2zm14 0a1 1 0 100-2 1 1 0 000 2zM5.64 6.05a1 1 0
                    10-1.41 1.41 1 1 0 001.41-1.41zm12.73 12.73a1 1 0 10-1.41
                    1.41 1 1 0 001.41-1.41zm-12.73 0a1 1 0 10-1.41-1.41 1 1 0
                    001.41 1.41zm12.73-12.73a1 1 0 10-1.41-1.41 1 1 0 001.41 1.41z"/>
                </svg>
              ) : (
                <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                </svg>
              )}
            </button>

            {/* Profile */}
            <Link
              to="/profile"
              className={`w-8 h-8 rounded-xl flex items-center justify-center
                flex-shrink-0 transition-all text-gray-400
                hover:bg-red-500 hover:text-white bg-white/5 border border-white/10`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5
                  7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className={`flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5
                rounded-lg text-sm font-medium transition-colors ${textBtn}`}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3
                    3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:block">Logout</span>
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
}