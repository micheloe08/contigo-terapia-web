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
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmation"],
  });

export default function RegisterPatient() {
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
      const res = await authApi.registerPatient(data);
      setAuth(res.data.user, res.data.token);
      navigate("/paciente");
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Crear cuenta"
      subtitle="Regístrate como paciente"
      error={error}
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
        <FormField label="Nombre completo" error={errors.name}>
          <input
            {...register("name")}
            placeholder="Juan Pérez"
            className={inputClass}
          />
        </FormField>

        <FormField label="Email" error={errors.email}>
          <input
            {...register("email")}
            type="email"
            placeholder="tu@email.com"
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

        <Button
          type="submit"
          variant="cta"
          disabled={loading}
          className="w-full h-auto py-3 rounded-xl text-sm"
        >
          {loading ? "Registrando..." : "Crear cuenta"}
        </Button>
      </form>
    </AuthLayout>
  );
}
