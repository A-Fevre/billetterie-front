import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b px-6 h-14 flex items-center">
        <span className="font-semibold text-base tracking-tight">Billetterie</span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center gap-8 px-6 text-center">
        <div className="flex flex-col gap-3 max-w-lg">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Vos billets, en un clic.
          </h1>
          <p className="text-muted-foreground text-lg">
            Découvrez les événements disponibles, achetez vos billets et gérez-les depuis un seul
            endroit.
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild size="lg">
            <Link href="/auth/login">Se connecter</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/auth/register">Créer un compte</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
