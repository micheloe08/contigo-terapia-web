import { useState, useEffect, useCallback } from "react";
import apiClient from "../../api/client";

const STATUS_LABELS = {
  pending:    { label: "Pendiente",    className: "bg-amber-100 text-amber-700" },
  confirmed:  { label: "Confirmada",   className: "bg-blue-100 text-blue-700" },
  completed:  { label: "Completada",   className: "bg-green-100 text-green-700" },
  cancelled:  { label: "Cancelada",    className: "bg-red-100 text-red-700" },
  in_progress:{ label: "En curso",     className: "bg-indigo-100 text-indigo-700" },
  no_show:    { label: "No se presentó",className: "bg-slate-100 text-slate-500" },
};

const TYPE_ICONS = {
  videollamada: "ti-video",
  chat:         "ti-message",
  presencial:   "ti-building",
};

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [status, setStatus]             = useState("all");
  const [loading, setLoading]           = useState(true);
  const [selected, setSelected]         = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [notes, setNotes]               = useState("");
  const [error, setError]               = useState(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(`/doctor/appointments?status=${status}`);
      setAppointments(res.data.data ?? res.data);
    } catch {
      setError("Error al cargar las citas.");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const handleAction = async (action, appointment) => {
    setActionLoading(true);
    setError(null);
    try {
      const payload = action === "complete" ? { doctor_notes: notes } : {};
      await apiClient.post(`/doctor/appointments/${appointment.id}/${action}`, payload);
      setSelected(null);
      setNotes("");
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.message || "Error al procesar la acción.");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dt) => new Date(dt).toLocaleString("es-MX", {
    weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
  });

  const statusValue = (apt) => apt.status?.value ?? apt.status;

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-slate-900">Mis citas</h1>
        <p className="text-slate-500 mt-1">Gestiona y da seguimiento a tus sesiones.</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["all", "pending", "confirmed", "completed", "cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              status === s ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {{ all: "Todas", pending: "Pendientes", confirmed: "Confirmadas", completed: "Completadas", cancelled: "Canceladas" }[s]}
          </button>
        ))}
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>}

      {loading ? (
        <div className="text-center py-16 text-slate-400">Cargando...</div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <i className="ti ti-calendar-off text-4xl text-slate-300 block mb-3" />
          <p className="text-slate-400">No hay citas en este estado.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((apt) => (
            <div key={apt.id} className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-blue-600 font-semibold text-sm">
                      {apt.patient?.user?.name?.charAt(0) ?? "?"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{apt.patient?.user?.name}</p>
                    <p className="text-sm text-slate-500">{formatDate(apt.starts_at)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <i className={`ti ${TYPE_ICONS[apt.type] ?? "ti-calendar"} text-blue-400 text-xs`} />
                      <span className="text-xs text-slate-400 capitalize">{apt.type}</span>
                      <span className="text-xs text-slate-300">·</span>
                      <span className="text-xs text-slate-400">${Number(apt.price).toLocaleString("es-MX")} MXN</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_LABELS[statusValue(apt)]?.className}`}>
                    {STATUS_LABELS[statusValue(apt)]?.label}
                  </span>
                  {["pending", "confirmed"].includes(statusValue(apt)) && (
                    <button
                      onClick={() => { setSelected(apt); setError(null); setNotes(""); }}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Gestionar →
                    </button>
                  )}
                </div>
              </div>
              {apt.reason && (
                <div className="mt-3 bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-600">
                  <span className="font-medium">Motivo: </span>{apt.reason}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal de gestión */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-slate-900 text-lg">Gestionar cita</h2>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600">
                <i className="ti ti-x text-xl" />
              </button>
            </div>

            <div className="space-y-2 mb-5 text-sm">
              <p><span className="text-slate-500">Paciente:</span> <span className="font-medium">{selected.patient?.user?.name}</span></p>
              <p><span className="text-slate-500">Fecha:</span> {formatDate(selected.starts_at)}</p>
              <p><span className="text-slate-500">Tipo:</span> <span className="capitalize">{selected.type}</span></p>
              {selected.reason && <p><span className="text-slate-500">Motivo:</span> {selected.reason}</p>}
            </div>

            {statusValue(selected) === "confirmed" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Notas clínicas (opcional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Observaciones de la sesión..."
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            )}

            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>}

            <div className="flex gap-3">
              {statusValue(selected) === "pending" && (
                <>
                  <button
                    onClick={() => handleAction("cancel", selected)}
                    disabled={actionLoading}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
                  >
                    Cancelar cita
                  </button>
                  <button
                    onClick={() => handleAction("confirm", selected)}
                    disabled={actionLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-800 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
                  >
                    {actionLoading ? "Procesando..." : "Confirmar"}
                  </button>
                </>
              )}
              {statusValue(selected) === "confirmed" && (
                <>
                  <button
                    onClick={() => handleAction("cancel", selected)}
                    disabled={actionLoading}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleAction("complete", selected)}
                    disabled={actionLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white border-2 border-green-800 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
                  >
                    {actionLoading ? "Procesando..." : "Marcar completada"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
