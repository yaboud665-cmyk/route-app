const VARIANTS = {
  error: 'bg-red-50 text-red-700 border-red-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  info: 'bg-sky-50 text-sky-700 border-sky-200',
}

export default function Alert({ variant = 'error', children, className = '' }) {
  if (!children) return null

  return (
    <div
      role="alert"
      className={`rounded-lg border px-3 py-2 text-sm ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </div>
  )
}
