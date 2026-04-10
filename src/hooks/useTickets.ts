'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import type { Ticket } from '@/types'

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    api
      .get<Ticket[]>('/tickets')
      .then((data) => {
        if (!cancelled) setTickets(data)
      })
      .catch(() => {
        if (!cancelled) setError('Impossible de charger vos billets.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { tickets, loading, error }
}
