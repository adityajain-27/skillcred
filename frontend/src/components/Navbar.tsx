import { useState } from 'react'
import type { Screen } from '../data/schemes'

type Props = {
  screen: Screen
  setScreen: (s: Screen) => void
}

export default function Navbar({ screen, setScreen }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)

  const links: { label: string; target: Screen }[] = [
    { label: 'Home', target: 'home' },
    { label: 'Check Eligibility', target: 'eligibility' },
    { label: 'Browse Schemes', target: 'schemes' },
    { label: 'How It Works', target: 'home' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      {/* Tricolor top stripe */}
      <div className="h-1 tricolor-stripe" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => setScreen('home')}
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 36 36" width="22" height="22" fill="none">
                <circle cx="18" cy="18" r="10" stroke="white" strokeWidth="2" />
                <circle cx="18" cy="18" r="3" fill="white" />
                <line x1="18" y1="8" x2="18" y2="4" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <line x1="18" y1="28" x2="18" y2="32" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <line x1="8" y1="18" x2="4" y2="18" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <line x1="28" y1="18" x2="32" y2="18" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="leading-tight text-left">
              <div className="text-sm font-semibold text-navy">NagrikSeva</div>
              <div className="text-[10px] text-muted leading-none">Government Services Portal</div>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(({ label, target }) => (
              <button
                key={label}
                onClick={() => setScreen(target)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  screen === target && target !== 'home'
                    ? 'text-navy bg-saffron-light font-semibold'
                    : 'text-ink hover:text-navy hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <button className="flex items-center gap-1.5 text-sm text-muted hover:text-navy transition-colors px-2 py-1.5 rounded-md hover:bg-slate-50">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              EN | हिंदी
            </button>
            <button
              onClick={() => setScreen('eligibility')}
              className="bg-forest hover:bg-forest/90 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all active:scale-95"
            >
              Get Started →
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-ink hover:text-navy"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-3 space-y-1">
          {links.map(({ label, target }) => (
            <button
              key={label}
              onClick={() => { setScreen(target); setMenuOpen(false) }}
              className="block w-full text-left px-3 py-2.5 text-sm font-medium text-ink hover:text-navy hover:bg-slate-50 rounded-md"
            >
              {label}
            </button>
          ))}
          <div className="pt-2 border-t border-border">
            <button
              onClick={() => { setScreen('eligibility'); setMenuOpen(false) }}
              className="w-full bg-forest text-white text-sm font-semibold px-5 py-2.5 rounded-lg"
            >
              Get Started →
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
