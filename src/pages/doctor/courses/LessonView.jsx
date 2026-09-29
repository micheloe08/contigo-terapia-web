import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import ReactPlayer from 'react-player'
import apiClient from '../../../api/client'

export default function LessonView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [completing, setCompleting] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [progressPct, setProgressPct] = useState(null)

  const fetchLesson = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.get(`/doctor/lessons/${id}`)
      setLesson(res.data)
      setCompleted(res.data.is_completed ?? false)
    } catch (err) {
      if (err.response?.status === 403) {
        setError('No tienes acceso a esta lección. Inscríbete al curso para continuar.')
      } else {
        setError('Error al cargar la lección.')
      }
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetchLesson() }, [fetchLesson])

  const handleComplete = async () => {
    if (completed || completing) return
    setCompleting(true)
    try {
      const res = await apiClient.post(`/doctor/lessons/${id}/complete`)
      setCompleted(true)
      setProgressPct(res.data.progress_percentage)
    } catch {
      // silent
    } finally {
      setCompleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  if (error || !lesson) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <i className="ti ti-lock text-5xl text-gray-300 mb-4 block" />
        <p className="text-gray-600 mb-4">{error || 'Lección no encontrada.'}</p>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline text-sm"
        >
          ← Volver
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <i className="ti ti-arrow-left" />
        Volver al curso
      </button>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Video */}
        {lesson.content_type === 'video' && lesson.youtube_url && (
          <div className="aspect-video bg-black">
            <ReactPlayer
              url={lesson.youtube_url}
              width="100%"
              height="100%"
              controls
              onEnded={handleComplete}
            />
          </div>
        )}

        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{lesson.title}</h1>
              {lesson.duration_minutes > 0 && (
                <p className="text-sm text-gray-400 mt-1">
                  <i className="ti ti-clock mr-1" />
                  {lesson.duration_minutes} min
                </p>
              )}
            </div>

            {/* Complete button */}
            {!completed ? (
              <button
                onClick={handleComplete}
                disabled={completing}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors flex-shrink-0"
              >
                {completing && <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />}
                {completing ? 'Marcando…' : 'Marcar como completada'}
              </button>
            ) : (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-200 px-4 py-2 rounded-lg text-sm font-medium">
                <i className="ti ti-check" />
                Lección completada
                {progressPct !== null && ` · ${progressPct}% del curso`}
              </div>
            )}
          </div>

          {lesson.description && (
            <p className="text-gray-600 text-sm mb-6">{lesson.description}</p>
          )}

          {/* File download */}
          {lesson.content_type === 'file' && lesson.file_url && (
            <div className="mb-6">
              <a
                href={lesson.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
              >
                <i className="ti ti-download text-base" />
                Descargar {lesson.file_name || 'archivo'}
              </a>
            </div>
          )}

          {/* Text content */}
          {lesson.content_type === 'text' && lesson.text_content && (
            <div className="prose prose-sm max-w-none text-gray-700 mb-6 whitespace-pre-wrap">
              {lesson.text_content}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <button
              onClick={() => navigate(-1)}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <i className="ti ti-arrow-left" />
              Volver al curso
            </button>
            {lesson.next_lesson_id && (
              <Link
                to={`/doctor/lecciones/${lesson.next_lesson_id}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Siguiente lección
                <i className="ti ti-arrow-right" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
