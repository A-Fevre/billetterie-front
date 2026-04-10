export interface User {
  id: number
  name: string
  email: string
  created_at: string
}

export interface AuthResponse {
  user: User
}

export interface Event {
  id: number
  name: string
  description: string | null
  location: string
  date: string
  capacity: number
  capacity_remaining: number
  price_cents: number
  currency: string
  is_published: boolean
  user_id: number
  created_at: string
}

export interface PaginatedEvents {
  data: Event[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface Ticket {
  id: number
  user_id: number
  event_id: number
  type: 'standard' | 'early_bird' | 'vip'
  status: 'pending' | 'confirmed' | 'cancelled'
  price_cents: number
  currency: string
  payment_intent_id: string
  qr_token: string | null
  created_at: string
  event?: Event
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}
