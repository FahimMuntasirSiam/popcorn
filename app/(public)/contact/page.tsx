import React from 'react'
import { Mail, MessageSquare, Send, Globe } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="bg-popcorn-dark min-h-screen text-white pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-6 space-y-20">
        
        {/* Header */}
        <header className="text-center space-y-6">
          <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">Get In Touch</h1>
          <p className="text-popcorn-secondary text-lg max-w-xl mx-auto">
            Have questions, feedback, or business inquiries? Our team is ready to listen.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Methods */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-popcorn-card border border-white/5 p-8 rounded-3xl space-y-4 hover:border-popcorn-red transition-colors">
              <Mail className="text-popcorn-red" size={24} />
              <h3 className="text-sm font-black uppercase tracking-widest text-white">Email Us</h3>
              <p className="text-popcorn-secondary text-xs">fahimmuntasirsiam@gmail.com</p>
            </div>

            <div className="bg-popcorn-card border border-white/5 p-8 rounded-3xl space-y-4 hover:border-popcorn-red transition-colors">
              <Globe className="text-popcorn-red" size={24} />
              <h3 className="text-sm font-black uppercase tracking-widest text-white">Global Support</h3>
              <p className="text-popcorn-secondary text-xs">Available 24/7 for movie news and inquiries.</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-popcorn-card border border-white/5 p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
             <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-popcorn-secondary ml-1">Name</label>
                    <input type="text" className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-popcorn-red transition-all" placeholder="Enter name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-popcorn-secondary ml-1">Email</label>
                    <input type="email" className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-popcorn-red transition-all" placeholder="Enter email" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-popcorn-secondary ml-1">Message</label>
                  <textarea rows={6} className="w-full bg-black/40 border border-white/5 rounded-3xl p-6 text-sm font-bold focus:outline-none focus:border-popcorn-red transition-all resize-none" placeholder="How can we help?"></textarea>
                </div>

                <button type="submit" className="w-full bg-popcorn-red text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center space-x-3 hover:bg-white hover:text-popcorn-red transition-all shadow-xl active:scale-[0.98]">
                   <span>Send Message</span>
                   <Send size={16} />
                </button>
             </form>
          </div>
        </div>

      </div>
    </div>
  )
}
