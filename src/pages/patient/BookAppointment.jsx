import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../api/client";

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const MODALITIES = [
  { value: "videollamada", label: "Videollamada", icon: "ti-video" },
  { value: "presencial",   label: "Presencial",   icon: "ti-building" },
  { value: "chat",         label: "Chat",         icon: "ti-message" },
];

function getNextDateForDayOfWeek(dayOfWeek) {
  // dayOfWeek: 1=Mon ... 7=Sun (API uses 1-based week starting Monday)
  const today = new Date();
  const todayDay = today.getDay() === 0 ? 7 : today.getDay(); // 1=Mon...7=Sun
  let diff = dayOfWeek - todayDay;
  if (diff < 0) diff += 7;
  if (diff === 0) diff = 7; // never pick today, always at least tomorrow
  const date = new Date(today);
  date.setDate(today.getDate() + diff);
  return date;
}

function buildSlotOptions(availability, sessionDuration) {
  const options = [];
  availability.forEach((day) => {
    const date = getNextDateForDayOfWeek(day.day);
    const dateLabel = date.toLocaleDateString("es-MX", {
      weekday: "long", day: "numeric", month: "long",
    });
    day.slots.forEach((slot) => {
      // Generate slots every `sessionDuration` minutes within the block
      const [startH, startM] = slot.start_time.split(":").map(Number);
      const [endH, endM]     = slot.end_time.split(":").map(Number);
      const blockStart = startH * 60 + startM;
      const blockEnd   = endH * 60 + endM;
      const duration   = sessionDuration || 60;
      for (let t = blockStart; t + duration <= blockEnd; t += duration) {
        const h = Math.floor(t / 60).toString().padStart(2, "0");
        const m = (t % 60).toString().padStart(2, "0");
        const timeLabel = `${h}:${m}`;
        // Build ISO datetime
        const dt = new Date(date);
        dt.setHours(Math.floor(t / 60), t % 60, 0, 0);
        options.push({
          key:       `${day.day}-${slot.id}-${t}`,
          dateLabel,
          timeLabel,
          datetime:  dt.toISOString(),
          dayName:   DAYS[day.day - 1] ?? day.day_name,
        });
      }
    });
  });
  return options;
}

export default function BookAppointment() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const [doctor, setDoctor]         = useState(null);
  const [slots, setSlots]           = useState([]);
  const [selected, setSelected]     = useState(null);
  const [modality, setModality]     = useState("videollamada");
  const [reason, setReason]         = useState("");
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState(null);

  useEffect(() => {
    Promise.all([
      apiClient.get(`/doctors/${id}`),
      apiClient.get(`/doctors/${id}/availability`),
    ])
      .then(([docRes, avRes]) => {
        setDoctor(docRes.data);
        const built = buildSlotOptions(avRes.data.availability ?? [], avRes.data.session_duration ?? 60);
        setSlots(built);
      })
      .catch(() => setError("No se pudo cargar la disponibilidad del terapeuta."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await apiClient.post("/patient/appointments", {
        doctor_id: Number(id),
        starts_at: selected.datetime,
        type:      modality,
        reason:    reason || undefined,
      });
      const appointmentId = res.data?.appointment?.id ?? res.data?.id;
      navigate(`/paciente/checkout?appointment_id=${appointmentId}`);
    } catch (err) {
      setError(err.response?.data?.message || "No se pudo agendar la cita. Intenta de nuevo.");
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 text-sm">Cargando disponibilidad...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <img src="/logo-negro.png" alt="Contigo Terapia" className="h-8 w-auto" />
          <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1">
            <i className="ti ti-arrow-left text-sm" /> Volver
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-medium text-slate-900">Agendar sesión</h1>
          {doctor && (
            <p className="text-slate-500 mt-1">
              con Dr(a). {doctor.user?.name} · <span className="text-blue-600">{doctor.specialty?.name}</span>
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Modalidad */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="font-medium text-slate-900 mb-3">Modalidad de consulta</h2>
            <div className="grid grid-cols-3 gap-3">
              {MODALITIES.map((m) => (
                <button
                  type="button"
                  key={m.value}
                  onClick={() => setModality(m.value)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-colors text-sm font-medium ${
                    modality === m.value
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 text-slate-600 hover:border-blue-200"
                  }`}
                >
                  <i className={`ti ${m.icon} text-xl`} />
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Selección de horario */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="font-medium text-slate-900 mb-3">Elige un horario</h2>
            {slots.length === 0 ? (
              <div className="text-center py-8">
                <i className="ti ti-calendar-off text-slate-300 text-4xl mb-3 block" />
                <p className="text-slate-400 text-sm">Este terapeuta no tiene horarios disponibles por el momento.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {Object.entries(
                  slots.reduce((acc, s) => {
                    const key = s.dateLabel;
                    if (!acc[key]) acc[key] = [];
                    acc[key].push(s);
                    return acc;
                  }, {})
                ).map(([dateLabel, daySlots]) => (
                  <div key={dateLabel}>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 capitalize">{dateLabel}</p>
                    <div className="flex flex-wrap gap-2">
                      {daySlots.map((s) => (
                        <button
                          type="button"
                          key={s.key}
                          onClick={() => setSelected(s)}
                          className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                            selected?.key === s.key
                              ? "bg-blue-600 border-blue-600 text-white"
                              : "border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                          }`}
                        >
                          {s.timeLabel}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Motivo opcional */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="font-medium text-slate-900 mb-1">Motivo de consulta <span className="text-slate-400 font-normal text-sm">(opcional)</span></h2>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Describe brevemente el motivo de tu consulta..."
              className="w-full mt-2 text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none text-slate-700 placeholder-slate-400"
            />
          </div>

          {/* Resumen y confirmar */}
          {selected && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-slate-700">
              <p className="font-medium mb-1">Resumen de tu cita</p>
              <p>📅 {selected.dateLabel} · {selected.timeLabel}</p>
              <p>💻 {MODALITIES.find((m) => m.value === modality)?.label}</p>
              {doctor && <p>💰 ${Number(doctor.consultation_price).toLocaleString("es-MX")} MXN</p>}
            </div>
          )}

          <button
            type="submit"
            disabled={!selected || submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-xl text-sm transition-colors"
          >
            {submitting ? "Agendando..." : "Continuar al pago"}
          </button>
        </form>
      </div>
    </div>
  );
}
