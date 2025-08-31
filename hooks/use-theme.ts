// hooks/use-theme.ts
'use client'

import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Check localStorage for saved theme
    const savedTheme = localStorage.getItem('theme') as Theme | null
    
    if (savedTheme) {
      setTheme(savedTheme)
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark')
        document.documentElement.style.setProperty('--background', '0 0% 2%')
        document.documentElement.style.setProperty('--foreground', '0 0% 98%')
      } else {
        document.documentElement.classList.remove('dark')
        document.documentElement.style.setProperty('--background', '0 0% 98%')
        document.documentElement.style.setProperty('--foreground', '0 0% 2%')
      }
    } else {
      // Default to dark theme
      setTheme('dark')
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
      document.documentElement.style.setProperty('--background', '0 0% 2%')
      document.documentElement.style.setProperty('--foreground', '0 0% 98%')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.style.setProperty('--background', '0 0% 98%')
      document.documentElement.style.setProperty('--foreground', '0 0% 2%')
    }
  }

  const setThemeMode = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
      document.documentElement.style.setProperty('--background', '0 0% 2%')
      document.documentElement.style.setProperty('--foreground', '0 0% 98%')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.style.setProperty('--background', '0 0% 98%')
      document.documentElement.style.setProperty('--foreground', '0 0% 2%')
    }
  }

  // Prevent flash of incorrect theme
  if (!mounted) {
    return { theme: 'dark' as Theme, toggleTheme: () => {}, setThemeMode: () => {} }
  }

  return { theme, toggleTheme, setThemeMode }
}