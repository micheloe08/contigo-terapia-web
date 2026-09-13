import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const ROLE_HOME = {
  patient: '/paciente',
  doctor: '/doctor',
}

/**
 * Guard for role-scoped layouts. Returns a <Navigate/> element to render
 * instead of the layout when the visitor isn't logged in or has the wrong
 * role, or `null` when they're allowed through.
 */
export function useRoleGuard(role) {
  const user = useAuthStore((state) => state.user)

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== role) return <Navigate to={ROLE_HOME[user.role] ?? '/login'} replace />

  return null
}
