import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

// Rutas de autenticación: si el usuario ya está logueado, lo mandamos a su dashboard
const AUTH_ONLY_PATHS = ['/login', '/registro/paciente', '/registro/doctor']

export default function GuestLayout() {
  const { user } = useAuthStore()
  const { pathname } = useLocation()

  // Solo redirigir en rutas de auth (login/registro), no en rutas públicas como home o terapeutas
  if (user && AUTH_ONLY_PATHS.includes(pathname)) {
    if (user.role === 'admin' || user.role === 'operator' || user.role === 'supervisor_doctor') {
      return <Navigate to="/admin" replace />
    }
    return <Navigate to={user.role === 'doctor' ? '/doctor' : '/paciente'} replace />
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Outlet />
    </div>
  )
}
