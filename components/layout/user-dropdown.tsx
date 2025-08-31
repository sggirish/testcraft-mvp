'use client'

import { useState, useRef, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  UserCircle 
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'

interface UserDropdownProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function UserDropdown({ user }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 glass-button px-3 py-2"
      >
        {user.image ? (
          <img 
            src={user.image} 
            alt={user.name || ''} 
            className="h-6 w-6 rounded-full"
          />
        ) : (
          <UserCircle className="h-6 w-6" />
        )}
        <span className="hidden sm:block text-sm">{user.name || user.email}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 z-50">
          <GlassCard className="p-2">
            <div className="px-3 py-2 border-b border-border">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            
            <div className="py-1">
              <Link
                href="/settings/profile"
                className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-foreground/5 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
              
              <Link
                href="/settings"
                className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-foreground/5 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
              
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-foreground/5 rounded-lg w-full text-left"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  )
}