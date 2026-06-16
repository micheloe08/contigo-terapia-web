import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function GuestLayout() {
  const { user } = useAuthStore()

  if (user) {
    return <Navigate to={user.role === 'doctor' ? '/doctor' : '/paciente'} replace />
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Outlet />
    </div>
  )
}