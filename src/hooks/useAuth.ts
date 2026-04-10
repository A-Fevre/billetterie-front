'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { api } from '@/lib/api'
import type { AuthResponse } from '@/types'

export function useAuth() {
  const router = useRouter()

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      const data = await api.post<AuthResponse>('/auth/login', {
        email,
        password,
      })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
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
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      router.push('/dashboard')
    },
    [router],
  )

  const logout = useCallback(async (): Promise<void> => {
    try {
      await api.post('/auth/logout', {})
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/auth/login')
    }
  }, [router])

  const getUser = useCallback(() => {
    if (typeof window === 'undefined') return null
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  }, [])

  const isAuthenticated = useCallback(() => {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem('token')
  }, [])

  return { login, register, logout, getUser, isAuthenticated }
}
