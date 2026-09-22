import { useState, useEffect, useCallback } from "react";
import apiClient from "../../api/client";

const STATUS_LABELS = {
  pending:  { label: "Pendiente",  className: "bg-amber-100 text-amber-700" },
  approved: { label: "Aprobado",   className: "bg-green-100 text-green-700" },
  rejected: { label: "Rechazado",  className: "bg-red-100 text-red-700" },
};

export default function DoctorApproval() {
  const [doctors, setDoctors]       = useState([]);
  const [status, setStatus]         = useState("pending");
  const [loading, setLoading]       = useState(true);
  const [selected, setSelected]     = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError]           = useState(null);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(`/supervisor/doctors?status=${status}`);
      setDoctors(res.data.data ?? res.data);
    } catch {
      setError("Error al cargar los terapeutas.");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => { fetchDoctors(); }, [fetchDoctors]);

  const handleApprove = async (doctor) => {
    setActionLoading(true);
    try {
      await apiClient.post(`/supervisor/doctors/${doctor.id}/approve`);
      fetchDoctors();
      setSelected(null);
    } catch {
      setError("Error al aprobar el terapeuta.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (doctor) => {
    if (!rejectReason.trim() || rejectReason.trim().length < 10) {
      setError("El motivo de rechazo debe tener al menos 10 caracteres.");
      return;
    }
    setActionLoading(true);
    try {
      await apiClient.post(`/supervisor/doctors/${doctor.id}/reject`, { reason: rejectReason });
      fetchDoctors();
      setSelected(null);
      setRejectReason("");
    } catch {
      setError("Error al rechazar el terapeuta.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-slate-900">Aprobación de terapeutas</h1>
        <p className="text-slate-500 mt-1">Revisa y gestiona las solicitudes de registro de terapeutas.</p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-6">
        {["pending", "approved", "rejected", "all"].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              status === s
                ? "bg-blue-600 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {{ pending: "Pendientes", approved: "Aprobados", rejected: "Rechazados", all: "Todos" }[s]}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Lista */}
      {loading ? (
        <div className="text-center py-16 text-slate-400">Cargando...</div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <i className="ti ti-users text-4xl text-slate-300 block mb-3" />
          <p className="text-slate-400">No hay terapeutas en este estado.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-blue-600 font-semibold text-sm">
                      {doctor.user?.name?.charAt(0) ?? "?"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{doctor.user?.name}</p>
                    <p className="text-sm text-slate-500">{doctor.user?.email}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {doctor.specialty?.name ?? "Sin especialidad"} · Cédula: {doctor.license_number}
                    </p>
                    {doctor.city && (
                      <p className="text-xs text-slate-400">{doctor.city}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_LABELS[doctor.status]?.className}`}>
                    {STATUS_LABELS[doctor.status]?.label}
                  </span>
                  {doctor.status === "pending" && (
                    <button
                      onClick={() => { setSelected(doctor); setError(null); setRejectReason(""); }}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Revisar →
                    </button>
                  )}
                </div>
              </div>
              {doctor.status === "rejected" && doctor.rejection_reason && (
                <div className="mt-3 bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-sm text-red-600">
                  <span className="font-medium">Motivo: </span>{doctor.rejection_reason}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal de revisión */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-slate-900 text-lg">Revisar terapeuta</h2>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600">
                <i className="ti ti-x text-xl" />
              </button>
            </div>

            <div className="space-y-2 mb-5">
              <p><span className="text-slate-500 text-sm">Nombre:</span> <span className="font-medium">{selected.user?.name}</span></p>
              <p><span className="text-slate-500 text-sm">Email:</span> {selected.user?.email}</p>
              <p><span className="text-slate-500 text-sm">Especialidad:</span> {selected.specialty?.name}</p>
              <p><span className="text-slate-500 text-sm">Cédula:</span> {selected.license_number}</p>
              <p><span className="text-slate-500 text-sm">Precio consulta:</span> ${selected.consultation_price} MXN</p>
              {selected.city && <p><span className="text-slate-500 text-sm">Ciudad:</span> {selected.city}</p>}
            </div>

            {/* Motivo de rechazo */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Motivo de rechazo <span className="text-slate-400">(requerido si rechazas)</span>
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                placeholder="Describe el motivo por el que no se aprueba el registro..."
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => handleReject(selected)}
                disabled={actionLoading}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
              >
                {actionLoading ? "Procesando..." : "Rechazar"}
              </button>
              <button
                onClick={() => handleApprove(selected)}
                disabled={actionLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-800 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
              >
                {actionLoading ? "Procesando..." : "Aprobar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
