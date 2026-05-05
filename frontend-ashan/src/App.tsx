import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Pages
import HomePage from './pages/HomePage'
import Login from './pages/LoginPage'
import SignUp from './pages/SignUpPage'
import ForgotPassword from './pages/ForgotPassword'

// Components
import ProtectedRoute from './components/ProtectedRoute'
import LoadingScreen from './components/LoadingScreen'

// Placeholder pages (create simple ones if not yet)
const Profile = () => <div>Profile Page</div>
const Watchlist = () => <div>Watchlist Page</div>
const Search = () => <div>Search Page</div>
const MovieDetail = () => <div>Movie Detail Page</div>

function App(): JSX.Element {
  const { loading } = useAuth()

  // Prevent flash before auth loads
  if (loading) return <LoadingScreen />

  return (
    <BrowserRouter>
      <Routes>
        {/* 🌐 Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* 🔐 Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/watchlist" element={<Watchlist />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App