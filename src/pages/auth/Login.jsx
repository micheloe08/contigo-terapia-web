import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '../../store/authStore'
import { authApi } from '../../api/auth'
import { Button } from '../../components/ui/button'

const schema = z.object({
  email:    z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
})

export default function Login() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    setLoading(true)
    setError(null)
    try {
      const res = await authApi.loginApi(data)
      setAuth(res.data.user, res.data.token)
      navigate(res.data.user.role === 'doctor' ? '/doctor' : '/paciente')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Contigo Terapia</h1>
          <p className="text-slate-500 mt-1">Inicia sesión en tu cuenta</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              placeholder="tu@email.com"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Contraseña
            </label>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center text-sm text-slate-500">
          ¿No tienes cuenta?{' '}
          <Link to="/registro/paciente" className="text-blue-600 hover:underline">
            Regístrate como paciente
          </Link>
        </div>
        <div className="mt-2 text-center text-sm text-slate-500">
          ¿Eres terapeuta?{' '}
          <Link to="/registro/doctor" className="text-blue-600 hover:underline">
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  )
}