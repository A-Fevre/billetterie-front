'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { useTickets } from '@/hooks/useTickets'
import { formatDate, formatPrice } from '@/lib/utils'
import type { Ticket } from '@/types'

const STATUS_LABELS: Record<Ticket['status'], string> = {
  pending: 'En attente',
  confirmed: 'Confirmé',
  cancelled: 'Annulé',
}

const STATUS_VARIANTS: Record<Ticket['status'], 'default' | 'secondary' | 'destructive'> = {
  pending: 'secondary',
  confirmed: 'default',
  cancelled: 'destructive',
}

const TYPE_LABELS: Record<Ticket['type'], string> = {
  standard: 'Standard',
  early_bird: 'Early Bird',
  vip: 'VIP',
}

export default function MyTicketsPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { tickets, loading, error } = useTickets()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b px-6 py-4 flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard">← Retour</Link>
        </Button>
        <h1 className="text-xl font-semibold">Mes billets</h1>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {loading && <p className="text-muted-foreground">Chargement...</p>}
        {error && <p className="text-destructive">{error}</p>}

        {!loading && !error && tickets.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">Vous n&apos;avez pas encore de billets.</p>
            <Button asChild>
              <Link href="/dashboard">Voir les événements</Link>
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickets.map((ticket) => (
            <Card key={ticket.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base line-clamp-2">
                    {ticket.event ? ticket.event.name : `Événement #${ticket.event_id}`}
                  </CardTitle>
                  <Badge variant={STATUS_VARIANTS[ticket.status]} className="shrink-0">
                    {STATUS_LABELS[ticket.status]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium">{TYPE_LABELS[ticket.type]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prix</span>
                  <span className="font-medium">
                    {formatPrice(ticket.price_cents, ticket.currency)}
                  </span>
                </div>
                {ticket.event && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">{formatDate(ticket.event.date)}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href={`/tickets/${ticket.id}`}>Voir le billet</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
