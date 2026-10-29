import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { getMyProfile, signinUser, signupUser } from '@/api/users.api'
import { clearSession, getToken, getUser, setToken, setUser } from '@/utils/storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => getUser())
  const [isBootstrapping, setIsBootstrapping] = useState(true)

  // عند فتح التطبيق: نتأكد إن التوكن المخزّن لسه صالح ونجيب بيانات المستخدم المحدّثة
  useEffect(() => {
    if (!getToken()) {
      setIsBootstrapping(false)
      return
    }

    let isMounted = true

    getMyProfile()
      .then((res) => {
        if (!isMounted) return
        setUserState(res.data.user)
        setUser(res.data.user)
      })
      .catch(() => {
        // الـ 401 متعامل معاه في الـ axios interceptor
      })
      .finally(() => {
        if (isMounted) setIsBootstrapping(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const startSession = useCallback((session) => {
    setToken(session.token)
    setUser(session.user)
    setUserState(session.user)
    return session.user
  }, [])

  const signin = useCallback(
    async (payload) => {
      const res = await signinUser(payload)
      return startSession(res.data)
    },
    [startSession],
  )

  const signup = useCallback(
    async (payload) => {
      const res = await signupUser(payload)
      return startSession(res.data)
    },
    [startSession],
  )

  const signout = useCallback(() => {
    clearSession()
    setUserState(null)
  }, [])

  const updateUser = useCallback((nextUser) => {
    setUser(nextUser)
    setUserState(nextUser)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isBootstrapping,
      signin,
      signup,
      signout,
      updateUser,
    }),
    [user, isBootstrapping, signin, signup, signout, updateUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
