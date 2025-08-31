'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/use-theme'
import { GlassButton } from './glass-button'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <GlassButton
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-gray-400" />
      ) : (
        <Moon className="h-5 w-5 text-gray-400" />
      )}
    </GlassButton>
  )
}