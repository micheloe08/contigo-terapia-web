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

// Pages (lazy: split into separate chunks so visitors only download what they visit)
const Landing = lazy(() => import('./pages/Landing'))
const Login = lazy(() => import('./pages/auth/Login'))
const RegisterPatient = lazy(() => import('./pages/auth/RegisterPatient'))
const RegisterDoctor = lazy(() => import('./pages/auth/RegisterDoctor'))
const PatientDashboard = lazy(() => import('./pages/patient/Dashboard'))
const DoctorDashboard = lazy(() => import('./pages/doctor/Dashboard'))
const NotFound = lazy(() => import('./pages/NotFound'))

function withSuspense(element) {
  return <Suspense fallback={<PageFallback />}>{element}</Suspense>
}

const router = createBrowserRouter([
  // Rutas públicas
  {
    element: <GuestLayout />,
    children: [
      { path: '/', element: withSuspense(<Landing />) },
      { path: '/login', element: withSuspense(<Login />) },
      { path: '/registro/paciente', element: withSuspense(<RegisterPatient />) },
      { path: '/registro/doctor', element: withSuspense(<RegisterDoctor />) },
    ],
  },

  // Rutas paciente
  {
    element: <PatientLayout />,
    children: [
      { path: '/paciente', element: withSuspense(<PatientDashboard />) },
    ],
  },

  // Rutas doctor
  {
    element: <DoctorLayout />,
    children: [
      { path: '/doctor', element: withSuspense(<DoctorDashboard />) },
    ],
  },

  // 404
  { path: '*', element: withSuspense(<NotFound />) },
])

export default router
