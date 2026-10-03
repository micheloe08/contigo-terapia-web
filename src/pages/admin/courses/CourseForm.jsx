import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import apiClient from '../../../api/client'

export default function CourseForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const fileRef = useRef(null)

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '0',
    is_published: false,
  })
  const [thumbnailFile, setThumbnailFile] = useState(null)

  useEffect(() => {
    if (!isEdit) return
    apiClient.get(`/admin/courses/${id}`)
      .then(res => {
        const c = res.data
        setForm({
          title: c.title ?? '',
          description: c.description ?? '',
          price: c.price ?? '0',
          is_published: Boolean(c.is_published),
        })
        if (c.thumbnail) setThumbnailPreview(c.thumbnail)
      })
      .catch(() => setError('Error al cargar el curso.'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setThumbnailFile(file)
    setThumbnailPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('El título es requerido.'); return }
    setSaving(true)
    setError(null)

    const data = new FormData()
    data.append('title', form.title)
    data.append('description', form.description)
    data.append('price', form.price)
    data.append('is_published', form.is_published ? '1' : '0')
    if (thumbnailFile) data.append('thumbnail', thumbnailFile)
    if (isEdit) data.append('_method', 'PUT')

    try {
      if (isEdit) {
        await apiClient.post(`/admin/courses/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      } else {
        await apiClient.post('/admin/courses', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      }
      navigate('/admin/cursos')
    } catch (err) {
      const errors = err.response?.data?.errors
      if (errors) {
        setError(Object.values(errors).flat().join(' · '))
      } else {
        setError(err.response?.data?.message || 'Error al guardar el curso.')
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/admin/cursos')}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors"
        >
          <i className="ti ti-arrow-left text-lg" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Editar curso' : 'Nuevo curso'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isEdit ? 'Modifica los datos del curso' : 'Crea un nuevo curso de formación'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Ej: Terapia Cognitivo-Conductual Avanzada"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Descripción general del curso..."
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Precio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio sin membresía (MXN)
          </label>
          <p className="text-xs text-gray-400 mb-1.5">Escribe 0 para que sea gratis para todos</p>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Miniatura */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Miniatura del curso</label>
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            {thumbnailPreview ? (
              <div className="flex flex-col items-center gap-2">
                <img
                  src={thumbnailPreview}
                  alt="Preview"
                  className="w-32 h-20 object-cover rounded-lg"
                />
                <span className="text-xs text-gray-500">Haz clic para cambiar</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-4">
                <i className="ti ti-photo text-3xl text-gray-400" />
                <span className="text-sm text-gray-500">Haz clic para subir imagen</span>
                <span className="text-xs text-gray-400">PNG, JPG, JPEG · Máx 2 MB</span>
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpg,image/jpeg"
            onChange={handleFile}
            className="hidden"
          />
        </div>

        {/* Publicado */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setForm(f => ({ ...f, is_published: !f.is_published }))}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
              form.is_published ? 'bg-green-500' : 'bg-gray-300'
            }`}
            aria-label="Toggle publicado"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                form.is_published ? 'translate-x-4' : 'translate-x-0.5'
              }`}
            />
          </button>
          <label className="text-sm text-gray-700 cursor-pointer" onClick={() => setForm(f => ({ ...f, is_published: !f.is_published }))}>
            Publicar curso (visible para terapeutas)
          </label>
        </div>

        {/* Acciones */}
        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/admin/cursos')}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {saving && <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />}
            {saving ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear curso'}
          </button>
        </div>
      </form>
    </div>
  )
}
