// This file configures routing, not a reusable component module, so fast-refresh
// tracking of its lazy-loaded page references doesn't apply here.
/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import PageFallback from './components/layout/PageFallback'

// Layouts (kept eager: small and needed immediately to gate every route)
import GuestLayout from './layouts/GuestLayout.jsx'
import PatientLayout from './layouts/PatientLayout'
import DoctorLayout from './layouts/DoctorLayout'
import AdminLayout from './layouts/AdminLayout'

// Pages (lazy: split into separate chunks so visitors only download what they visit)
const Landing = lazy(() => import('./pages/Landing'))
const DoctorSearch = lazy(() => import('./pages/DoctorSearch'))
const DoctorProfile = lazy(() => import('./pages/DoctorProfile'))
const Login = lazy(() => import('./pages/auth/Login'))
const RegisterPatient = lazy(() => import('./pages/auth/RegisterPatient'))
const RegisterDoctor = lazy(() => import('./pages/auth/RegisterDoctor'))
const PatientDashboard = lazy(() => import('./pages/patient/Dashboard'))
const DoctorDashboard = lazy(() => import('./pages/doctor/Dashboard'))
const DoctorSchedule = lazy(() => import('./pages/doctor/Schedule'))
const DoctorAppointments = lazy(() => import('./pages/doctor/Appointments'))
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const DoctorApproval = lazy(() => import('./pages/admin/DoctorApproval'))
const Catalogs = lazy(() => import('./pages/admin/Catalogs'))
const NotFound = lazy(() => import('./pages/NotFound'))
const PatientAppointments = lazy(() => import('./pages/patient/Appointments'))
const Checkout = lazy(() => import('./pages/patient/Checkout'))
const AdminCourseList = lazy(() => import('./pages/admin/courses/CourseList'))
const AdminCourseForm = lazy(() => import('./pages/admin/courses/CourseForm'))
const AdminModuleForm = lazy(() => import('./pages/admin/courses/ModuleForm'))
const DoctorCourseList = lazy(() => import('./pages/doctor/courses/CourseList'))
const DoctorCourseDetail = lazy(() => import('./pages/doctor/courses/CourseDetail'))
const LessonView = lazy(() => import('./pages/doctor/courses/LessonView'))

function withSuspense(element) {
  return <Suspense fallback={<PageFallback />}>{element}</Suspense>
}

const router = createBrowserRouter([
  // Rutas públicas
  {
    element: <GuestLayout />,
    children: [
      { path: '/',           element: withSuspense(<Landing />) },
      { path: '/terapeutas',      element: withSuspense(<DoctorSearch />) },
      { path: '/terapeutas/:id',   element: withSuspense(<DoctorProfile />) },
      { path: '/login', element: withSuspense(<Login />) },
      { path: '/registro/paciente', element: withSuspense(<RegisterPatient />) },
      { path: '/registro/doctor', element: withSuspense(<RegisterDoctor />) },
    ],
  },

  // Rutas paciente
  {
    element: <PatientLayout />,
    children: [
      { path: '/paciente',          element: withSuspense(<PatientDashboard />) },
      { path: '/paciente/citas',      element: withSuspense(<PatientAppointments />) },
      { path: '/paciente/checkout',   element: withSuspense(<Checkout />) },
    ],
  },

  // Rutas doctor
  {
    element: <DoctorLayout />,
    children: [
      { path: '/doctor',          element: withSuspense(<DoctorDashboard />) },
      { path: '/doctor/horarios', element: withSuspense(<DoctorSchedule />) },
      { path: '/doctor/citas',    element: withSuspense(<DoctorAppointments />) },
      { path: '/doctor/cursos',              element: withSuspense(<DoctorCourseList />) },
      { path: '/doctor/cursos/:id',          element: withSuspense(<DoctorCourseDetail />) },
      { path: '/doctor/lecciones/:id',       element: withSuspense(<LessonView />) },
    ],
  },

  // Rutas admin / operator / supervisor
  {
    element: <AdminLayout />,
    children: [
      { path: '/admin',              element: withSuspense(<AdminDashboard />) },
      { path: '/admin/terapeutas',   element: withSuspense(<DoctorApproval />) },
      { path: '/admin/catalogos',    element: withSuspense(<Catalogs />) },
      { path: '/admin/cursos',                    element: withSuspense(<AdminCourseList />) },
      { path: '/admin/cursos/nuevo',              element: withSuspense(<AdminCourseForm />) },
      { path: '/admin/cursos/:id/editar',         element: withSuspense(<AdminCourseForm />) },
      { path: '/admin/cursos/:id/modulos',        element: withSuspense(<AdminModuleForm />) },
    ],
  },

  // 404
  { path: '*', element: withSuspense(<NotFound />) },
])

export default router
