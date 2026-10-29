import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-100 p-6 text-center">
      <p className="text-5xl font-bold text-indigo-600">404</p>
      <h1 className="text-xl font-semibold text-slate-800">Page not found</h1>
      <p className="text-sm text-slate-500">الصفحة اللي بتدوّر عليها مش موجودة.</p>
      <Link
        to="/"
        className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        Back to home
      </Link>
    </div>
  )
}
