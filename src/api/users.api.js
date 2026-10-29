import api from '@/api/axiosClient'

// POST /users/signup
export const signupUser = (payload) => api.post('/users/signup', payload)

// POST /users/signin
export const signinUser = (payload) => api.post('/users/signin', payload)

// GET /users/profile-data
export const getMyProfile = () => api.get('/users/profile-data')

// PATCH /users/change-password
export const changePassword = (payload) => api.patch('/users/change-password', payload)
