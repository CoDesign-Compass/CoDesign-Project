import { Navigate, useLocation } from 'react-router-dom'

export default function RequireAdmin({ children }) {
  const location = useLocation()
  const role = (localStorage.getItem('userRole') || '').toUpperCase()

  if (role !== 'ADMIN') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
