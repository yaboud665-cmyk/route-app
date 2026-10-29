import { useEffect, useRef, useState } from 'react'

import Alert from '@/components/Alert'
import Spinner from '@/components/Spinner'
import { getErrorMessage } from '@/utils/errors'

/**
 * فورم إنشاء/تعديل البوست.
 * الـ API بيستقبل multipart/form-data بحقلين: body و image.
 */
export default function PostForm({
  initialBody = '',
  submitLabel = 'Post',
  placeholder = "What's on your mind?",
  onSubmit,
  onCancel,
}) {
  const [body, setBody] = useState(initialBody)
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] ?? null
    setImage(file)
    setPreview(file ? URL.createObjectURL(file) : '')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!body.trim() && !image) {
      setError('اكتب نص البوست أو اختار صورة')
      return
    }

    const formData = new FormData()
    formData.append('body', body.trim())
    if (image) formData.append('image', image)

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      setBody('')
      setImage(null)
      setPreview('')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white"
      />

      {preview && (
        <div className="relative overflow-hidden rounded-xl border border-slate-200">
          <img src={preview} alt="preview" className="max-h-72 w-full object-cover" />
          <button
            type="button"
            onClick={() => {
              setImage(null)
              setPreview('')
              if (fileInputRef.current) fileInputRef.current.value = ''
            }}
            className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white"
          >
            Remove
          </button>
        </div>
      )}

      {error && <Alert variant="error">{error}</Alert>}

      <div className="flex flex-wrap items-center gap-2">
        <label className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          Add image
        </label>

        <div className="ml-auto flex items-center gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <Spinner className="size-4 border-white/40 border-t-white" />}
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  )
}
