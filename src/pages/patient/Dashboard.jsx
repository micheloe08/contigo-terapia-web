import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/auth";

export default function PatientDashboard() {
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <i className="ti ti-heart text-white text-sm" />
            </div>
            <span className="font-medium text-slate-900 hidden sm:inline">
              Contigo Terapia
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="ti ti-user text-blue-600 text-sm" />
              </div>
              <span className="text-sm text-slate-600 hidden sm:inline">
                {user?.name}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <span className="hidden sm:inline">Cerrar sesión</span>
              <i className="ti ti-logout sm:hidden text-base" />
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-slate-900">
            Bienvenido, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-slate-500 mt-1">
            Aquí puedes gestionar tus citas y sesiones
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
              <i className="ti ti-calendar text-blue-600 text-xl" />
            </div>
            <p className="text-sm text-slate-500">Próximas citas</p>
            <p className="text-3xl font-medium text-slate-900 mt-1">0</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
              <i className="ti ti-check text-blue-600 text-xl" />
            </div>
            <p className="text-sm text-slate-500">Citas completadas</p>
            <p className="text-3xl font-medium text-slate-900 mt-1">0</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
              <i className="ti ti-heart text-blue-600 text-xl" />
            </div>
            <p className="text-sm text-slate-500">Terapeutas favoritos</p>
            <p className="text-3xl font-medium text-slate-900 mt-1">0</p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 sm:p-8 text-center">
          <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ti ti-search text-white text-2xl" />
          </div>
          <h2 className="text-xl font-medium text-blue-900 mb-2">
            Agenda tu primera sesión
          </h2>
          <p className="text-blue-600 mb-6">
            Encuentra al terapeuta ideal para ti entre nuestros especialistas
            certificados
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-800 px-8 py-3 rounded-xl text-sm font-medium transition-colors">
            Buscar terapeuta
          </button>
        </div>
      </main>
    </div>
  );
}
