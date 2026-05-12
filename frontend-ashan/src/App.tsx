import './App.scss'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import HomePage from './pages/HomePage'
//import SearchResultsPage from './pages/SearchResultsPage'
//import MovieDetailPage from './pages/MovieDetailPage'
//import ProfilePage from './pages/ProfilePage'
//import WatchlistPage from './pages/WatchlistPage'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const { loading } = useAuth()

  // Loading screen while AuthContext initializes
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="w-12 h-12 border-4 rounded-full border-slate-300 animate-spin border-t-red-500" />
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        {/* ===== PUBLIC ROUTES ===== */}
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/search" element={<SearchResultsPage />} /> */}
        {/* <Route path="/movie/:id" element={<MovieDetailPage />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ===== PROTECTED ROUTES ===== 
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/watchlist"
          element={
            <ProtectedRoute>
              <WatchlistPage />
            </ProtectedRoute>
          }
        />*/}

        {/* 404 FALLBACK */}
        <Route 
          path="*" 
          element={
            <div className="flex items-center justify-center min-h-screen text-xl text-white">
              404 - Page not found
            </div>
          } 
        />
      </Routes>
    </Router>
  )
}

export default App