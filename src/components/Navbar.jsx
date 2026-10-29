import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

import Avatar from '@/components/Avatar'
import { useAuth } from '@/context/AuthContext'

const NAV_ITEMS = [
  { to: '/', label: 'Home', end: true },
  { to: '/profile', label: 'Profile' },
  { to: '/change-password', label: 'Change Password' },
]

const linkClass = ({ isActive }) =>
  `block rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
  }`

export default function Navbar() {
  const { user, signout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = () => setIsMenuOpen(false)

  const handleSignout = () => {
    closeMenu()
    signout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-2xl items-center gap-2 px-3 py-3 sm:px-4">
        <Link to="/" onClick={closeMenu} className="flex min-w-0 items-center gap-2">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
            RP
          </span>
          <span className="truncate text-base font-semibold text-slate-900 sm:text-lg">
            Route Posts
          </span>
        </Link>

        {/* روابط الديسكتوب */}
        <nav className="ml-2 hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/* بيانات المستخدم + Logout على الديسكتوب */}
          <div className="hidden items-center gap-2 md:flex">
            <Avatar src={user?.photo} alt={user?.name} className="size-9 shrink-0" />
            <div className="hidden leading-tight lg:block">
              <p className="max-w-32 truncate text-sm font-medium text-slate-800">{user?.name}</p>
              <p className="max-w-32 truncate text-xs text-slate-500">@{user?.username}</p>
            </div>
            <button
              type="button"
              onClick={handleSignout}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Logout
            </button>
          </div>

          {/* زرار المنيو على الموبايل */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
            className="grid size-10 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 md:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="size-6"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* قائمة الموبايل */}
      {isMenuOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="mx-auto w-full max-w-2xl space-y-1 px-3 py-3 sm:px-4">
            <div className="mb-2 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <Avatar src={user?.photo} alt={user?.name} className="size-10 shrink-0" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-800">{user?.name}</p>
                <p className="truncate text-xs text-slate-500">@{user?.username}</p>
              </div>
            </div>

            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={closeMenu}
                className={linkClass}
              >
                {item.label}
              </NavLink>
            ))}

            <button
              type="button"
              onClick={handleSignout}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
