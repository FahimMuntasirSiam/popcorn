'use client'

import { usePathname } from 'next/navigation'
import Script from 'next/script'

export default function GlobalAds() {
  const pathname = usePathname()
  
  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <>
      {/* SOCIAL BAR AD */}
      <Script 
        id="social-bar-ad"
        src="https://pl29300532.profitablecpmratenetwork.com/cb/84/86/cb84861c3dec1995f49a5b34cd3e2a06.js"
        strategy="afterInteractive"
      />
    </>
  )
}
