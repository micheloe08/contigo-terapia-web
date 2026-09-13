import { useAuthStore } from "../../store/authStore";
import { Button } from "../../components/ui/button";

export default function PatientDashboard() {
  const user = useAuthStore((state) => state.user);

  return (
    <>
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
          <Button variant="cta" className="h-auto px-8 py-3 rounded-xl text-sm">
            Buscar terapeuta
          </Button>
        </div>
      </main>
    </>
  );
}
