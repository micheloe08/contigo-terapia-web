import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import apiClient from '../../../api/client'

export default function CourseList() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [togglingId, setTogglingId] = useState(null)

  const fetchCourses = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.get('/admin/courses')
      setCourses(res.data.data ?? res.data)
    } catch {
      setError('Error al cargar los cursos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchCourses() }, [fetchCourses])

  const togglePublished = async (course) => {
    setTogglingId(course.id)
    try {
      const res = await apiClient.put(`/admin/courses/${course.id}`, {
        is_published: !course.is_published,
      })
      setCourses(prev =>
        prev.map(c => c.id === course.id ? { ...c, is_published: res.data.is_published } : c)
      )
    } catch {
      setError('Error al cambiar estado de publicación.')
    } finally {
      setTogglingId(null)
    }
  }

  const handleDelete = async (course) => {
    if (!window.confirm(`¿Eliminar el curso "${course.title}"? Esta acción no se puede deshacer.`)) return
    try {
      await apiClient.delete(`/admin/courses/${course.id}`)
      setCourses(prev => prev.filter(c => c.id !== course.id))
    } catch {
      setError('Error al eliminar el curso.')
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cursos de Formación</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona el contenido de formación para terapeutas
          </p>
        </div>
        <Link
          to="/admin/cursos/nuevo"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <i className="ti ti-plus" />
          Nuevo curso
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <i className="ti ti-books text-5xl mb-3 block" />
          <p className="text-lg font-medium">No hay cursos aún</p>
          <p className="text-sm mt-1">Crea el primer curso de formación</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Curso</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Precio</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Módulos</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Inscritos</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Publicado</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {courses.map(course => (
                <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <i className="ti ti-book text-blue-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{course.title}</p>
                        {course.description && (
                          <p className="text-gray-400 text-xs truncate max-w-[240px]">
                            {course.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {parseFloat(course.price) === 0 ? (
                      <span className="text-green-600 font-medium">Gratis</span>
                    ) : (
                      `$${parseFloat(course.price).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-700">
                    {course.modules_count ?? 0}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-700">
                    {course.enrollments_count ?? 0}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => togglePublished(course)}
                      disabled={togglingId === course.id}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                        course.is_published ? 'bg-green-500' : 'bg-gray-300'
                      } ${togglingId === course.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      aria-label="Toggle publicado"
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                          course.is_published ? 'translate-x-4' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/admin/cursos/${course.id}/modulos`}
                        className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition-colors"
                        title="Gestionar módulos"
                      >
                        <i className="ti ti-layout-list text-base" />
                      </Link>
                      <Link
                        to={`/admin/cursos/${course.id}/editar`}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors"
                        title="Editar"
                      >
                        <i className="ti ti-edit text-base" />
                      </Link>
                      <button
                        onClick={() => handleDelete(course)}
                        className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"
                        title="Eliminar"
                      >
                        <i className="ti ti-trash text-base" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
