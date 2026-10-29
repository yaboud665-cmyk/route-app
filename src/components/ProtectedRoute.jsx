import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '@/context/AuthContext'
import FullPageLoader from '@/components/FullPageLoader'

/** يمنع الوصول للصفحات المحمية لأي حد مش مسجّل دخول */
export default function ProtectedRoute() {
  const { isAuthenticated, isBootstrapping } = useAuth()
  const location = useLocation()

  if (isBootstrapping) return <FullPageLoader />

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

/** يمنع المسجّلين بالفعل من فتح صفحات الـ login / signup */
export function PublicOnlyRoute() {
  const { isAuthenticated, isBootstrapping } = useAuth()

  if (isBootstrapping) return <FullPageLoader />

  if (isAuthenticated) return <Navigate to="/" replace />

  return <Outlet />
}
