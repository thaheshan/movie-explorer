import './App.scss'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ForgotPassword from './pages/ForgotPassword'
import HomePage from './pages/HomePage'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner">Loading...</div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/watchlist"
          element={
            <ProtectedRoute>
              <div>Watchlist Page (Coming Soon)</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <div>Profile Page (Coming Soon)</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
