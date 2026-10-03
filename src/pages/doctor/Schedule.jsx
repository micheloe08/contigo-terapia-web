import { useState, useEffect } from "react";
import apiClient from "../../api/client";

const DAYS = [
  { value: 0, label: "Lunes" },
  { value: 1, label: "Martes" },
  { value: 2, label: "Miércoles" },
  { value: 3, label: "Jueves" },
  { value: 4, label: "Viernes" },
  { value: 5, label: "Sábado" },
  { value: 6, label: "Domingo" },
];

// Genera opciones de hora en intervalos de 30 min
const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2).toString().padStart(2, "0");
  const m = i % 2 === 0 ? "00" : "30";
  return `${h}:${m}`;
});

function SlotRow({ slot, onRemove, onChange }) {
  return (
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
      <select
        value={slot.start_time}
        onChange={(e) => onChange({ ...slot, start_time: e.target.value })}
        className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
      <span className="text-slate-400 text-sm">hasta</span>
      <select
        value={slot.end_time}
        onChange={(e) => onChange({ ...slot, end_time: e.target.value })}
        className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
      <button
        onClick={onRemove}
        className="ml-auto text-slate-400 hover:text-red-500 transition-colors"
      >
        <i className="ti ti-trash text-base" />
      </button>
    </div>
  );
}

export default function DoctorSchedule() {
  // schedulesByDay: { [day]: [{ start_time, end_time }] }
  const [schedulesByDay, setSchedulesByDay] = useState(
    Object.fromEntries(DAYS.map((d) => [d.value, []]))
  );
  const [activeDays, setActiveDays] = useState(new Set());
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [success, setSuccess]       = useState(false);
  const [error, setError]           = useState(null);

  // Carga horarios existentes
  useEffect(() => {
    apiClient.get("/doctor/schedules")
      .then((res) => {
        const byDay = Object.fromEntries(DAYS.map((d) => [d.value, []]));
        const active = new Set();
        res.data.forEach((s) => {
          byDay[s.day_of_week].push({ start_time: s.start_time.slice(0, 5), end_time: s.end_time.slice(0, 5) });
          active.add(s.day_of_week);
        });
        setSchedulesByDay(byDay);
        setActiveDays(active);
      })
      .catch(() => setError("Error al cargar los horarios."))
      .finally(() => setLoading(false));
  }, []);

  const toggleDay = (day) => {
    setActiveDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) {
        next.delete(day);
        setSchedulesByDay((s) => ({ ...s, [day]: [] }));
      } else {
        next.add(day);
        // Slot por defecto al activar el día
        setSchedulesByDay((s) => ({
          ...s,
          [day]: s[day].length ? s[day] : [{ start_time: "09:00", end_time: "18:00" }],
        }));
      }
      return next;
    });
  };

  const addSlot = (day) => {
    setSchedulesByDay((s) => ({
      ...s,
      [day]: [...s[day], { start_time: "09:00", end_time: "10:00" }],
    }));
  };

  const removeSlot = (day, index) => {
    setSchedulesByDay((s) => {
      const slots = s[day].filter((_, i) => i !== index);
      if (!slots.length) {
        setActiveDays((prev) => { const n = new Set(prev); n.delete(day); return n; });
      }
      return { ...s, [day]: slots };
    });
  };

  const updateSlot = (day, index, slot) => {
    setSchedulesByDay((s) => {
      const slots = [...s[day]];
      slots[index] = slot;
      return { ...s, [day]: slots };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    // Construye el array de schedules
    const schedules = [];
    for (const [day, slots] of Object.entries(schedulesByDay)) {
      if (!activeDays.has(Number(day))) continue;
      for (const slot of slots) {
        if (slot.start_time >= slot.end_time) {
          setError(`El horario de fin debe ser mayor al de inicio (${DAYS.find(d => d.value === Number(day))?.label}).`);
          setSaving(false);
          return;
        }
        schedules.push({ day_of_week: Number(day), ...slot, is_available: true });
      }
    }

    try {
      await apiClient.post("/doctor/schedules", { schedules });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar los horarios.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-slate-900">Configurar horarios</h1>
        <p className="text-slate-500 mt-1">
          Define los días y horarios en que atiendes pacientes. Puedes agregar múltiples bloques por día.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 text-sm flex items-center gap-2">
          <i className="ti ti-circle-check text-base" /> Horarios guardados correctamente.
        </div>
      )}

      {/* Días de la semana */}
      <div className="space-y-3 mb-8">
        {DAYS.map(({ value, label }) => {
          const isActive = activeDays.has(value);
          const slots    = schedulesByDay[value] ?? [];

          return (
            <div key={value} className={`bg-white rounded-2xl border transition-colors ${isActive ? "border-blue-200" : "border-slate-200"}`}>
              {/* Header del día */}
              <div
                className="flex items-center justify-between px-5 py-4 cursor-pointer"
                onClick={() => toggleDay(value)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    isActive ? "bg-blue-600 border-blue-600" : "border-slate-300"
                  }`}>
                    {isActive && <i className="ti ti-check text-white text-xs" />}
                  </div>
                  <span className={`font-medium text-sm ${isActive ? "text-slate-900" : "text-slate-400"}`}>
                    {label}
                  </span>
                </div>
                {isActive && slots.length > 0 && (
                  <span className="text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                    {slots.length} bloque{slots.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* Slots del día */}
              {isActive && (
                <div className="px-5 pb-4 space-y-2 border-t border-slate-100 pt-3">
                  {slots.map((slot, i) => (
                    <SlotRow
                      key={i}
                      slot={slot}
                      onChange={(updated) => updateSlot(value, i, updated)}
                      onRemove={() => removeSlot(value, i)}
                    />
                  ))}
                  <button
                    onClick={() => addSlot(value)}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mt-2"
                  >
                    <i className="ti ti-plus text-sm" />
                    Agregar bloque de horario
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Botón guardar */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-800 px-8 py-3 rounded-xl text-sm font-medium transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <i className="ti ti-device-floppy text-base" />
              Guardar horarios
            </>
          )}
        </button>
      </div>
    </main>
  );
}
