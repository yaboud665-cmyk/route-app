import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Alert from '@/components/Alert'
import AuthLayout from '@/components/AuthLayout'
import Spinner from '@/components/Spinner'
import { useAuth } from '@/context/AuthContext'
import { getErrorMessage } from '@/utils/errors'

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-indigo-400 focus:bg-white'

const EMPTY_FORM = {
  name: '',
  username: '',
  email: '',
  dateOfBirth: '',
  gender: 'male',
  password: '',
  rePassword: '',
}

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.name.trim() || !form.username.trim() || !form.email.trim()) {
      setError('الاسم واسم المستخدم والبريد مطلوبين')
      return
    }

    if (form.password !== form.rePassword) {
      setError('كلمة المرور وتأكيدها غير متطابقين')
      return
    }

    setIsSubmitting(true)
    try {
      await signup({
        name: form.name.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        password: form.password,
        rePassword: form.rePassword,
      })
      navigate('/', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join Route Posts in a few seconds"
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium text-slate-700">
            Full name
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ahmed Ali"
            className={inputClass}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="username" className="text-sm font-medium text-slate-700">
              Username
            </label>
            <input
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="ahmed_ali"
              className={inputClass}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="dateOfBirth" className="text-sm font-medium text-slate-700">
              Date of birth
            </label>
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="gender" className="text-sm font-medium text-slate-700">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              placeholder="Aa@123456"
              className={inputClass}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="rePassword" className="text-sm font-medium text-slate-700">
              Confirm password
            </label>
            <input
              id="rePassword"
              name="rePassword"
              type="password"
              autoComplete="new-password"
              value={form.rePassword}
              onChange={handleChange}
              placeholder="Aa@123456"
              className={inputClass}
            />
          </div>
        </div>

        {error && <Alert>{error}</Alert>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting && <Spinner className="size-4 border-white/40 border-t-white" />}
          Create account
        </button>
      </form>
    </AuthLayout>
  )
}
