'use client'

import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode;
  onReset: () => void;
}

interface State {
  hasError: boolean;
}

class EditorErrorBoundary extends Component<Props, State> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Editor Crash Caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-red-500/20 rounded-2xl bg-red-500/5 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black uppercase tracking-widest text-red-500">Editor crashed</h3>
            <p className="text-xs text-neutral-500 max-w-xs">Don't worry, your content is likely safe. Try reloading the editor below.</p>
          </div>
          <button 
            onClick={() => {
              this.setState({ hasError: false })
              this.props.onReset()
            }}
            className="px-8 py-3 bg-red-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-white hover:text-red-500 transition-all shadow-lg"
          >
            Reload Editor
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default EditorErrorBoundary
