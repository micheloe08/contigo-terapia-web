import { useState, useEffect, useCallback } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import apiClient from '../../../api/client'

function ProgressBar({ percentage }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

function CertificateButton({ courseId }) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      const res = await apiClient.get(`/doctor/courses/${courseId}/certificate`)
      window.open(res.data.download_url, '_blank')
    } catch {
      // silencioso — el usuario puede intentar de nuevo
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-sm font-medium rounded-lg transition-colors"
    >
      {loading
        ? <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
        : <i className="ti ti-certificate" />}
      {loading ? 'Preparando…' : '🎓 Descargar certificado'}
    </button>
  )
}

export default function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [enrolling, setEnrolling] = useState(false)
  const [openModules, setOpenModules] = useState({})

  const fetchCourse = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.get(`/doctor/courses/${id}`)
      setCourse(res.data)
      // Open first module by default
      if (res.data.modules?.length > 0) {
        setOpenModules({ [res.data.modules[0].id]: true })
      }
    } catch {
      setError('Error al cargar el curso.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetchCourse() }, [fetchCourse])

  const handleEnroll = async () => {
    setEnrolling(true)
    setError(null)
    try {
      await apiClient.post(`/doctor/courses/${id}/enroll`)
      await fetchCourse()
    } catch (err) {
      setError(err.response?.data?.message || 'Error al inscribirse.')
    } finally {
      setEnrolling(false)
    }
  }

  const toggleModule = (moduleId) => {
    setOpenModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }))
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="text-center py-16 text-gray-500">
        {error || 'Curso no encontrado.'}
      </div>
    )
  }

  const totalLessons = course.modules?.reduce((acc, m) => acc + (m.lessons?.length ?? 0), 0) ?? 0

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back */}
      <button
        onClick={() => navigate('/doctor/cursos')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <i className="ti ti-arrow-left" />
        Volver a cursos
      </button>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        {course.thumbnail && (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
          {course.description && (
            <p className="text-gray-600 text-sm mb-4">{course.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1">
              <i className="ti ti-layout-list" />
              {course.modules?.length ?? 0} módulos
            </span>
            <span className="flex items-center gap-1">
              <i className="ti ti-player-play" />
              {totalLessons} lecciones
            </span>
            {course.is_enrolled && (
              <span className="flex items-center gap-1 text-green-600">
                <i className="ti ti-check" />
                Inscrito
              </span>
            )}
          </div>

          {/* Progress */}
          {course.is_enrolled && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1.5">
                <span>Progreso del curso</span>
                <span className="font-medium">{course.progress_percentage}%</span>
              </div>
              <ProgressBar percentage={course.progress_percentage} />
            </div>
          )}

          {/* Certificado disponible */}
          {course.is_enrolled && course.progress_percentage === 100 && (
            <div className="mb-4">
              <CertificateButton courseId={id} />
            </div>
          )}

          {/* Enroll / access CTA */}
          {!course.is_enrolled && (
            <div className="pt-2">
              {course.is_accessible ? (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {enrolling && <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />}
                  {enrolling ? 'Inscribiendo…' : 'Inscribirme al curso'}
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-lg text-sm">
                    <i className="ti ti-lock" />
                    {parseFloat(course.price) > 0
                      ? `Requiere compra — $${parseFloat(course.price).toLocaleString('es-MX', {minimumFractionDigits: 2})} MXN`
                      : 'Requiere membresía activa'
                    }
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modules & Lessons */}
      <div className="space-y-3">
        <h2 className="font-semibold text-gray-800 text-lg">Contenido del curso</h2>
        {(course.modules ?? []).map((module, idx) => (
          <div key={module.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <button
              onClick={() => toggleModule(module.id)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{module.title}</p>
                  <p className="text-xs text-gray-400">{(module.lessons ?? []).length} lecciones</p>
                </div>
              </div>
              <i className={`ti ti-chevron-${openModules[module.id] ? 'up' : 'down'} text-gray-400`} />
            </button>

            {openModules[module.id] && (
              <div className="border-t border-gray-100 divide-y divide-gray-50">
                {(module.lessons ?? []).map(lesson => {
                  const canAccess = course.is_enrolled || lesson.is_free_preview
                  return (
                    <div key={lesson.id} className="flex items-center justify-between px-5 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          lesson.is_completed
                            ? 'bg-green-100 text-green-600'
                            : canAccess
                            ? 'bg-blue-50 text-blue-500'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          <i className={`text-xs ${
                            lesson.is_completed ? 'ti ti-check' :
                            lesson.content_type === 'video' ? 'ti ti-player-play' :
                            lesson.content_type === 'file' ? 'ti ti-paperclip' : 'ti ti-align-left'
                          }`} />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm truncate ${canAccess ? 'text-gray-800' : 'text-gray-400'}`}>
                            {lesson.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {lesson.is_free_preview && !course.is_enrolled && (
                              <span className="text-xs text-green-600 font-medium">Vista previa gratuita</span>
                            )}
                            {lesson.duration_minutes > 0 && (
                              <span className="text-xs text-gray-400">{lesson.duration_minutes} min</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {canAccess ? (
                        <Link
                          to={`/doctor/lecciones/${lesson.id}`}
                          className="flex-shrink-0 ml-3 text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {lesson.is_completed ? 'Repasar' : 'Ver'}
                        </Link>
                      ) : (
                        <i className="ti ti-lock text-gray-300 text-sm flex-shrink-0 ml-3" />
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
