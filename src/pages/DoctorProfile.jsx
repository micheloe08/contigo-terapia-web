import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import { useAuthStore } from "../store/authStore";

function InfoBadge({ icon, text }) {
  return (
    <span className="flex items-center gap-1.5 text-sm text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
      <i className={`ti ${icon} text-blue-500 text-sm`} />
      {text}
    </span>
  );
}

function TagList({ items, color = "blue" }) {
  if (!items?.length) return null;
  const colors = {
    blue:   "bg-blue-50 text-blue-700",
    indigo: "bg-indigo-50 text-indigo-700",
  };
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item.id} className={`text-xs font-medium px-3 py-1 rounded-full ${colors[color]}`}>
          {item.name}
        </span>
      ))}
    </div>
  );
}

export default function DoctorProfile() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { user }   = useAuthStore();
  const [doctor, setDoctor]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    setLoading(true);
    apiClient.get(`/doctors/${id}`)
      .then((res) => setDoctor(res.data))
      .catch((err) => {
        setError(err.response?.status === 404
          ? "Este terapeuta no está disponible."
          : "Error al cargar el perfil.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const initials = doctor?.user?.name
    ?.split(" ").slice(0, 2).map((n) => n[0]).join("") ?? "?";

  const handleAgendar = () => {
    if (!user) navigate("/registro/paciente");
    else if (user.role === "patient") navigate(`/paciente/agendar/${id}`);
    else navigate("/login");
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 text-sm">Cargando perfil...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center">
        <i className="ti ti-user-off text-5xl text-slate-300 block mb-4" />
        <h2 className="text-lg font-medium text-slate-700 mb-2">{error}</h2>
        <Link to="/terapeutas" className="text-blue-600 text-sm hover:underline">← Volver a la búsqueda</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/"><img src="/logo-negro.png" alt="Contigo Terapia" className="h-8 w-auto" /></Link>
          <Link to="/terapeutas" className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1">
            <i className="ti ti-arrow-left text-sm" /> Volver a búsqueda
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Card principal */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex flex-col items-center sm:items-start gap-3 shrink-0">
              <div className="w-24 h-24 bg-blue-100 rounded-2xl flex items-center justify-center">
                <span className="text-blue-600 font-bold text-3xl">{initials}</span>
              </div>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((s) => (
                  <i key={s} className={`ti ti-star${Number(doctor.rating) >= s ? '-filled text-amber-400' : ' text-slate-200'} text-sm`} />
                ))}
                <span className="text-sm text-slate-500 ml-1">
                  {Number(doctor.rating).toFixed(1)} ({doctor.total_reviews} reseñas)
                </span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-semibold text-slate-900">Dr(a). {doctor.user?.name}</h1>
                  <p className="text-blue-600 font-medium mt-0.5">{doctor.specialty?.name}</p>
                  {doctor.city && (
                    <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                      <i className="ti ti-map-pin text-xs" />
                      {doctor.city}{doctor.state ? `, ${doctor.state}` : ""}
                    </p>
                  )}
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <p className="text-3xl font-bold text-slate-900">
                    ${Number(doctor.consultation_price).toLocaleString("es-MX")}
                  </p>
                  <p className="text-sm text-slate-400">MXN por sesión</p>
                  <p className="text-xs text-slate-400 mt-0.5">{doctor.session_duration} minutos</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {doctor.experience_years > 0 && (
                  <InfoBadge icon="ti-briefcase" text={`${doctor.experience_years} años de experiencia`} />
                )}
                {doctor.license_number && (
                  <InfoBadge icon="ti-certificate" text={`Cédula: ${doctor.license_number}`} />
                )}
                {doctor.languages && (
                  <InfoBadge icon="ti-language" text={doctor.languages} />
                )}
              </div>

              {doctor.therapy_modalities?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {doctor.therapy_modalities.map((m) => (
                    <span key={m.id} className="flex items-center gap-1.5 text-xs text-slate-600 border border-slate-200 px-2.5 py-1 rounded-full">
                      {m.icon && <i className={`ti ${m.icon} text-blue-500`} />}
                      {m.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <button
              onClick={handleAgendar}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-800 px-8 py-3 rounded-xl text-sm font-medium transition-colors"
            >
              {user?.role === "patient" ? "Agendar sesión" : "Registrarme para agendar"}
            </button>
            {!user && (
              <p className="text-xs text-slate-400 mt-2">
                ¿Ya tienes cuenta?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">Inicia sesión</Link>
              </p>
            )}
          </div>
        </div>

        {/* Bio */}
        {doctor.bio && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-3">Sobre el terapeuta</h2>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{doctor.bio}</p>
          </div>
        )}

        {/* Formación */}
        {doctor.education && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <i className="ti ti-school text-blue-500" /> Formación académica
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{doctor.education}</p>
          </div>
        )}

        {/* Enfoques y poblaciones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {doctor.therapeutic_approaches?.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <i className="ti ti-brain text-blue-500" /> Enfoques terapéuticos
              </h2>
              <TagList items={doctor.therapeutic_approaches} color="blue" />
            </div>
          )}
          {doctor.target_populations?.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <i className="ti ti-users text-indigo-500" /> Poblaciones que atiende
              </h2>
              <TagList items={doctor.target_populations} color="indigo" />
            </div>
          )}
        </div>

        {/* CTA final */}
        <div className="bg-blue-600 rounded-2xl p-6 sm:p-8 text-center">
          <h2 className="text-xl font-semibold text-white mb-2">¿Listo para tu primera sesión?</h2>
          <p className="text-blue-100 text-sm mb-5">
            Agenda con Dr(a). {doctor.user?.name?.split(" ")[0]} hoy mismo.
          </p>
          <button
            onClick={handleAgendar}
            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-xl text-sm transition-colors"
          >
            {user?.role === "patient" ? "Agendar sesión" : "Crear cuenta y agendar"}
          </button>
        </div>
      </div>
    </div>
  );
}
