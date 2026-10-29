import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import Alert from '@/components/Alert'
import AuthLayout from '@/components/AuthLayout'
import Spinner from '@/components/Spinner'
import { useAuth } from '@/context/AuthContext'
import { getErrorMessage } from '@/utils/errors'

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-indigo-400 focus:bg-white'

export default function Login() {
  const { signin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.email.trim() || !form.password) {
      setError('اكتب البريد/اسم المستخدم وكلمة المرور')
      return
    }

    setIsSubmitting(true)
    try {
      await signin({ email: form.email.trim(), password: form.password })
      navigate(location.state?.from ?? '/', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Welcome back to Route Posts"
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-semibold text-indigo-600 hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email or username
          </label>
          <input
            id="email"
            name="email"
            type="text"
            autoComplete="username"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            className={inputClass}
          />
        </div>

        {error && <Alert>{error}</Alert>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting && <Spinner className="size-4 border-white/40 border-t-white" />}
          Sign in
        </button>
      </form>
    </AuthLayout>
  )
}
