import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../../api/client";

const STATUS_LABELS = {
  pending:    { label: "Pendiente",    className: "bg-amber-100 text-amber-700" },
  confirmed:  { label: "Confirmada",   className: "bg-blue-100 text-blue-700" },
  completed:  { label: "Completada",   className: "bg-green-100 text-green-700" },
  cancelled:  { label: "Cancelada",    className: "bg-red-100 text-red-700" },
  in_progress:{ label: "En curso",     className: "bg-indigo-100 text-indigo-700" },
};

const TYPE_ICONS = {
  videollamada: "ti-video",
  chat:         "ti-message",
  presencial:   "ti-building",
};

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [status, setStatus]             = useState("all");
  const [loading, setLoading]           = useState(true);
  const [cancelling, setCancelling]     = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [error, setError]               = useState(null);
  const navigate                        = useNavigate();

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(`/patient/appointments?status=${status}`);
      setAppointments(res.data.data ?? res.data);
    } catch {
      setError("Error al cargar las citas.");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const handleCancel = async (apt) => {
    setCancelling(apt);
    setError(null);
    setCancelReason("");
  };

  const confirmCancel = async () => {
    try {
      await apiClient.post(`/patient/appointments/${cancelling.id}/cancel`, { reason: cancelReason });
      setCancelling(null);
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.message || "Error al cancelar la cita.");
    }
  };

  const formatDate = (dt) => new Date(dt).toLocaleString("es-MX", {
    weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit"
  });

  const statusValue = (apt) => apt.status?.value ?? apt.status;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium text-slate-900">Mis citas</h1>
          <p className="text-slate-500 mt-1">Historial y próximas sesiones.</p>
        </div>
        <Link
          to="/terapeutas"
          className="bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-800 px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
        >
          <i className="ti ti-plus text-sm" />
          Nueva cita
        </Link>
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
          <p className="text-slate-400 mb-4">No tienes citas en este estado.</p>
          <Link to="/terapeutas" className="text-blue-600 text-sm hover:underline">
            Buscar un terapeuta →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((apt) => (
            <div key={apt.id} className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                    <i className="ti ti-stethoscope text-blue-600 text-sm" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Dr(a). {apt.doctor?.user?.name}</p>
                    <p className="text-sm text-blue-600">{apt.doctor?.specialty?.name}</p>
                    <p className="text-sm text-slate-500 mt-0.5 capitalize">{formatDate(apt.starts_at)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <i className={`ti ${TYPE_ICONS[apt.type] ?? "ti-calendar"} text-blue-400 text-xs`} />
                      <span className="text-xs text-slate-400 capitalize">{apt.type}</span>
                      <span className="text-xs text-slate-300">·</span>
                      <span className="text-xs text-slate-400">${Number(apt.price).toLocaleString("es-MX")} MXN</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_LABELS[statusValue(apt)]?.className}`}>
                    {STATUS_LABELS[statusValue(apt)]?.label}
                  </span>
                  {["pending"].includes(statusValue(apt)) && (
                    <button
                      onClick={() => navigate(`/paciente/checkout?appointment_id=${apt.id}`)}
                      className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors"
                    >
                      Pagar
                    </button>
                  )}
                  {["pending", "confirmed"].includes(statusValue(apt)) && (
                    <button
                      onClick={() => handleCancel(apt)}
                      className="text-xs text-red-500 hover:text-red-700 hover:underline"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal cancelar */}
      {cancelling && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="font-medium text-slate-900 text-lg mb-2">Cancelar cita</h2>
            <p className="text-sm text-slate-500 mb-4">
              ¿Seguro que quieres cancelar tu cita con Dr(a). {cancelling.doctor?.user?.name} el {formatDate(cancelling.starts_at)}?
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Motivo (opcional)</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={2}
                placeholder="¿Por qué cancelas esta cita?"
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setCancelling(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-medium"
              >
                Volver
              </button>
              <button
                onClick={confirmCancel}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white border-2 border-red-800 py-2.5 rounded-xl text-sm font-medium"
              >
                Confirmar cancelación
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
