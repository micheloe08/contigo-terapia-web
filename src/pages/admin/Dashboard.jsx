import { useAuthStore } from "../../store/authStore";

const STATS = [
  { icon: "ti-users", label: "Terapeutas registrados", value: "0", color: "bg-blue-50 text-blue-600" },
  { icon: "ti-user-check", label: "Pendientes de aprobación", value: "0", color: "bg-amber-50 text-amber-500" },
  { icon: "ti-heart", label: "Pacientes registrados", value: "0", color: "bg-green-50 text-green-500" },
  { icon: "ti-calendar", label: "Citas este mes", value: "0", color: "bg-indigo-50 text-indigo-500" },
];

const QUICK_ACTIONS = [
  { icon: "ti-user-check", title: "Aprobar terapeutas", desc: "Revisar solicitudes pendientes", href: "#" },
  { icon: "ti-certificate", title: "Gestionar membresías", desc: "Activar o desactivar accesos", href: "#" },
  { icon: "ti-book", title: "Administrar cursos", desc: "Publicar capacitaciones", href: "#" },
  { icon: "ti-file-text", title: "Wiki y recursos", desc: "Gestionar contenido publicado", href: "#" },
  { icon: "ti-users", title: "Usuarios del sistema", desc: "Operators y supervisores", href: "#" },
  { icon: "ti-chart-bar", title: "Reportes", desc: "Ingresos y actividad", href: "#" },
];

export default function AdminDashboard() {
  const user = useAuthStore((state) => state.user);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-slate-900">
          Panel de Administración 👋
        </h1>
        <p className="text-slate-500 mt-1">
          Bienvenido, {user?.name}. Aquí gestionas toda la plataforma.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color.split(" ")[0]}`}>
              <i className={`ti ${stat.icon} text-xl ${stat.color.split(" ")[1]}`} />
            </div>
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="text-3xl font-medium text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="font-medium text-slate-900 mb-4">Acciones rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.title}
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-blue-50 hover:border-blue-200 transition-colors text-left"
            >
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                <i className={`ti ${action.icon} text-blue-600`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{action.title}</p>
                <p className="text-xs text-slate-500">{action.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
