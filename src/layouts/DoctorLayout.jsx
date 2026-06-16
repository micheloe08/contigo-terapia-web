import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function DoctorLayout() {
  const { user } = useAuthStore()

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'doctor') return <Navigate to="/paciente" replace />

  return (
    <div className="min-h-screen bg-slate-50">
      <Outlet />
    </div>
  )
}