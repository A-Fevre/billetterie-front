'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/dashboard', label: 'Événements' },
  { href: '/tickets', label: 'Mes billets' },
]

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  async function handleLogout() {
    try {
      await logout()
    } catch {
      toast.error('Erreur lors de la déconnexion.')
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="font-semibold text-base tracking-tight">
              Billetterie
            </Link>
            <nav className="hidden sm:flex items-center gap-1">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-sm transition-colors',
                    pathname === href || pathname.startsWith(href + '/')
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
                  )}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={handleLogout}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  )
}
