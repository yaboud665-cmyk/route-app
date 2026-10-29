import { useRef, useState } from 'react'

import Alert from '@/components/Alert'
import Avatar from '@/components/Avatar'
import Spinner from '@/components/Spinner'
import { useAuth } from '@/context/AuthContext'
import { getErrorMessage } from '@/utils/errors'

/**
 * فورم إضافة/تعديل كومنت.
 * الـ API بيستقبل multipart/form-data بحقلين: content و image.
 */
export default function CommentForm({
  initialContent = '',
  submitLabel = 'Comment',
  placeholder = 'Write a comment...',
  onSubmit,
  onCancel,
  compact = false,
}) {
  const { user } = useAuth()
  const [content, setContent] = useState(initialContent)
  const [image, setImage] = useState(null)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!content.trim() && !image) {
      setError('اكتب تعليق أو اختار صورة')
      return
    }

    const formData = new FormData()
    formData.append('content', content.trim())
    if (image) formData.append('image', image)

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      setContent('')
      setImage(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex items-start gap-2">
        {!compact && <Avatar src={user?.photo} alt={user?.name} className="size-8" />}

        <div className="min-w-0 flex-1 space-y-2">
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder={placeholder}
            rows={2}
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-indigo-400 focus:bg-white"
          />

          {error && <Alert>{error}</Alert>}

          <div className="flex flex-wrap items-center gap-2">
            <label className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(event) => setImage(event.target.files?.[0] ?? null)}
                className="hidden"
              />
              {image ? 'Image selected' : 'Add image'}
            </label>

            <div className="ml-auto flex items-center gap-2">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting && <Spinner className="size-3 border-white/40 border-t-white" />}
                {submitLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
