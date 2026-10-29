import { useState } from 'react'

import { deleteComment, updateComment } from '@/api/comments.api'
import Alert from '@/components/Alert'
import Avatar from '@/components/Avatar'
import CommentForm from '@/components/CommentForm'
import Spinner from '@/components/Spinner'
import { useAuth } from '@/context/AuthContext'
import { getErrorMessage } from '@/utils/errors'
import { formatDate } from '@/utils/formatDate'

export default function CommentItem({ comment, postId, postOwnerId, onCommentUpdated, onCommentDeleted }) {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')

  const commentId = comment._id || comment.id
  const creator = comment.commentCreator
  // صاحب الكومنت يقدر يعدّل/يحذف، وصاحب البوست يقدر يحذف
  const canEdit = creator?._id === user?._id
  const canDelete = canEdit || postOwnerId === user?._id

  const handleUpdate = async (formData) => {
    const res = await updateComment(postId, commentId, formData)
    onCommentUpdated?.({ ...comment, ...res.data.comment })
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return

    setError('')
    setIsDeleting(true)
    try {
      await deleteComment(postId, commentId)
      onCommentDeleted?.(commentId)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-start gap-3">
        <Avatar src={creator?.photo} alt={creator?.name} className="size-8" />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {creator?.name ?? 'Unknown user'}
              </p>
              <p className="truncate text-xs text-slate-400">
                @{creator?.username ?? 'unknown'} · {formatDate(comment.createdAt)}
              </p>
            </div>

            {!isEditing && (
              <div className="flex shrink-0 items-center gap-1">
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="rounded-lg px-2 py-1 text-xs font-medium text-indigo-600 transition hover:bg-indigo-50"
                  >
                    Edit
                  </button>
                )}
                {canDelete && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                  >
                    {isDeleting && <Spinner className="size-3 border-red-200 border-t-red-600" />}
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2">
              <CommentForm
                initialContent={comment.content ?? ''}
                submitLabel="Save"
                compact
                onSubmit={handleUpdate}
                onCancel={() => setIsEditing(false)}
              />
            </div>
          ) : (
            <>
              {comment.content && (
                <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap text-slate-700">
                  {comment.content}
                </p>
              )}

              {comment.image && (
                <img
                  src={comment.image}
                  alt="comment"
                  loading="lazy"
                  className="mt-2 max-h-64 w-full rounded-lg object-cover"
                />
              )}
            </>
          )}

          {error && <Alert className="mt-2">{error}</Alert>}
        </div>
      </div>
    </div>
  )
}
