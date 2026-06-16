import { useAuthStore } from '../../store/authStore'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../../api/auth'
import { Button } from '../../components/ui/button'

export default function DoctorDashboard() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } finally {
      logout()
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-slate-900">Contigo Terapia</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600">Dr. {user?.name}</span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-6xl mx-auto p-6">

        {/* Status cédula */}
        {user?.doctor?.license_status === 'pending' && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6 text-sm">
            Tu cédula profesional está en revisión. Te notificaremos cuando sea verificada.
          </div>
        )}

        <h2 className="text-2xl font-bold text-slate-900 mb-6">Mi Dashboard</h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Citas hoy</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">0</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Pendientes</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">0</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Completadas</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">0</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Pacientes</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">0</p>
          </div>
        </div>

        {/* Placeholder */}
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <p className="text-slate-500">Aquí aparecerá tu agenda del día.</p>
          <Button className="mt-4">Configurar horarios</Button>
        </div>
      </main>
    </div>
  )
}