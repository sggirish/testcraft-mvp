'use client'

import { useSession } from 'next-auth/react'
import { Menu, Bell, Search } from 'lucide-react'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassInput } from '@/components/ui/glass-input'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { UserDropdown } from './user-dropdown'

interface HeaderProps {
  onMenuClick?: () => void
  showMenu?: boolean
}

export function Header({ onMenuClick, showMenu = false }: HeaderProps) {
  const { data: session } = useSession()

  return (
    <header className="glass-header px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          {showMenu && (
            <GlassButton
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </GlassButton>
          )}
          
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <GlassInput
              type="search"
              placeholder="Search tests, projects..."
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <GlassButton variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </GlassButton>
          
          <ThemeToggle />
          
          {session?.user && <UserDropdown user={session.user} />}
        </div>
      </div>
    </header>
  )
}