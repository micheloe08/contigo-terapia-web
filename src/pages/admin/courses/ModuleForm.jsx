import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import apiClient from '../../../api/client'

const CONTENT_TYPES = [
  { value: 'video', label: 'Video de YouTube', icon: 'ti-brand-youtube' },
  { value: 'file',  label: 'Archivo',          icon: 'ti-paperclip' },
  { value: 'text',  label: 'Texto / HTML',      icon: 'ti-align-left' },
]

const emptyLesson = {
  title: '',
  description: '',
  content_type: 'video',
  youtube_url: '',
  text_content: '',
  duration_minutes: '',
  is_free_preview: false,
}

export default function ModuleForm() {
  const { id: courseId } = useParams()
  const navigate = useNavigate()

  const [course, setCourse] = useState(null)
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Module creation state
  const [showModuleForm, setShowModuleForm] = useState(false)
  const [moduleForm, setModuleForm] = useState({ title: '', description: '', order: '' })
  const [savingModule, setSavingModule] = useState(false)

  // Editing module inline
  const [editingModuleId, setEditingModuleId] = useState(null)
  const [editModuleForm, setEditModuleForm] = useState({})

  // Lesson form state (attached to a module)
  const [activeLessonModule, setActiveLessonModule] = useState(null)
  const [lessonForm, setLessonForm] = useState(emptyLesson)
  const [lessonFile, setLessonFile] = useState(null)
  const [savingLesson, setSavingLesson] = useState(false)
  const fileRef = useRef(null)

  const fetchCourse = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.get(`/admin/courses/${courseId}`)
      setCourse(res.data)
      setModules(res.data.modules ?? [])
    } catch {
      setError('Error al cargar el curso.')
    } finally {
      setLoading(false)
    }
  }, [courseId])

  useEffect(() => { fetchCourse() }, [fetchCourse])

  // ---------- Modules ----------
  const handleAddModule = async (e) => {
    e.preventDefault()
    if (!moduleForm.title.trim()) { setError('El título del módulo es requerido.'); return }
    setSavingModule(true)
    setError(null)
    try {
      const res = await apiClient.post(`/admin/courses/${courseId}/modules`, {
        title: moduleForm.title,
        description: moduleForm.description || undefined,
        order: moduleForm.order !== '' ? parseInt(moduleForm.order) : undefined,
      })
      setModules(prev => [...prev, res.data])
      setModuleForm({ title: '', description: '', order: '' })
      setShowModuleForm(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear módulo.')
    } finally {
      setSavingModule(false)
    }
  }

  const handleUpdateModule = async (moduleId) => {
    try {
      await apiClient.put(`/admin/modules/${moduleId}`, editModuleForm)
      setModules(prev => prev.map(m => m.id === moduleId ? { ...m, ...editModuleForm } : m))
      setEditingModuleId(null)
    } catch {
      setError('Error al actualizar módulo.')
    }
  }

  const handleDeleteModule = async (module) => {
    if (!window.confirm(`¿Eliminar el módulo "${module.title}" y todas sus lecciones?`)) return
    try {
      await apiClient.delete(`/admin/modules/${module.id}`)
      setModules(prev => prev.filter(m => m.id !== module.id))
    } catch {
      setError('Error al eliminar módulo.')
    }
  }

  // ---------- Lessons ----------
  const openLessonForm = (moduleId) => {
    setActiveLessonModule(moduleId)
    setLessonForm(emptyLesson)
    setLessonFile(null)
  }

  const handleLessonFile = (e) => {
    const file = e.target.files[0]
    if (file) setLessonFile(file)
  }

  const handleAddLesson = async (e) => {
    e.preventDefault()
    if (!lessonForm.title.trim()) { setError('El título de la lección es requerido.'); return }
    setSavingLesson(true)
    setError(null)

    const data = new FormData()
    Object.entries(lessonForm).forEach(([k, v]) => {
      if (v !== '' && v !== null && v !== undefined) {
        data.append(k, typeof v === 'boolean' ? (v ? '1' : '0') : v)
      }
    })
    if (lessonFile) data.append('file', lessonFile)

    try {
      const res = await apiClient.post(`/admin/modules/${activeLessonModule}/lessons`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setModules(prev => prev.map(m => {
        if (m.id !== activeLessonModule) return m
        return { ...m, lessons: [...(m.lessons ?? []), res.data] }
      }))
      setActiveLessonModule(null)
      setLessonForm(emptyLesson)
      setLessonFile(null)
    } catch (err) {
      const errors = err.response?.data?.errors
      setError(errors ? Object.values(errors).flat().join(' · ') : 'Error al crear lección.')
    } finally {
      setSavingLesson(false)
    }
  }

  const handleDeleteLesson = async (moduleId, lesson) => {
    if (!window.confirm(`¿Eliminar la lección "${lesson.title}"?`)) return
    try {
      await apiClient.delete(`/admin/lessons/${lesson.id}`)
      setModules(prev => prev.map(m => {
        if (m.id !== moduleId) return m
        return { ...m, lessons: (m.lessons ?? []).filter(l => l.id !== lesson.id) }
      }))
    } catch {
      setError('Error al eliminar lección.')
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
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/admin/cursos')}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors"
        >
          <i className="ti ti-arrow-left text-lg" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Módulos — {course?.title}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gestiona los módulos y lecciones del curso
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: module list */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Módulos ({modules.length})</h2>
            <button
              onClick={() => setShowModuleForm(v => !v)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
            >
              <i className="ti ti-plus" />
              Módulo
            </button>
          </div>

          {/* New module inline form */}
          {showModuleForm && (
            <form onSubmit={handleAddModule} className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
              <p className="text-sm font-medium text-blue-800">Nuevo módulo</p>
              <input
                type="text"
                value={moduleForm.title}
                onChange={e => setModuleForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Título del módulo"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <textarea
                value={moduleForm.description}
                onChange={e => setModuleForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Descripción (opcional)"
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <input
                type="number"
                value={moduleForm.order}
                onChange={e => setModuleForm(f => ({ ...f, order: e.target.value }))}
                placeholder="Orden (número)"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModuleForm(false)}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingModule}
                  className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-60"
                >
                  {savingModule ? 'Creando…' : 'Crear módulo'}
                </button>
              </div>
            </form>
          )}

          {/* Module list */}
          {modules.length === 0 ? (
            <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
              <i className="ti ti-layout-list text-3xl mb-2 block" />
              <p className="text-sm">Agrega el primer módulo</p>
            </div>
          ) : (
            <div className="space-y-3">
              {modules.map(module => (
                <div key={module.id} className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  {/* Module header */}
                  {editingModuleId === module.id ? (
                    <div className="p-3 space-y-2">
                      <input
                        type="text"
                        value={editModuleForm.title ?? module.title}
                        onChange={e => setEditModuleForm(f => ({ ...f, title: e.target.value }))}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditingModuleId(null)} className="text-xs text-gray-500 hover:text-gray-700">Cancelar</button>
                        <button onClick={() => handleUpdateModule(module.id)} className="text-xs bg-blue-600 text-white px-2 py-1 rounded">Guardar</button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm text-gray-900">{module.title}</p>
                        <p className="text-xs text-gray-400">
                          {(module.lessons ?? []).length} lección{(module.lessons ?? []).length !== 1 ? 'es' : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openLessonForm(module.id)}
                          className="p-1.5 rounded hover:bg-blue-50 text-blue-600 text-xs transition-colors"
                          title="Agregar lección"
                        >
                          <i className="ti ti-plus text-base" />
                        </button>
                        <button
                          onClick={() => { setEditingModuleId(module.id); setEditModuleForm({ title: module.title, description: module.description ?? '' }) }}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition-colors"
                          title="Editar módulo"
                        >
                          <i className="ti ti-edit text-base" />
                        </button>
                        <button
                          onClick={() => handleDeleteModule(module)}
                          className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"
                          title="Eliminar módulo"
                        >
                          <i className="ti ti-trash text-base" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Lessons inside module */}
                  {(module.lessons ?? []).length > 0 && (
                    <div className="border-t border-gray-100 divide-y divide-gray-50">
                      {module.lessons.map(lesson => (
                        <div key={lesson.id} className="px-3 py-2 flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            <i className={`text-gray-400 text-sm flex-shrink-0 ${
                              lesson.content_type === 'video' ? 'ti ti-brand-youtube' :
                              lesson.content_type === 'file' ? 'ti ti-paperclip' : 'ti ti-align-left'
                            }`} />
                            <span className="text-sm text-gray-700 truncate">{lesson.title}</span>
                            {lesson.is_free_preview && (
                              <span className="flex-shrink-0 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                                Vista previa
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteLesson(module.id, lesson)}
                            className="flex-shrink-0 p-1 rounded hover:bg-red-50 text-red-400 ml-2"
                          >
                            <i className="ti ti-trash text-sm" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: lesson form */}
        <div>
          {activeLessonModule ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800">
                  Nueva lección — {modules.find(m => m.id === activeLessonModule)?.title}
                </h2>
                <button
                  onClick={() => setActiveLessonModule(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="ti ti-x" />
                </button>
              </div>

              <form onSubmit={handleAddLesson} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Título <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={lessonForm.title}
                    onChange={e => setLessonForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Título de la lección"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Content type */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Tipo de contenido</label>
                  <div className="grid grid-cols-3 gap-2">
                    {CONTENT_TYPES.map(ct => (
                      <button
                        key={ct.value}
                        type="button"
                        onClick={() => setLessonForm(f => ({ ...f, content_type: ct.value }))}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-xs transition-colors ${
                          lessonForm.content_type === ct.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <i className={`${ct.icon} text-lg`} />
                        {ct.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic fields */}
                {lessonForm.content_type === 'video' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">URL de YouTube</label>
                    <input
                      type="url"
                      value={lessonForm.youtube_url}
                      onChange={e => setLessonForm(f => ({ ...f, youtube_url: e.target.value }))}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {lessonForm.content_type === 'file' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Archivo</label>
                    <div
                      onClick={() => fileRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                    >
                      {lessonFile ? (
                        <p className="text-sm text-gray-700">
                          <i className="ti ti-paperclip mr-1" />
                          {lessonFile.name}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400">
                          <i className="ti ti-upload mr-1" />
                          Haz clic para subir (PDF, DOCX, PPT, imagen, ZIP · Máx 50 MB)
                        </p>
                      )}
                    </div>
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.zip"
                      onChange={handleLessonFile}
                      className="hidden"
                    />
                  </div>
                )}

                {lessonForm.content_type === 'text' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Contenido de texto</label>
                    <textarea
                      value={lessonForm.text_content}
                      onChange={e => setLessonForm(f => ({ ...f, text_content: e.target.value }))}
                      placeholder="Escribe el contenido de la lección..."
                      rows={5}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                )}

                {/* Duration */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Duración (minutos)</label>
                  <input
                    type="number"
                    min="0"
                    value={lessonForm.duration_minutes}
                    onChange={e => setLessonForm(f => ({ ...f, duration_minutes: e.target.value }))}
                    placeholder="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Free preview */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_free_preview"
                    checked={lessonForm.is_free_preview}
                    onChange={e => setLessonForm(f => ({ ...f, is_free_preview: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                  <label htmlFor="is_free_preview" className="text-sm text-gray-700 cursor-pointer">
                    Vista previa gratuita (visible sin acceso al curso)
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveLessonModule(null)}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={savingLesson}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm rounded-lg"
                  >
                    {savingLesson && <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />}
                    {savingLesson ? 'Guardando…' : 'Agregar lección'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
              <i className="ti ti-click text-3xl mb-2" />
              <p className="text-sm">Haz clic en <strong>+</strong> de un módulo para agregar una lección</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
