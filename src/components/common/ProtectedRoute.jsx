import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function ProtectedRoute({ allowedRoles, redirectTo = '/' }) {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!allowedRoles.includes(user?.rol)) return <Navigate to={redirectTo} replace />

  return <Outlet />
}
