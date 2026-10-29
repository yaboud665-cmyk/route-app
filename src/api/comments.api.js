import api from '@/api/axiosClient'

// GET /posts/:postId/comments?page=&limit=
export const getPostComments = (postId, params) =>
  api.get(`/posts/${postId}/comments`, { params })

// POST /posts/:postId/comments  (multipart: content, image)
export const createComment = (postId, formData) => api.post(`/posts/${postId}/comments`, formData)

// PUT /posts/:postId/comments/:commentId  (multipart: content, image)
export const updateComment = (postId, commentId, formData) =>
  api.put(`/posts/${postId}/comments/${commentId}`, formData)

// DELETE /posts/:postId/comments/:commentId
export const deleteComment = (postId, commentId) =>
  api.delete(`/posts/${postId}/comments/${commentId}`)
