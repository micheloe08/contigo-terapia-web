import client from './client'

export const authApi = {
  loginApi: (data) => client.post('/auth/login', data),
  registerPatient: (data) => client.post('/auth/register/patient', data),
  registerDoctor: (data) => client.post('/auth/register/doctor', data),
  logout: () => client.post('/auth/logout'),
  me: () => client.get('/auth/me'),
}