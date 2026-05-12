import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <nav className="flex items-center justify-between p-4 text-white bg-slate-900">
      <div className="flex gap-6">
        <Link to="/" className="text-lg font-bold hover:text-red-500">
          Movie Explorer
        </Link>
        <Link to="/search" className="hover:text-red-500">
          Search
        </Link>
        {user && (
          <>
            <Link to="/watchlist" className="hover:text-red-500">
              Watchlist
            </Link>
            <Link to="/profile" className="hover:text-red-500">
              Profile
            </Link>
          </>
        )}
      </div>

      <div>
        {user ? (
          <>
            <span className="mr-4">{user.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}