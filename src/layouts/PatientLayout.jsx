import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function PatientLayout() {
  const { user } = useAuthStore()

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'patient') return <Navigate to="/doctor" replace />

  return (
    <div className="min-h-screen bg-slate-50">
      <Outlet />
    </div>
  )
}