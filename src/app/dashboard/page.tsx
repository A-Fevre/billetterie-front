'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { useEvents } from '@/hooks/useEvents'
import { formatPrice, formatDate } from '@/lib/utils'

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, logout, user } = useAuth()
  const { data, loading } = useEvents()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, router])

  async function handleLogout() {
    try {
      await logout()
    } catch {
      toast.error('Erreur lors de la déconnexion.')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Billetterie</h1>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground text-sm">{user?.name}</span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Se déconnecter
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Événements disponibles</h2>

        {loading && <p className="text-muted-foreground">Chargement des événements...</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.data.map((event) => (
            <Card key={event.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                <CardDescription>{formatDate(event.date)}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {event.description ?? 'Aucune description.'}
                </p>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">
                    {formatPrice(event.price_cents, event.currency)}
                  </span>
                  <Badge variant={event.capacity_remaining > 0 ? 'default' : 'destructive'}>
                    {event.capacity_remaining > 0
                      ? `${event.capacity_remaining} places`
                      : 'Complet'}
                  </Badge>
                </div>
                <Button asChild size="sm" disabled={event.capacity_remaining === 0}>
                  <Link href={`/events/${event.id}`}>Voir</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
