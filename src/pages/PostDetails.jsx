import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { createComment, getPostComments } from '@/api/comments.api'
import { getPost } from '@/api/posts.api'
import Alert from '@/components/Alert'
import CommentForm from '@/components/CommentForm'
import CommentItem from '@/components/CommentItem'
import PostCard from '@/components/PostCard'
import Spinner from '@/components/Spinner'
import { getErrorMessage } from '@/utils/errors'

const COMMENTS_LIMIT = 10

export default function PostDetails() {
  const { postId } = useParams()
  const navigate = useNavigate()

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [pagination, setPagination] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true
    setIsLoading(true)
    setError('')

    Promise.all([getPost(postId), getPostComments(postId, { page: 1, limit: COMMENTS_LIMIT })])
      .then(([postRes, commentsRes]) => {
        if (!isActive) return
        setPost(postRes.data.post)
        setComments(commentsRes.data.comments)
        setPagination(commentsRes.meta.pagination)
      })
      .catch((err) => {
        if (isActive) setError(getErrorMessage(err))
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [postId])

  const handleLoadMoreComments = async () => {
    if (!pagination?.nextPage) return

    setIsLoadingMore(true)
    try {
      const res = await getPostComments(postId, {
        page: pagination.nextPage,
        limit: COMMENTS_LIMIT,
      })
      setComments((prev) => [...prev, ...res.data.comments])
      setPagination(res.meta.pagination)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsLoadingMore(false)
    }
  }

  // POST /posts/:postId/comments
  const handleCreateComment = async (formData) => {
    const res = await createComment(postId, formData)
    setComments((prev) => [res.data.comment, ...prev])
    setPost((prev) => (prev ? { ...prev, commentsCount: (prev.commentsCount ?? 0) + 1 } : prev))
  }

  const handleCommentUpdated = (updated) => {
    setComments((prev) =>
      prev.map((comment) => (comment._id === updated._id ? { ...comment, ...updated } : comment)),
    )
  }

  const handleCommentDeleted = (commentId) => {
    setComments((prev) => prev.filter((comment) => comment._id !== commentId))
    setPost((prev) =>
      prev ? { ...prev, commentsCount: Math.max((prev.commentsCount ?? 1) - 1, 0) } : prev,
    )
  }

  const handlePostDeleted = () => {
    navigate('/', { replace: true })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="size-8" />
      </div>
    )
  }

  if (error && !post) {
    return (
      <div className="space-y-4">
        <Alert>{error}</Alert>
        <Link to="/" className="text-sm font-medium text-indigo-600 hover:underline">
          ← Back to home
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <Link to="/" className="inline-block text-sm font-medium text-indigo-600 hover:underline">
        ← Back to home
      </Link>

      <PostCard
        post={post}
        linkToDetails={false}
        onPostUpdated={(updated) => setPost((prev) => ({ ...prev, ...updated }))}
        onPostDeleted={handlePostDeleted}
      />

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-700">
          Comments ({post.commentsCount ?? comments.length})
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <CommentForm submitLabel="Add comment" onSubmit={handleCreateComment} />
        </div>

        {error && <Alert>{error}</Alert>}

        {comments.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
            No comments yet. Start the conversation!
          </p>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                postId={postId}
                postOwnerId={post.user?._id}
                onCommentUpdated={handleCommentUpdated}
                onCommentDeleted={handleCommentDeleted}
              />
            ))}
          </div>
        )}

        {pagination?.nextPage && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleLoadMoreComments}
              disabled={isLoadingMore}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
            >
              {isLoadingMore && <Spinner className="size-4" />}
              Load more comments
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
