'use client'

import { useState, useCallback } from 'react'

export function useClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setError(null)
      
      setTimeout(() => {
        setCopied(false)
      }, timeout)
    } catch (err) {
      setCopied(false)
      setError(err as Error)
    }
  }, [timeout])
  
  const reset = useCallback(() => {
    setCopied(false)
    setError(null)
  }, [])
  
  return { copied, error, copy, reset }
}