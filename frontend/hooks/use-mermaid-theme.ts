"use client"

import { useState, useCallback } from 'react'
import { MermaidThemeConfig } from '@/lib/mermaid-manager'

export function useMermaidTheme() {
  const [themeConfig, setThemeConfig] = useState<MermaidThemeConfig>({
    theme: 'default',
    look: 'classic',
    darkMode: false,
    fontFamily: 'Arial, sans-serif',
    fontSize: 16,
  })

  const updateTheme = useCallback((updates: Partial<MermaidThemeConfig>) => {
    setThemeConfig(prev => ({ ...prev, ...updates }));
  }, [])

  const resetTheme = useCallback(() => {
    setThemeConfig({
      theme: 'default',
      look: 'classic',
      darkMode: false,
      fontFamily: 'Arial, sans-serif',
      fontSize: 16,
    })
  }, [])

  return {
    themeConfig,
    updateTheme,
    resetTheme,
  }
}