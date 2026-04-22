import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-popcorn-dark border-t border-white/10 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="text-2xl font-bold text-white mb-4 block">🍿 Popcorn</span>
            <p className="text-popcorn-secondary text-sm max-w-xs">
              Your ultimate destination for the latest movies, blog posts, and trailers. 
              Stay updated with the entertainment world.
            </p>
          </div>
          
          <div className="flex flex-col space-y-4">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider">Quick Links</h3>
            <Link href="/about" className="text-popcorn-secondary hover:text-white text-sm transition-colors">About Us</Link>
            <Link href="/contact" className="text-popcorn-secondary hover:text-white text-sm transition-colors">Contact</Link>
            <Link href="/dmca" className="text-popcorn-secondary hover:text-white text-sm transition-colors">DMCA</Link>
          </div>

          <div className="flex flex-col space-y-4">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider">Legal</h3>
            <p className="text-popcorn-secondary text-xs italic">
              All content is for entertainment purposes only. popcorn.com does not host any 
              files on its server. All contents are provided by non-affiliated third parties. 
            </p>
            <p className="text-popcorn-secondary text-xs mt-4">
              © {new Date().getFullYear()} Popcorn Hub. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
