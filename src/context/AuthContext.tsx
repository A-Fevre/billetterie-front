'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import type { AuthResponse, User } from '@/types'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (
    name: string,
    email: string,
    password: string,
    password_confirmation: string,
  ) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null
    const raw = localStorage.getItem('user')
    return raw ? (JSON.parse(raw) as User) : null
  })

  const isAuthenticated = user !== null

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      const data = await api.post<AuthResponse>('/auth/login', { email, password })
      setUser(data.user)
      router.push('/dashboard')
    },
    [router],
  )

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      password_confirmation: string,
    ): Promise<void> => {
      const data = await api.post<AuthResponse>('/auth/register', {
        name,
        email,
        password,
        password_confirmation,
      })
      setUser(data.user)
      router.push('/dashboard')
    },
    [router],
  )

  const logout = useCallback(async (): Promise<void> => {
    try {
      await api.post('/auth/logout', {})
    } finally {
      setUser(null)
      router.push('/auth/login')
    }
  }, [router])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
