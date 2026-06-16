import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '../../store/authStore'
import { authApi } from '../../api/auth'
import { Button } from '../../components/ui/button'

const schema = z.object({
  name:                  z.string().min(2, 'Nombre muy corto'),
  email:                 z.string().email('Email inválido'),
  password:              z.string().min(8, 'Mínimo 8 caracteres'),
  password_confirmation: z.string(),
  phone:                 z.string().optional(),
}).refine(d => d.password === d.password_confirmation, {
  message: 'Las contraseñas no coinciden',
  path: ['password_confirmation'],
})

export default function RegisterPatient() {
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
      const res = await authApi.registerPatient(data)
      setAuth(res.data.user, res.data.token)
      navigate('/paciente')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Crear cuenta</h1>
          <p className="text-slate-500 mt-1">Regístrate como paciente</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre completo</label>
            <input {...register('name')} placeholder="Juan Pérez"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input {...register('email')} type="email" placeholder="tu@email.com"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono (opcional)</label>
            <input {...register('phone')} placeholder="6671234567"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
            <input {...register('password')} type="password" placeholder="••••••••"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirmar contraseña</label>
            <input {...register('password_confirmation')} type="password" placeholder="••••••••"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">Inicia sesión</Link>
        </div>
      </div>
    </div>
  )
}