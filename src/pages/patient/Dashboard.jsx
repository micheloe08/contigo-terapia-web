import { useAuthStore } from '../../store/authStore'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../../api/auth'
import { Button } from '../../components/ui/button'

export default function PatientDashboard() {
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
          <span className="text-sm text-slate-600">Hola, {user?.name}</span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Mi Dashboard</h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Próximas citas</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">0</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Citas completadas</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">0</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Terapeutas favoritos</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">0</p>
          </div>
        </div>

        {/* Placeholder */}
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <p className="text-slate-500">Aquí aparecerán tus próximas citas.</p>
          <Button className="mt-4">Buscar terapeuta</Button>
        </div>
      </main>
    </div>
  )
}