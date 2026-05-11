'use client'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

interface AdUnitProps {
  code: string
  className?: string
  minHeight?: number
  id?: string
}

export default function AdUnit({ 
  code, 
  className, 
  minHeight = 90,
  id 
}: AdUnitProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  
  // Never show in admin
  if (pathname?.startsWith('/admin')) return null
  
  useEffect(() => {
    if (!containerRef.current || !code) return
    
    // Clear container
    containerRef.current.innerHTML = ''
    
    // Parse HTML string into DOM nodes
    const fragment = document.createRange()
      .createContextualFragment(code)
    
    // Find all script tags in the fragment
    const scripts = fragment.querySelectorAll('script')
    
    // Append non-script content first
    containerRef.current.appendChild(fragment)
    
    // Re-create and append each script tag
    // (cloned scripts DO execute)
    scripts.forEach(originalScript => {
      const newScript = document.createElement('script')
      
      // Copy all attributes
      Array.from(originalScript.attributes)
        .forEach(attr => {
          newScript.setAttribute(attr.name, attr.value)
        })
      
      // Copy inline script content
      if (originalScript.innerHTML) {
        newScript.innerHTML = originalScript.innerHTML
      }
      
      containerRef.current?.appendChild(newScript)
    })
    
  }, [code])
  
  return (
    <div
      ref={containerRef}
      id={id}
      className={className}
      style={{ 
        minHeight,
        overflow: 'hidden',
        display: 'block',
        width: '100%'
      }}
    />
  )
}

