import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "../../store/authStore";
import { authApi } from "../../api/auth";

const schema = z
  .object({
    name: z.string().min(2, "Nombre muy corto"),
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "Mínimo 8 caracteres"),
    password_confirmation: z.string(),
    phone: z.string().optional(),
    specialty_id: z.string().min(1, "Selecciona una especialidad"),
    license_number: z.string().min(1, "La cédula es obligatoria"),
    consultation_price: z.string().min(1, "El precio es obligatorio"),
    city: z.string().optional(),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmation"],
  });

const SPECIALTIES = [
  { id: "1", label: "Psicología General" },
  { id: "2", label: "Psiquiatría" },
  { id: "3", label: "Terapia de Pareja" },
  { id: "4", label: "Psicología Infantil" },
  { id: "5", label: "Terapia Cognitivo-Conductual" },
  { id: "6", label: "Ansiedad y Depresión" },
  { id: "7", label: "Adicciones" },
  { id: "8", label: "Duelo y Pérdida" },
];

export default function RegisterDoctor() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...data,
        specialty_id: parseInt(data.specialty_id),
        consultation_price: parseFloat(data.consultation_price),
        consultation_types: ["videollamada"],
      };
      const res = await authApi.registerDoctor(payload);
      setAuth(res.data.user, res.data.token);
      navigate("/doctor");
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className="ti ti-heart text-white text-2xl" />
          </div>
          <h1 className="text-2xl font-medium text-blue-900">
            Registro de Terapeuta
          </h1>
          <p className="text-blue-600 mt-1 text-sm">
            Crea tu perfil profesional
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Datos personales */}
            <div className="pb-4 border-b border-slate-100">
              <p className="text-xs text-blue-600 font-medium tracking-widest uppercase mb-4">
                Datos personales
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Nombre completo
                  </label>
                  <input
                    {...register("name")}
                    placeholder="Dr. Juan Pérez"
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Email
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="dr@email.com"
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Teléfono{" "}
                      <span className="text-slate-400">(opcional)</span>
                    </label>
                    <input
                      {...register("phone")}
                      placeholder="6671234567"
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Datos profesionales */}
            <div className="pb-4 border-b border-slate-100">
              <p className="text-xs text-blue-600 font-medium tracking-widest uppercase mb-4">
                Datos profesionales
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Especialidad
                  </label>
                  <select
                    {...register("specialty_id")}
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">Selecciona una especialidad</option>
                    {SPECIALTIES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  {errors.specialty_id && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.specialty_id.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Cédula profesional
                    </label>
                    <input
                      {...register("license_number")}
                      placeholder="CED123456"
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.license_number && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.license_number.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Precio por consulta (MXN)
                    </label>
                    <input
                      {...register("consultation_price")}
                      type="number"
                      placeholder="800"
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.consultation_price && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.consultation_price.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Ciudad <span className="text-slate-400">(opcional)</span>
                  </label>
                  <input
                    {...register("city")}
                    placeholder="Culiacán"
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <p className="text-xs text-blue-600 font-medium tracking-widest uppercase mb-4">
                Seguridad
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Contraseña
                  </label>
                  <input
                    {...register("password")}
                    type="password"
                    placeholder="••••••••"
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Confirmar contraseña
                  </label>
                  <input
                    {...register("password_confirmation")}
                    type="password"
                    placeholder="••••••••"
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.password_confirmation && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password_confirmation.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-800 py-3 rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
            >
              {loading ? "Registrando..." : "Crear perfil profesional"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              ¿Ya tienes cuenta?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:underline font-medium"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-blue-400 mt-6">
          © 2026 Contigo Terapia · Plataforma segura
        </p>
      </div>
    </div>
  );
}
