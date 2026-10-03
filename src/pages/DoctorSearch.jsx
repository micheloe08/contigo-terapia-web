import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/client";

const SORT_OPTIONS = [
  { value: "rating",     label: "Mejor valorados" },
  { value: "price_asc",  label: "Precio: menor a mayor" },
  { value: "price_desc", label: "Precio: mayor a menor" },
  { value: "experience", label: "Más experiencia" },
];

function DoctorCard({ doctor }) {
  const initials = doctor.user?.name
    ?.split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("") ?? "?";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-sm transition-all p-5 flex flex-col gap-4">
      {/* Avatar + info */}
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
          <span className="text-blue-600 font-semibold text-lg">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 truncate">
            Dr(a). {doctor.user?.name}
          </h3>
          <p className="text-sm text-blue-600 font-medium">{doctor.specialty?.name}</p>
          {doctor.city && (
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <i className="ti ti-map-pin text-xs" />
              {doctor.city}
            </p>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-lg font-semibold text-slate-900">
            ${Number(doctor.consultation_price).toLocaleString("es-MX")}
          </p>
          <p className="text-xs text-slate-400">MXN / sesión</p>
        </div>
      </div>

      {/* Rating + experiencia */}
      <div className="flex items-center gap-4 text-sm">
        <span className="flex items-center gap-1 text-amber-500 font-medium">
          <i className="ti ti-star-filled text-xs" />
          {Number(doctor.rating).toFixed(1)}
          <span className="text-slate-400 font-normal">({doctor.total_reviews})</span>
        </span>
        {doctor.experience_years > 0 && (
          <span className="text-slate-500">
            {doctor.experience_years} año{doctor.experience_years !== 1 ? "s" : ""} de exp.
          </span>
        )}
      </div>

      {/* Bio */}
      {doctor.bio && (
        <p className="text-sm text-slate-500 line-clamp-2">{doctor.bio}</p>
      )}

      {/* Enfoques */}
      {doctor.therapeutic_approaches?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {doctor.therapeutic_approaches.slice(0, 3).map((a) => (
            <span key={a.id} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full">
              {a.name}
            </span>
          ))}
          {doctor.therapeutic_approaches.length > 3 && (
            <span className="text-xs text-slate-400">
              +{doctor.therapeutic_approaches.length - 3} más
            </span>
          )}
        </div>
      )}

      {/* Modalidades */}
      {doctor.therapy_modalities?.length > 0 && (
        <div className="flex gap-2">
          {doctor.therapy_modalities.map((m) => (
            <span key={m.id} className="text-xs text-slate-500 flex items-center gap-1">
              {m.icon && <i className={`ti ${m.icon} text-blue-400`} />}
              {m.name}
            </span>
          ))}
        </div>
      )}

      {/* CTA */}
      <Link
        to={`/terapeutas/${doctor.id}`}
        className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-800 py-2.5 rounded-xl text-sm font-medium transition-colors mt-auto"
      >
        Ver perfil y agendar
      </Link>
    </div>
  );
}

export default function DoctorSearch() {
  const [doctors, setDoctors]       = useState([]);
  const [filters, setFilters]       = useState({ specialties: [], cities: [] });
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [meta, setMeta]             = useState({ current_page: 1, last_page: 1, total: 0 });
  const [showFilters, setShowFilters] = useState(false);

  const [params, setParams] = useState({
    search:        "",
    specialty_id:  "",
    city:          "",
    min_price:     "",
    max_price:     "",
    approach_id:   "",
    modality_id:   "",
    population_id: "",
    sort_by:       "rating",
    page:          1,
  });

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== "" && v !== null)
      );
      const res = await apiClient.get("/doctors", { params: cleanParams });
      setDoctors(res.data.data);
      setMeta({ current_page: res.data.current_page, last_page: res.data.last_page, total: res.data.total });
    } catch {
      setError("Error al cargar los terapeutas.");
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetchDoctors(); }, [fetchDoctors]);

  useEffect(() => {
    apiClient.get("/doctors/filters")
      .then((res) => setFilters(res.data))
      .catch(() => {});
  }, []);

  const setParam = (key, value) => setParams((p) => ({ ...p, [key]: value, page: 1 }));
  const clearFilters = () => setParams((p) => ({ ...p, specialty_id: "", city: "", min_price: "", max_price: "", approach_id: "", modality_id: "", population_id: "", page: 1 }));

  const hasActiveFilters = ["specialty_id", "city", "min_price", "max_price", "approach_id", "modality_id", "population_id"]
    .some((k) => params[k] !== "");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="shrink-0">
              <img src="/logo-negro.png" alt="Contigo Terapia" className="h-8 w-auto" />
            </Link>
            <div className="flex-1 relative">
              <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={params.search}
                onChange={(e) => setParam("search", e.target.value)}
                placeholder="Buscar terapeuta por nombre..."
                className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                hasActiveFilters
                  ? "bg-blue-600 text-white border-blue-800"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <i className="ti ti-adjustments-horizontal" />
              <span className="hidden sm:inline">Filtros</span>
              {hasActiveFilters && <span className="bg-white/30 text-white text-xs px-1.5 py-0.5 rounded-full">ON</span>}
            </button>
            <select
              value={params.sort_by}
              onChange={(e) => setParam("sort_by", e.target.value)}
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white hidden sm:block"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Panel de filtros */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              <select
                value={params.specialty_id}
                onChange={(e) => setParam("specialty_id", e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Especialidad</option>
                {filters.specialties.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>

              <select
                value={params.city}
                onChange={(e) => setParam("city", e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Ciudad</option>
                {filters.cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <div className="flex gap-2">
                <input
                  type="number"
                  value={params.min_price}
                  onChange={(e) => setParam("min_price", e.target.value)}
                  placeholder="Precio mín."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  value={params.max_price}
                  onChange={(e) => setParam("max_price", e.target.value)}
                  placeholder="Precio máx."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                  <i className="ti ti-x text-xs" /> Limpiar filtros
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Resultados */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-500">
            {loading ? "Buscando..." : `${meta.total} terapeuta${meta.total !== 1 ? "s" : ""} encontrado${meta.total !== 1 ? "s" : ""}`}
          </p>
          <select
            value={params.sort_by}
            onChange={(e) => setParam("sort_by", e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white sm:hidden"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 h-64 animate-pulse">
                <div className="flex gap-4 mb-4">
                  <div className="w-14 h-14 bg-slate-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-slate-200 rounded" />
                  <div className="h-3 bg-slate-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <i className="ti ti-search-off text-5xl text-slate-300 block mb-4" />
            <h3 className="text-lg font-medium text-slate-700 mb-2">Sin resultados</h3>
            <p className="text-slate-400 mb-4">No encontramos terapeutas con esos filtros.</p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-blue-600 text-sm hover:underline">
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>

            {/* Paginación */}
            {meta.last_page > 1 && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setParam("page", params.page - 1)}
                  disabled={params.page === 1}
                  className="px-4 py-2 rounded-xl text-sm border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ← Anterior
                </button>
                <span className="px-4 py-2 text-sm text-slate-500">
                  Página {meta.current_page} de {meta.last_page}
                </span>
                <button
                  onClick={() => setParam("page", params.page + 1)}
                  disabled={params.page === meta.last_page}
                  className="px-4 py-2 rounded-xl text-sm border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
