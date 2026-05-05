import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar(): JSX.Element {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <nav className="text-white shadow-lg bg-slate-800">
      <div className="container flex items-center justify-between px-4 py-4 mx-auto">
        <Link to="/" className="text-2xl font-bold">
          🎬 Movie Explorer
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-blue-400">Home</Link>
          <Link to="/search" className="hover:text-blue-400">Search</Link>
          
          {user ? (
            <>
              <Link to="/watchlist" className="hover:text-blue-400">Watchlist</Link>
              <Link to="/profile" className="hover:text-blue-400">Profile</Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-400">Login</Link>
              <Link to="/signup" className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}