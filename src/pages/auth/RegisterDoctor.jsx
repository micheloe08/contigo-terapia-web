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
  specialty_id:          z.string().min(1, 'Selecciona una especialidad'),
  license_number:        z.string().min(1, 'La cédula es obligatoria'),
  consultation_price:    z.string().min(1, 'El precio es obligatorio'),
  city:                  z.string().optional(),
}).refine(d => d.password === d.password_confirmation, {
  message: 'Las contraseñas no coinciden',
  path: ['password_confirmation'],
})

export default function RegisterDoctor() {
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
      const payload = {
        ...data,
        specialty_id: parseInt(data.specialty_id),
        consultation_price: parseFloat(data.consultation_price),
        consultation_types: ['videollamada'],
      }
      const res = await authApi.registerDoctor(payload)
      setAuth(res.data.user, res.data.token)
      navigate('/doctor')
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
          <h1 className="text-2xl font-bold text-slate-900">Registro de Terapeuta</h1>
          <p className="text-slate-500 mt-1">Crea tu perfil profesional</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre completo</label>
            <input {...register('name')} placeholder="Dr. Juan Pérez"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input {...register('email')} type="email" placeholder="dr@email.com"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Especialidad</label>
            <select {...register('specialty_id')}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Selecciona una especialidad</option>
              <option value="1">Psicología General</option>
              <option value="2">Psiquiatría</option>
              <option value="3">Terapia de Pareja</option>
              <option value="4">Psicología Infantil</option>
              <option value="5">Terapia Cognitivo-Conductual</option>
              <option value="6">Ansiedad y Depresión</option>
              <option value="7">Adicciones</option>
              <option value="8">Duelo y Pérdida</option>
            </select>
            {errors.specialty_id && <p className="text-red-500 text-xs mt-1">{errors.specialty_id.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Cédula profesional</label>
            <input {...register('license_number')} placeholder="CED123456"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.license_number && <p className="text-red-500 text-xs mt-1">{errors.license_number.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Precio por consulta (MXN)</label>
            <input {...register('consultation_price')} type="number" placeholder="800"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.consultation_price && <p className="text-red-500 text-xs mt-1">{errors.consultation_price.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Ciudad</label>
            <input {...register('city')} placeholder="Culiacán"
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
            {loading ? 'Registrando...' : 'Crear perfil profesional'}
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