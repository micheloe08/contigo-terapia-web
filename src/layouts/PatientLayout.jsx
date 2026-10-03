import { Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useRoleGuard } from '../hooks/useRoleGuard'
import DashboardNavbar from '../components/dashboard/DashboardNavbar'

export default function PatientLayout() {
  const redirect = useRoleGuard('patient')
  const user = useAuthStore((state) => state.user)

  if (redirect) return redirect

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNavbar icon="ti-user" label={user.name} />
      <Outlet />
    </div>
  )
}
