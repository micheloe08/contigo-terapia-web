import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../api/client";
import { useAuthStore } from "../../store/authStore";

export default function DoctorDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ today: 0, pending: 0, completed: 0, patients: 0 });
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    Promise.all([
      apiClient.get("/doctor/appointments/stats"),
      apiClient.get(`/doctor/appointments?date=${today}&status=all`),
    ])
      .then(([statsRes, apptRes]) => {
        setStats(statsRes.data);
        setTodayAppointments(apptRes.data.data ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const STATUS_LABELS = {
    pending:    { label: "Pendiente",   className: "bg-amber-100 text-amber-700" },
    confirmed:  { label: "Confirmada",  className: "bg-blue-100 text-blue-700" },
    completed:  { label: "Completada",  className: "bg-green-100 text-green-700" },
    cancelled:  { label: "Cancelada",   className: "bg-red-100 text-red-700" },
    in_progress:{ label: "En curso",    className: "bg-indigo-100 text-indigo-700" },
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-slate-900">
          Bienvenido, Dr. {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-slate-500 mt-1">Gestiona tu agenda y tus pacientes desde aquí</p>
      </div>

      {/* Alerta cédula pendiente */}
      {user?.doctor?.license_status === "pending" && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 mb-6 flex items-center gap-3">
          <i className="ti ti-clock text-amber-500 text-xl" />
          <div>
            <p className="font-medium text-amber-800 text-sm">Cédula en revisión</p>
            <p className="text-amber-600 text-sm">Tu cédula profesional está siendo verificada.</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { icon: "ti-calendar", label: "Citas hoy",   value: stats.today,     color: "bg-blue-50 text-blue-600" },
          { icon: "ti-clock",    label: "Pendientes",  value: stats.pending,   color: "bg-amber-50 text-amber-500" },
          { icon: "ti-check",    label: "Completadas", value: stats.completed, color: "bg-green-50 text-green-500" },
          { icon: "ti-users",    label: "Pacientes",   value: stats.patients,  color: "bg-indigo-50 text-indigo-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color.split(" ")[0]}`}>
              <i className={`ti ${s.icon} text-xl ${s.color.split(" ")[1]}`} />
            </div>
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className="text-3xl font-medium text-slate-900 mt-1">{loading ? "—" : s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agenda del día */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-slate-900">Agenda de hoy</h2>
            <Link to="/doctor/citas" className="text-sm text-blue-600 hover:underline">Ver completa →</Link>
          </div>
          {loading ? (
            <div className="text-center py-8 text-slate-400 text-sm">Cargando...</div>
          ) : todayAppointments.length === 0 ? (
            <div className="text-center py-8">
              <i className="ti ti-calendar-off text-slate-300 text-4xl mb-3 block" />
              <p className="text-slate-400 text-sm">No tienes citas programadas para hoy</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50">
                  <div className="text-center shrink-0 w-12">
                    <p className="text-sm font-semibold text-slate-900">
                      {new Date(apt.starts_at).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{apt.patient?.user?.name}</p>
                    <p className="text-xs text-slate-500">{apt.type}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_LABELS[apt.status?.value ?? apt.status]?.className}`}>
                    {STATUS_LABELS[apt.status?.value ?? apt.status]?.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Acciones rápidas */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-medium text-slate-900 mb-4">Acciones rápidas</h2>
          <div className="flex flex-col gap-3">
            <Link to="/doctor/horarios" className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-blue-50 hover:border-blue-200 transition-colors">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <i className="ti ti-clock text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Configurar horarios</p>
                <p className="text-xs text-slate-500">Define tu disponibilidad semanal</p>
              </div>
            </Link>
            <Link to="/doctor/citas" className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-blue-50 hover:border-blue-200 transition-colors">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <i className="ti ti-calendar text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Ver todas las citas</p>
                <p className="text-xs text-slate-500">Gestiona tu agenda completa</p>
              </div>
            </Link>
            <button className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-blue-50 hover:border-blue-200 transition-colors text-left">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <i className="ti ti-user text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Editar perfil</p>
                <p className="text-xs text-slate-500">Actualiza tu información profesional</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
