'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  Home, 
  FolderOpen, 
  TestTube2, 
  Play, 
  BarChart3, 
  Settings,
  HelpCircle,
  LogOut,
  Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { signOut } from 'next-auth/react'
import { GlassButton } from '@/components/ui/glass-button'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'Tests', href: '/tests', icon: TestTube2 },
  { name: 'Test Builder', href: '/builder', icon: Plus },
  { name: 'Results', href: '/results', icon: BarChart3 },
  { name: 'Runs', href: '/runs', icon: Play },
]

const bottomNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help', href: '/help', icon: HelpCircle },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed left-0 top-0 h-full w-64 glass-sidebar">
      <div className="flex flex-col h-full p-6">
        {/* Logo */}
        <div className="mb-8">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-foreground/10 flex items-center justify-center">
              <TestTube2 className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold">TestCraft</span>
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-lg transition-all',
                  isActive
                    ? 'bg-foreground/10 text-foreground'
                    : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-border pt-4 space-y-1">
          {bottomNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-lg transition-all',
                  isActive
                    ? 'bg-foreground/10 text-foreground'
                    : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
          
          <button
            onClick={() => signOut()}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all text-muted-foreground hover:bg-foreground/5 hover:text-foreground w-full"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}