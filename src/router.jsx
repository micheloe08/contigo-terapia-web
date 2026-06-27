import { createBrowserRouter } from 'react-router-dom'

// Auth
import Login from './pages/auth/Login'
import RegisterPatient from './pages/auth/RegisterPatient'
import RegisterDoctor from './pages/auth/RegisterDoctor'

// Layouts
import GuestLayout from './layouts/GuestLayout.jsx'
import PatientLayout from './layouts/PatientLayout'
import DoctorLayout from './layouts/DoctorLayout'

// Patient pages
import PatientDashboard from './pages/patient/Dashboard'

// Doctor pages
import DoctorDashboard from './pages/doctor/Dashboard'
import Landing from './pages/Landing'

const router = createBrowserRouter([
  // Rutas públicas
  {
    element: <GuestLayout />,
    children: [
      { path: '/', element: <Landing /> },
      { path: '/login', element: <Login /> },
      { path: '/registro/paciente', element: <RegisterPatient /> },
      { path: '/registro/doctor',   element: <RegisterDoctor /> },
      { path: '/', element: <Landing /> },
    ],
  },

  // Rutas paciente
  {
    element: <PatientLayout />,
    children: [
      { path: '/paciente', element: <PatientDashboard /> },
    ],
  },

  // Rutas doctor
  {
    element: <DoctorLayout />,
    children: [
      { path: '/doctor', element: <DoctorDashboard /> },
    ],
  },
])

export default router