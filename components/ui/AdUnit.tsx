'use client'

import React from 'react'

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
  const adRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (adRef.current) {
      adRef.current.innerHTML = ''
      try {
        const range = document.createRange()
        const fragment = range.createContextualFragment(code)
        adRef.current.appendChild(fragment)
      } catch (err) {
        console.error("Ad Injection Error:", err)
      }
    }
  }, [code])

  return (
    <div 
      ref={adRef}
      className={`flex justify-center items-center overflow-hidden w-full ${className || ''}`}
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
