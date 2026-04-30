'use client'

import React, { useEffect, useRef } from 'react'

interface AdUnitProps {
  code: string
  className?: string
  minHeight?: string
}

class AdErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("AdUnit Error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return null // Hide ads if they crash
    }
    return this.props.children
  }
}

const AdUnitContent = ({ code, className, minHeight = '50px' }: AdUnitProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Clear previous content
    containerRef.current.innerHTML = ''

    // Create a new div to hold the ad to avoid affecting the main container directly
    const adContainer = document.createElement('div')
    containerRef.current.appendChild(adContainer)

    // Parse and execute scripts
    const range = document.createRange()
    const documentFragment = range.createContextualFragment(code)
    
    // Append the fragment (this will trigger script execution if using createContextualFragment)
    adContainer.appendChild(documentFragment)

    // For scripts that don't execute via fragment (some browsers/Next.js versions)
    const scripts = adContainer.querySelectorAll('script')
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script')
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value)
      })
      if (oldScript.innerHTML) {
        newScript.innerHTML = oldScript.innerHTML
      }
      oldScript.parentNode?.replaceChild(newScript, oldScript)
    })
  }, [code])

  return (
    <div 
      ref={containerRef} 
      className={`flex justify-center items-center overflow-hidden ${className || ''}`}
      style={{ minHeight }}
    />
  )
}

export default function AdUnit(props: AdUnitProps) {
  return (
    <AdErrorBoundary>
      <AdUnitContent {...props} />
    </AdErrorBoundary>
  )
}
