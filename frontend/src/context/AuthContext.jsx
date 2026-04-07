import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../services/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('auth_user')
    const token = localStorage.getItem('access_token')
    if (stored && token) {
      setUser(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  const _persist = (userData, accessToken, refreshToken) => {
    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('refresh_token', refreshToken)
    localStorage.setItem('auth_user', JSON.stringify(userData))
    setUser(userData)
  }

  const register = useCallback(async (name, email, password) => {
    const data = await authApi.register({ name, email, password })
    _persist(data.user, data.access_token, data.refresh_token)
    return data.user
  }, [])

  const login = useCallback(async (email, password) => {
    const data = await authApi.login({ email, password })
    _persist(data.user, data.access_token, data.refresh_token)
    return data.user
  }, [])

  const googleLogin = useCallback(async (credential) => {
    const data = await authApi.googleLogin(credential)
    _persist(data.user, data.access_token, data.refresh_token)
    return data.user
  }, [])

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem('refresh_token')
    if (refreshToken) {
      authApi.logout(refreshToken).catch(() => {})
    }
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('auth_user')
    setUser(null)
  }, [])

  // Called by the axios interceptor to silently refresh the access token
  const refreshAccessToken = useCallback(async () => {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) throw new Error('No refresh token')
    const data = await authApi.refresh(refreshToken)
    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token)
    localStorage.setItem('auth_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.access_token
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, register, login, googleLogin, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
