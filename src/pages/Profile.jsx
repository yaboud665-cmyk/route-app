import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { getMyProfile } from '@/api/users.api'
import Alert from '@/components/Alert'
import Avatar from '@/components/Avatar'
import Spinner from '@/components/Spinner'
import { useAuth } from '@/context/AuthContext'
import { getErrorMessage } from '@/utils/errors'
import { formatDate } from '@/utils/formatDate'

const STATS = [
  { key: 'followersCount', label: 'Followers' },
  { key: 'followingCount', label: 'Following' },
  { key: 'bookmarksCount', label: 'Bookmarks' },
]

export default function Profile() {
  const { user, updateUser } = useAuth()

  const [profile, setProfile] = useState(user)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // GET /users/profile-data
  useEffect(() => {
    let isActive = true

    getMyProfile()
      .then((res) => {
        if (!isActive) return
        setProfile(res.data.user)
        updateUser(res.data.user)
      })
      .catch((err) => {
        if (isActive) setError(getErrorMessage(err))
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [updateUser])

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="size-8" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && <Alert>{error}</Alert>}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-28 bg-gradient-to-r from-indigo-500 to-purple-500" />

        <div className="flex flex-col items-center gap-3 px-6 pb-6 text-center">
          <Avatar
            src={profile?.photo}
            alt={profile?.name}
            className="-mt-12 size-24 border-4 border-white"
          />

          <div>
            <h1 className="text-xl font-bold text-slate-900">{profile?.name}</h1>
            <p className="text-sm text-slate-500">@{profile?.username}</p>
          </div>

          <p className="text-sm text-slate-600">{profile?.email}</p>

          <div className="grid w-full grid-cols-3 gap-3 pt-2">
            {STATS.map((stat) => (
              <div key={stat.key} className="rounded-xl bg-slate-50 py-3">
                <p className="text-lg font-bold text-slate-900">{profile?.[stat.key] ?? 0}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>

          <Link
            to="/change-password"
            className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Change password
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-700">Account information</h2>

        <dl className="mt-3 divide-y divide-slate-100 text-sm">
          <div className="flex justify-between gap-4 py-2">
            <dt className="shrink-0 text-slate-500">Username</dt>
            <dd className="truncate text-right font-medium text-slate-800">{profile?.username}</dd>
          </div>
          <div className="flex justify-between gap-4 py-2">
            <dt className="shrink-0 text-slate-500">Email</dt>
            <dd className="min-w-0 text-right font-medium break-all text-slate-800">
              {profile?.email}
            </dd>
          </div>
          <div className="flex justify-between gap-4 py-2">
            <dt className="shrink-0 text-slate-500">Gender</dt>
            <dd className="truncate text-right font-medium text-slate-800 capitalize">
              {profile?.gender}
            </dd>
          </div>
          <div className="flex justify-between gap-4 py-2">
            <dt className="shrink-0 text-slate-500">Date of birth</dt>
            <dd className="truncate text-right font-medium text-slate-800">
              {formatDate(profile?.dateOfBirth)}
            </dd>
          </div>
          <div className="flex justify-between gap-4 py-2">
            <dt className="shrink-0 text-slate-500">Joined</dt>
            <dd className="truncate text-right font-medium text-slate-800">
              {formatDate(profile?.createdAt)}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  )
}
