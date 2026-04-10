'use client'

import { use, useState, useEffect } from 'react'
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
import { Separator } from '@/components/ui/separator'
import { api } from '@/lib/api'
import { formatDate, formatPrice } from '@/lib/utils'
import type { ApiError, Ticket } from '@/types'

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

export default function TicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    api
      .get<Ticket>(`/tickets/${id}`)
      .then(setTicket)
      .catch(() => toast.error('Billet introuvable.'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleCancel() {
    if (!confirm('Annuler ce billet ?')) return
    setCancelling(true)
    try {
      await api.post(`/tickets/${id}/cancel`, {})
      setTicket((prev) => (prev ? { ...prev, status: 'cancelled' } : prev))
      toast.success('Billet annulé.')
    } catch (err) {
      const error = err as ApiError
      toast.error(error.message ?? "Impossible d'annuler ce billet.")
    } finally {
      setCancelling(false)
    }
  }

  if (loading) return <p className="p-8 text-muted-foreground">Chargement...</p>
  if (!ticket) return <p className="p-8 text-destructive">Billet introuvable.</p>

  const isCancellable = ticket.status === 'pending' || ticket.status === 'confirmed'

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b px-6 py-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard">← Retour</Link>
        </Button>
      </header>

      <main className="max-w-md mx-auto p-6">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Billet #{ticket.id}</CardTitle>
                <CardDescription>
                  {ticket.event ? ticket.event.title : `Événement #${ticket.event_id}`}
                </CardDescription>
              </div>
              <Badge variant={STATUS_VARIANTS[ticket.status]}>{STATUS_LABELS[ticket.status]}</Badge>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col gap-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Type</span>
              <span className="font-medium">{TYPE_LABELS[ticket.type]}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Prix payé</span>
              <span className="font-medium">
                {formatPrice(ticket.price_cents, ticket.currency)}
              </span>
            </div>
            {ticket.event && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{formatDate(ticket.event.date)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Référence paiement</span>
              <span className="font-mono text-xs">{ticket.payment_intent_id}</span>
            </div>

            {ticket.qr_token && (
              <>
                <Separator />
                <div className="flex flex-col items-center gap-2 py-2">
                  <p className="text-sm text-muted-foreground">Token QR</p>
                  <p className="font-mono text-sm break-all">{ticket.qr_token}</p>
                </div>
              </>
            )}
          </CardContent>

          {isCancellable && (
            <CardFooter>
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleCancel}
                disabled={cancelling}
              >
                {cancelling ? 'Annulation...' : 'Annuler ce billet'}
              </Button>
            </CardFooter>
          )}
        </Card>
      </main>
    </div>
  )
}
