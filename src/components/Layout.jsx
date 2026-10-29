import { Outlet } from 'react-router-dom'

import Navbar from '@/components/Navbar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="mx-auto w-full max-w-2xl px-3 py-5 sm:px-4 sm:py-6">
        <Outlet />
      </main>
    </div>
  )
}
