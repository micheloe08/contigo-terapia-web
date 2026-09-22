import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "../../store/authStore";
import { authApi } from "../../api/auth";
import AuthLayout from "../../components/auth/AuthLayout";
import FormField, { inputClass } from "../../components/auth/FormField";
import { Button } from "../../components/ui/button";

const schema = z
  .object({
    name: z.string().min(2, "Nombre muy corto"),
    email: z.email("Email inválido"),
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

function SectionTitle({ children }) {
  return (
    <p className="text-xs text-blue-600 font-medium tracking-widest uppercase mb-4">
      {children}
    </p>
  );
}

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
    <AuthLayout
      subtitle="Crea tu perfil profesional"
      error={error}
      wide
      footer={
        <p className="text-sm text-slate-500">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Inicia sesión
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Datos personales */}
        <div className="pb-4 border-b border-slate-100">
          <SectionTitle>Datos personales</SectionTitle>
          <div className="space-y-4">
            <FormField label="Nombre completo" error={errors.name}>
              <input
                {...register("name")}
                placeholder="Dr. Juan Pérez"
                className={inputClass}
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Email" error={errors.email}>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="dr@email.com"
                  className={inputClass}
                />
              </FormField>
              <FormField label="Teléfono" optional>
                <input
                  {...register("phone")}
                  placeholder="6671234567"
                  className={inputClass}
                />
              </FormField>
            </div>
          </div>
        </div>

        {/* Datos profesionales */}
        <div className="pb-4 border-b border-slate-100">
          <SectionTitle>Datos profesionales</SectionTitle>
          <div className="space-y-4">
            <FormField label="Especialidad" error={errors.specialty_id}>
              <select
                {...register("specialty_id")}
                className={`${inputClass} bg-white`}
              >
                <option value="">Selecciona una especialidad</option>
                {SPECIALTIES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Cédula profesional" error={errors.license_number}>
                <input
                  {...register("license_number")}
                  placeholder="CED123456"
                  className={inputClass}
                />
              </FormField>
              <FormField
                label="Precio por consulta (MXN)"
                error={errors.consultation_price}
              >
                <input
                  {...register("consultation_price")}
                  type="number"
                  placeholder="800"
                  className={inputClass}
                />
              </FormField>
            </div>

            <FormField label="Ciudad" optional>
              <input
                {...register("city")}
                placeholder="Culiacán"
                className={inputClass}
              />
            </FormField>
          </div>
        </div>

        {/* Contraseña */}
        <div>
          <SectionTitle>Seguridad</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Contraseña" error={errors.password}>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className={inputClass}
              />
            </FormField>
            <FormField
              label="Confirmar contraseña"
              error={errors.password_confirmation}
            >
              <input
                {...register("password_confirmation")}
                type="password"
                placeholder="••••••••"
                className={inputClass}
              />
            </FormField>
          </div>
        </div>

        <Button
          type="submit"
          variant="cta"
          disabled={loading}
          className="w-full h-auto py-3 rounded-xl text-sm"
        >
          {loading ? "Registrando..." : "Crear perfil profesional"}
        </Button>
      </form>
    </AuthLayout>
  );
}
