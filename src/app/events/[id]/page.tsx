'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useEvent } from '@/hooks/useEvents'
import { api } from '@/lib/api'
import { formatDate, formatPrice } from '@/lib/utils'
import type { ApiError, Ticket } from '@/types'

const TICKET_TYPES = [
  { value: 'standard', label: 'Standard', multiplier: 1 },
  { value: 'early_bird', label: 'Early Bird (-20%)', multiplier: 0.8 },
  { value: 'vip', label: 'VIP (+50%)', multiplier: 1.5 },
] as const

export default function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { event, loading, error } = useEvent(Number(id))
  const [ticketType, setTicketType] = useState<'standard' | 'early_bird' | 'vip'>('standard')
  const [quantity, setQuantity] = useState(1)
  const [purchasing, setPurchasing] = useState(false)

  async function handlePurchase(e: React.FormEvent) {
    e.preventDefault()
    setPurchasing(true)
    try {
      const ticket = await api.post<Ticket>(`/events/${id}/tickets/purchase`, {
        type: ticketType,
        quantity,
        payment_intent_id: `pi_demo_${Date.now()}`,
      })
      toast.success('Billet acheté avec succès !')
      router.push(`/tickets/${ticket.id}`)
    } catch (err) {
      const apiError = err as ApiError
      toast.error(apiError.message ?? "Erreur lors de l'achat.")
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) return <p className="p-8 text-muted-foreground">Chargement...</p>
  if (error || !event) return <p className="p-8 text-destructive">{error}</p>

  const selectedType = TICKET_TYPES.find((t) => t.value === ticketType)!
  const estimatedPrice = Math.round(event.price_cents * selectedType.multiplier) * quantity

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b px-6 py-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard">← Retour</Link>
        </Button>
      </header>

      <main className="max-w-2xl mx-auto p-6 flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">{event.name}</h1>
          <p className="text-muted-foreground mt-1">{formatDate(event.date)}</p>
        </div>

        {event.description && <p className="text-base leading-7">{event.description}</p>}

        <div className="flex gap-4 flex-wrap">
          <div>
            <p className="text-sm text-muted-foreground">Prix de base</p>
            <p className="font-semibold">{formatPrice(event.price_cents, event.currency)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Capacité restante</p>
            <Badge variant={event.capacity_remaining > 0 ? 'default' : 'destructive'}>
              {event.capacity_remaining > 0 ? `${event.capacity_remaining} places` : 'Complet'}
            </Badge>
          </div>
        </div>

        <Separator />

        {event.capacity_remaining > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Acheter un billet</CardTitle>
              <CardDescription>Choisissez votre type de billet.</CardDescription>
            </CardHeader>
            <form onSubmit={handlePurchase}>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label>Type de billet</Label>
                  <div className="flex gap-2 flex-wrap">
                    {TICKET_TYPES.map((t) => (
                      <Button
                        key={t.value}
                        type="button"
                        variant={ticketType === t.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTicketType(t.value)}
                      >
                        {t.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="quantity">Quantité</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min={1}
                    max={event.capacity_remaining}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-24"
                  />
                </div>

                <p className="font-semibold">
                  Total estimé : {formatPrice(estimatedPrice, event.currency)}
                </p>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={purchasing} className="w-full">
                  {purchasing ? 'Achat en cours...' : 'Acheter'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        ) : (
          <p className="text-muted-foreground">Cet événement est complet.</p>
        )}
      </main>
    </div>
  )
}
