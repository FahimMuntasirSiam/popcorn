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
  return (
    <div 
      className={`flex justify-center items-center overflow-hidden w-full ${className || ''}`}
      style={{ minHeight }}
    >
      <iframe
        title="Advertisement"
        style={{ width: '100%', height: '100%', border: 'none', minHeight }}
        srcDoc={`
          <html>
            <body style="margin:0; padding:0; display:flex; justify-content:center; align-items:center; background:transparent;">
              ${code}
            </body>
          </html>
        `}
      />
    </div>
  )
}

export default function AdUnit(props: AdUnitProps) {
  return (
    <AdErrorBoundary>
      <AdUnitContent {...props} />
    </AdErrorBoundary>
  )
}
