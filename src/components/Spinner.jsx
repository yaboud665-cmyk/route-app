export default function Spinner({ className = 'size-6' }) {
  return (
    <span
      role="status"
      aria-label="loading"
      className={`inline-block animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600 ${className}`}
    />
  )
}
