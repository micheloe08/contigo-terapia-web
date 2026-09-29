import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import apiClient from '../../../api/client'

function ProgressBar({ percentage }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-1.5">
      <div
        className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

export default function DoctorCourseList() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    apiClient.get('/doctor/courses')
      .then(res => setCourses(res.data))
      .catch(() => setError('Error al cargar los cursos.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Cursos de Formación</h1>
        <p className="text-gray-500 text-sm mt-1">
          Accede a tu material de formación continua
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <i className="ti ti-books text-5xl mb-3 block" />
          <p className="text-lg font-medium">No hay cursos disponibles aún</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map(course => (
            <Link
              key={course.id}
              to={`/doctor/cursos/${course.id}`}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden group"
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-200 relative">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <i className="ti ti-book text-4xl text-blue-400" />
                  </div>
                )}
                {/* Access badge */}
                {!course.is_accessible && (
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                    <i className="ti ti-lock text-xs" />
                    {parseFloat(course.price) > 0 ? `$${parseFloat(course.price).toLocaleString('es-MX', {minimumFractionDigits: 0})} MXN` : 'Requiere membresía'}
                  </div>
                )}
                {course.is_enrolled && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                    Inscrito
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-1">
                  {course.title}
                </h3>
                {course.description && (
                  <p className="text-xs text-gray-400 line-clamp-2 mb-3">{course.description}</p>
                )}

                {/* Progress */}
                {course.is_enrolled && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progreso</span>
                      <span>{course.progress_percentage}%</span>
                    </div>
                    <ProgressBar percentage={course.progress_percentage} />
                  </div>
                )}

                {/* CTA */}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {course.modules?.length ?? 0} módulo{(course.modules?.length ?? 0) !== 1 ? 's' : ''}
                  </span>
                  <span className={`text-xs font-medium ${course.is_accessible ? 'text-blue-600' : 'text-gray-400'}`}>
                    {course.is_enrolled
                      ? course.progress_percentage > 0 ? 'Continuar →' : 'Comenzar →'
                      : course.is_accessible ? 'Ver curso →' : 'Adquirir →'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
