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

const schema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

export default function Login() {
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
      const res = await authApi.loginApi(data);
      setAuth(res.data.user, res.data.token);
      navigate(res.data.user.role === "doctor" ? "/doctor" : "/paciente");
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Contigo Terapia"
      subtitle="Inicia sesión en tu cuenta"
      error={error}
      footer={
        <>
          <p className="text-sm text-slate-500">
            ¿No tienes cuenta?{" "}
            <Link
              to="/registro/paciente"
              className="text-blue-600 hover:underline font-medium"
            >
              Regístrate como paciente
            </Link>
          </p>
          <p className="text-sm text-slate-500">
            ¿Eres terapeuta?{" "}
            <Link
              to="/registro/doctor"
              className="text-blue-600 hover:underline font-medium"
            >
              Regístrate aquí
            </Link>
          </p>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormField label="Email" error={errors.email}>
          <input
            {...register("email")}
            type="email"
            placeholder="tu@email.com"
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

        <Button
          type="submit"
          variant="cta"
          disabled={loading}
          className="w-full h-auto py-3 rounded-xl text-sm"
        >
          {loading ? "Iniciando sesión..." : "Iniciar sesión"}
        </Button>
      </form>
    </AuthLayout>
  );
}
