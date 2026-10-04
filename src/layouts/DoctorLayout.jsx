import { Outlet, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useRoleGuard } from '../hooks/useRoleGuard'
import DashboardNavbar from '../components/dashboard/DashboardNavbar'

export default function DoctorLayout() {
  const redirect = useRoleGuard('doctor')
  const user = useAuthStore((state) => state.user)

  if (redirect) return redirect

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNavbar
        icon="ti-stethoscope"
        label={`Dr. ${user?.name}`}
        extraLinks={
          <Link
            to="/doctor/cursos"
            className="text-sm text-slate-600 hover:text-blue-600 hidden sm:flex items-center gap-1.5 transition-colors"
          >
            <i className="ti ti-books text-base" />
            Cursos
          </Link>
        }
      />
      <Outlet />
    </div>
  )
}
