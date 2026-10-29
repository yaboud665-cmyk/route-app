import { useState } from 'react'

import { changePassword } from '@/api/users.api'
import Alert from '@/components/Alert'
import Spinner from '@/components/Spinner'
import { getErrorMessage } from '@/utils/errors'
import { setToken } from '@/utils/storage'

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-indigo-400 focus:bg-white'

const EMPTY_FORM = { password: '', newPassword: '', confirmPassword: '' }

export default function ChangePassword() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!form.password || !form.newPassword) {
      setError('اكتب كلمة المرور الحالية والجديدة')
      return
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('كلمة المرور الجديدة وتأكيدها غير متطابقين')
      return
    }

    setIsSubmitting(true)
    try {
      // PATCH /users/change-password
      const res = await changePassword({
        password: form.password,
        newPassword: form.newPassword,
      })

      // الـ API بيرجّع توكن جديد بعد تغيير كلمة المرور
      if (res.data?.token) setToken(res.data.token)

      setForm(EMPTY_FORM)
      setSuccess(res.message ?? 'Password changed successfully')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-lg font-bold text-slate-900">Change password</h1>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">
              Current password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="newPassword" className="text-sm font-medium text-slate-700">
              New password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              value={form.newPassword}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {error && <Alert>{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <Spinner className="size-4 border-white/40 border-t-white" />}
            Update password
          </button>
        </form>
      </section>
    </div>
  )
}
