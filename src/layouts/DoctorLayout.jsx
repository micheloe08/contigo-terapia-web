import { Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useRoleGuard } from '../hooks/useRoleGuard'
import DashboardNavbar from '../components/dashboard/DashboardNavbar'

export default function DoctorLayout() {
  const redirect = useRoleGuard('doctor')
  const user = useAuthStore((state) => state.user)

  if (redirect) return redirect

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNavbar icon="ti-stethoscope" label={`Dr. ${user.name}`} />
      <Outlet />
    </div>
  )
}
