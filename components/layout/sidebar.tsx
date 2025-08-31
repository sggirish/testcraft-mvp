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
  
  // Function to check if the current path matches or starts with the nav item's href
  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    // For other pages, check if pathname starts with the href
    // This handles both /projects and /projects/[id]
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800">
      <div className="flex flex-col h-full p-4">
        {/* Logo */}
        <div className="mb-8">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <TestTube2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">TestCraft</span>
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-lg transition-all',
                  active
                    ? 'bg-purple-900/30 text-purple-400 border border-purple-800/50'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5",
                  active ? "text-purple-400" : "text-gray-400"
                )} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-gray-800 pt-4 space-y-1">
          {bottomNavigation.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-lg transition-all',
                  active
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
          
          <button
            onClick={() => signOut()}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all text-gray-400 hover:bg-gray-800 hover:text-gray-200 w-full"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}