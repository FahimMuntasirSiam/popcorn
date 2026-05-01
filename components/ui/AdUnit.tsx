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
        const div = document.createElement('div')
        div.innerHTML = code
        const scripts = Array.from(div.querySelectorAll('script'))
        
        scripts.forEach(oldScript => {
          const newScript = document.createElement('script')
          Array.from(oldScript.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value)
          })
          newScript.innerHTML = oldScript.innerHTML
          adRef.current?.appendChild(newScript)
        })

        // Also append non-script content
        const nonScripts = Array.from(div.childNodes).filter(node => node.nodeName !== 'SCRIPT')
        nonScripts.forEach(node => {
          adRef.current?.appendChild(node.cloneNode(true))
        })
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
