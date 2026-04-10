'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
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
import { useAuth } from '@/hooks/useAuth'
import type { ApiError } from '@/types'

export default function RegisterPage() {
  const { register } = useAuth()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.password !== form.password_confirmation) {
      toast.error('Les mots de passe ne correspondent pas.')
      return
    }
    setLoading(true)
    try {
      await register(form.name, form.email, form.password, form.password_confirmation)
    } catch (err) {
      const error = err as ApiError
      const firstError = error.errors ? Object.values(error.errors)[0]?.[0] : error.message
      toast.error(firstError ?? 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Créer un compte</CardTitle>
          <CardDescription>Rejoignez la billetterie en quelques secondes.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-4">
            {(['name', 'email', 'password', 'password_confirmation'] as const).map((field) => (
              <div key={field} className="flex flex-col gap-1.5">
                <Label htmlFor={field}>
                  {
                    {
                      name: 'Nom',
                      email: 'Email',
                      password: 'Mot de passe',
                      password_confirmation: 'Confirmer le mot de passe',
                    }[field]
                  }
                </Label>
                <Input
                  id={field}
                  name={field}
                  type={
                    field.includes('password') ? 'password' : field === 'email' ? 'email' : 'text'
                  }
                  value={form[field]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Création...' : 'Créer mon compte'}
            </Button>
            <p className="text-muted-foreground text-sm">
              Déjà un compte ?{' '}
              <Link href="/auth/login" className="text-foreground underline underline-offset-4">
                Se connecter
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}
