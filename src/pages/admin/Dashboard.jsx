import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import apiClient from "../../api/client";

const QUICK_ACTIONS = [
  { icon: "ti-user-check", title: "Aprobar terapeutas", desc: "Revisar solicitudes pendientes", href: "/admin/terapeutas" },
  { icon: "ti-certificate", title: "Gestionar membresías", desc: "Activar o desactivar accesos", href: "#" },
  { icon: "ti-list", title: "Catálogos", desc: "Enfoques, modalidades y poblaciones", href: "/admin/catalogos" },
  { icon: "ti-book", title: "Administrar cursos", desc: "Publicar capacitaciones", href: "#" },
  { icon: "ti-file-text", title: "Wiki y recursos", desc: "Gestionar contenido publicado", href: "#" },
  { icon: "ti-users", title: "Usuarios del sistema", desc: "Operators y supervisores", href: "#" },
  { icon: "ti-chart-bar", title: "Reportes", desc: "Ingresos y actividad", href: "#" },
];

export default function AdminDashboard() {
  const user = useAuthStore((state) => state.user);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0, patients: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    apiClient.get("/supervisor/stats")
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoadingStats(false));
  }, []);

  const STATS = [
    { icon: "ti-users", label: "Terapeutas registrados", value: stats.total, color: "bg-blue-50", iconColor: "text-blue-600" },
    { icon: "ti-user-check", label: "Pendientes de aprobación", value: stats.pending, color: "bg-amber-50", iconColor: "text-amber-500" },
    { icon: "ti-heart", label: "Pacientes registrados", value: stats.patients, color: "bg-green-50", iconColor: "text-green-500" },
    { icon: "ti-circle-check", label: "Terapeutas aprobados", value: stats.approved, color: "bg-indigo-50", iconColor: "text-indigo-500" },
  ];

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
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
              <i className={`ti ${stat.icon} text-xl ${stat.iconColor}`} />
            </div>
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="text-3xl font-medium text-slate-900 mt-1">
              {loadingStats ? "—" : stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Alerta de pendientes */}
      {stats.pending > 0 && (
        <Link to="/admin/terapeutas" className="block mb-6">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 flex items-center gap-3 hover:bg-amber-100 transition-colors">
            <i className="ti ti-alert-triangle text-amber-500 text-xl shrink-0" />
            <div>
              <p className="font-medium text-amber-800 text-sm">
                {stats.pending} terapeuta{stats.pending > 1 ? "s" : ""} pendiente{stats.pending > 1 ? "s" : ""} de aprobación
              </p>
              <p className="text-amber-600 text-sm">Haz clic para revisar las solicitudes →</p>
            </div>
          </div>
        </Link>
      )}

      {/* Quick actions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="font-medium text-slate-900 mb-4">Acciones rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.title}
              to={action.href}
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-blue-50 hover:border-blue-200 transition-colors"
            >
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                <i className={`ti ${action.icon} text-blue-600`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{action.title}</p>
                <p className="text-xs text-slate-500">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
