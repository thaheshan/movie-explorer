import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }: any) {
  const { session } = useAuth()
  
  return session ? <>{children}</> : <Navigate to="/login" />
}