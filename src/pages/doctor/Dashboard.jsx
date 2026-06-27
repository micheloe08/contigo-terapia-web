import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/auth";

export default function DoctorDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      logout();
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <i className="ti ti-heart text-white text-sm" />
            </div>
            <span className="font-medium text-slate-900">Contigo Terapia</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="ti ti-stethoscope text-blue-600 text-sm" />
              </div>
              <span className="text-sm text-slate-600">Dr. {user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-slate-900">
            Bienvenido, Dr. {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-slate-500 mt-1">
            Gestiona tu agenda y tus pacientes desde aquí
          </p>
        </div>

        {/* Alerta cédula pendiente */}
        {user?.doctor?.license_status === "pending" && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 mb-6 flex items-center gap-3">
            <i className="ti ti-clock text-amber-500 text-xl" />
            <div>
              <p className="font-medium text-amber-800 text-sm">
                Cédula en revisión
              </p>
              <p className="text-amber-600 text-sm">
                Tu cédula profesional está siendo verificada. Te notificaremos
                cuando sea aprobada.
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
              <i className="ti ti-calendar text-blue-600 text-xl" />
            </div>
            <p className="text-sm text-slate-500">Citas hoy</p>
            <p className="text-3xl font-medium text-slate-900 mt-1">0</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mb-3">
              <i className="ti ti-clock text-amber-500 text-xl" />
            </div>
            <p className="text-sm text-slate-500">Pendientes</p>
            <p className="text-3xl font-medium text-slate-900 mt-1">0</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-3">
              <i className="ti ti-check text-green-500 text-xl" />
            </div>
            <p className="text-sm text-slate-500">Completadas</p>
            <p className="text-3xl font-medium text-slate-900 mt-1">0</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
              <i className="ti ti-users text-blue-600 text-xl" />
            </div>
            <p className="text-sm text-slate-500">Pacientes</p>
            <p className="text-3xl font-medium text-slate-900 mt-1">0</p>
          </div>
        </div>

        {/* Dos columnas */}
        <div className="grid grid-cols-2 gap-6">
          {/* Agenda del día */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-slate-900">Agenda de hoy</h2>
              <button className="text-sm text-blue-600 hover:underline">
                Ver completa →
              </button>
            </div>
            <div className="text-center py-8">
              <i className="ti ti-calendar-off text-slate-300 text-4xl mb-3 block" />
              <p className="text-slate-400 text-sm">
                No tienes citas programadas para hoy
              </p>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-medium text-slate-900 mb-4">
              Acciones rápidas
            </h2>
            <div className="flex flex-col gap-3">
              <button className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-blue-50 hover:border-blue-200 transition-colors text-left">
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                  <i className="ti ti-clock text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Configurar horarios
                  </p>
                  <p className="text-xs text-slate-500">
                    Define tu disponibilidad semanal
                  </p>
                </div>
              </button>
              <button className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-blue-50 hover:border-blue-200 transition-colors text-left">
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                  <i className="ti ti-user text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Editar perfil
                  </p>
                  <p className="text-xs text-slate-500">
                    Actualiza tu información profesional
                  </p>
                </div>
              </button>
              <button className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-blue-50 hover:border-blue-200 transition-colors text-left">
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                  <i className="ti ti-users text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Ver pacientes
                  </p>
                  <p className="text-xs text-slate-500">
                    Historial y expedientes
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
