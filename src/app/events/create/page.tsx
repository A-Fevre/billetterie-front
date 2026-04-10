'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/lib/api'
import type { ApiError, Event } from '@/types'

export default function CreateEventPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    location: '',
    date: '',
    capacity: '',
    price_cents: '',
    currency: 'EUR',
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, router])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const event = await api.post<Event>('/events', {
        name: form.name,
        description: form.description || null,
        location: form.location,
        date: form.date,
        capacity: Number(form.capacity),
        price_cents: Math.round(parseFloat(form.price_cents) * 100),
        currency: form.currency,
      })
      toast.success('Événement créé avec succès !')
      router.push(`/events/${event.id}`)
    } catch (err) {
      const error = err as ApiError
      const firstError = error.errors ? Object.values(error.errors)[0]?.[0] : error.message
      toast.error(firstError ?? 'Erreur lors de la création.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b px-6 py-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard">← Retour</Link>
        </Button>
      </header>

      <main className="max-w-lg mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Créer un événement</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Nom</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} required />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="location">Lieu</Label>
                <Input
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="datetime-local"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col gap-1.5 flex-1">
                  <Label htmlFor="capacity">Capacité</Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min={1}
                    value={form.capacity}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <Label htmlFor="price_cents">Prix (€)</Label>
                  <Input
                    id="price_cents"
                    name="price_cents"
                    type="number"
                    min={0}
                    step={0.01}
                    value={form.price_cents}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Création...' : "Créer l'événement"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  )
}
