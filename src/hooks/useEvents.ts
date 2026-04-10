'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import type { Event, PaginatedEvents } from '@/types'

export function useEvents(page = 1) {
  const [data, setData] = useState<PaginatedEvents | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    api
      .get<PaginatedEvents>(`/events?page=${page}`)
      .then((d) => {
        if (!cancelled) setData(d)
      })
      .catch(() => {
        if (!cancelled) setError('Impossible de charger les événements.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [page])

  return { data, loading, error }
}

export function useEvent(id: number) {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .get<Event>(`/events/${id}`)
      .then(setEvent)
      .catch(() => setError('Événement introuvable.'))
      .finally(() => setLoading(false))
  }, [id])

  return { event, loading, error }
}
