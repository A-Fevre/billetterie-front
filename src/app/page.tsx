import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold tracking-tight">Billetterie</h1>
      <p className="text-muted-foreground text-lg">Achetez et gérez vos billets en ligne.</p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/auth/login">Se connecter</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/auth/register">Créer un compte</Link>
        </Button>
      </div>
    </main>
  )
}
