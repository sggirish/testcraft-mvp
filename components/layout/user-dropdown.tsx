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
        className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all"
      >
        {user.image ? (
          <img 
            src={user.image} 
            alt={user.name || ''} 
            className="h-6 w-6 rounded-full"
          />
        ) : (
          <UserCircle className="h-6 w-6 text-gray-400" />
        )}
        <span className="hidden sm:block text-sm text-gray-200">{user.name || user.email}</span>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 z-50">
          <GlassCard className="p-2" variant="dark">
            <div className="px-3 py-2 border-b border-gray-800">
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
            
            <div className="py-1">
              <Link
                href="/settings/profile"
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
              
              <Link
                href="/settings"
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
              
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg w-full text-left"
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