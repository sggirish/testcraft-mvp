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
    <header className="sticky top-0 z-30 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 px-6 py-4">
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
            <GlassInput
              type="search"
              placeholder="Search tests, projects..."
              icon={<Search className="h-4 w-4" />}
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