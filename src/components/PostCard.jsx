import { useState } from 'react'
import { Link } from 'react-router-dom'

import { deletePost, updatePost } from '@/api/posts.api'
import Alert from '@/components/Alert'
import Avatar from '@/components/Avatar'
import PostForm from '@/components/PostForm'
import Spinner from '@/components/Spinner'
import { useAuth } from '@/context/AuthContext'
import { getErrorMessage } from '@/utils/errors'
import { formatDate } from '@/utils/formatDate'

export default function PostCard({ post, onPostUpdated, onPostDeleted, linkToDetails = true }) {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')

  const postId = post._id || post.id
  const author = typeof post.user === 'object' ? post.user : null
  const isOwner = author?._id === user?._id

  const handleUpdate = async (formData) => {
    const res = await updatePost(postId, formData)
    onPostUpdated?.({ ...post, ...res.data.post })
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return

    setError('')
    setIsDeleting(true)
    try {
      await deletePost(postId)
      onPostDeleted?.(postId)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <header className="flex items-start gap-3">
        <Avatar src={author?.photo} alt={author?.name} />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">
            {author?.name ?? 'Unknown user'}
          </p>
          <p className="truncate text-xs text-slate-500">
            @{author?.username ?? 'unknown'} · {formatDate(post.createdAt)}
          </p>
        </div>

        {isOwner && !isEditing && (
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-lg px-2 py-1 text-xs font-medium text-indigo-600 transition hover:bg-indigo-50"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
            >
              {isDeleting && <Spinner className="size-3 border-red-200 border-t-red-600" />}
              Delete
            </button>
          </div>
        )}
      </header>

      {isEditing ? (
        <div className="mt-3">
          <PostForm
            initialBody={post.body ?? ''}
            submitLabel="Save"
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      ) : (
        <>
          {post.body && (
            <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap text-slate-700">
              {post.body}
            </p>
          )}

          {post.image && (
            <img
              src={post.image}
              alt="post"
              loading="lazy"
              className="mt-3 max-h-96 w-full rounded-xl object-cover"
            />
          )}
        </>
      )}

      {error && <Alert className="mt-3">{error}</Alert>}

      <footer className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span>{post.likesCount ?? 0} likes</span>
        <span>{post.commentsCount ?? 0} comments</span>

        {linkToDetails && (
          <Link
            to={`/posts/${postId}`}
            className="ml-auto font-medium text-indigo-600 hover:underline"
          >
            View details
          </Link>
        )}
      </footer>
    </article>
  )
}
