import api from '@/api/axiosClient'

// GET /posts?page=&limit=
export const getPosts = (params) => api.get('/posts', { params })

// GET /posts/:postId
export const getPost = (postId) => api.get(`/posts/${postId}`)

// POST /posts  (multipart: body, image)
export const createPost = (formData) => api.post('/posts', formData)

// PUT /posts/:postId  (multipart: body, image)
export const updatePost = (postId, formData) => api.put(`/posts/${postId}`, formData)

// DELETE /posts/:postId
export const deletePost = (postId) => api.delete(`/posts/${postId}`)
