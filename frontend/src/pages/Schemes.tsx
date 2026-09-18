import { useState, useMemo } from 'react'
import { schemes, categories } from '../data/schemes'
import type { Screen } from '../data/schemes'

type Props = { setScreen: (s: Screen) => void }

export default function Schemes({ setScreen }: Props) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [compareIds, setCompareIds] = useState<string[]>([])

  const filtered = useMemo(() => {
    return schemes.filter(s => {
      const matchCat = activeCategory === 'all' || s.category === activeCategory
      const matchQ = !query || s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.ministry.toLowerCase().includes(query.toLowerCase()) ||
        s.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
      return matchCat && matchQ
    })
  }, [activeCategory, query])

  const toggleCompare = (id: string) => {
    setCompareIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : prev.length < 3 ? [...prev, id] : prev
    )
  }

  return (
    <div className="page-enter min-h-screen bg-cream">
      {/* Page header */}
      <div className="bg-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-white/50 text-sm font-semibold uppercase tracking-widest mb-2">Scheme Directory</p>
          <h1 className="font-display text-4xl sm:text-5xl text-white mb-3">Explore All Schemes</h1>
          <p className="text-white/60 max-w-xl">
            Browse and compare government schemes side by side. Find the ones that match your needs.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Search + filter row */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search schemes, ministry, or keywords..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all"
            />
          </div>
          <button className="flex items-center gap-2 border border-border bg-white px-5 py-3 rounded-xl text-sm font-medium text-ink hover:bg-slate-50 transition-colors">
            <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filters
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 mb-8">
          <button
            onClick={() => setActiveCategory('all')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activeCategory === 'all'
                ? 'bg-navy text-white'
                : 'bg-white border border-border text-muted hover:text-ink'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'text-white shadow-sm'
                  : 'bg-white border border-border text-muted hover:text-ink'
              }`}
              style={activeCategory === cat.id ? { backgroundColor: cat.color } : {}}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Scheme grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="font-semibold text-ink mb-1">No schemes found</h3>
            <p className="text-muted text-sm">Try a different search term or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(scheme => {
              const cat = categories.find(c => c.id === scheme.category)
              const isCompared = compareIds.includes(scheme.id)

              return (
                <div
                  key={scheme.id}
                  className={`scheme-card bg-white rounded-2xl border overflow-hidden flex flex-col ${
                    isCompared ? 'border-navy/30 ring-2 ring-navy/10' : 'border-border'
                  }`}
                >
                  {cat && (
                    <div className="px-4 pt-4">
                      <span
                        className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: cat.bg, color: cat.color }}
                      >
                        {cat.icon} {cat.name}
                      </span>
                    </div>
                  )}

                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-ink leading-snug mb-1">{scheme.name}</h3>
                      <p className="text-xs text-muted mb-3 leading-relaxed line-clamp-2">{scheme.description}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex-shrink-0">
                          <svg className="w-3.5 h-3.5 text-forest" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-xs font-semibold text-forest">{scheme.benefits}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {scheme.tags.map(t => (
                          <span key={t} className="text-[10px] font-semibold bg-slate-100 text-muted px-2 py-0.5 rounded-full">{t}</span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                      <button
                        onClick={() => setScreen('eligibility')}
                        className="flex-1 bg-navy hover:bg-navy-light text-white text-xs font-semibold py-2.5 rounded-lg transition-colors"
                      >
                        Check Eligibility →
                      </button>
                      <button
                        onClick={() => toggleCompare(scheme.id)}
                        className={`flex items-center gap-1 text-xs font-semibold px-3 py-2.5 rounded-lg border transition-colors ${
                          isCompared
                            ? 'bg-navy/10 border-navy/20 text-navy'
                            : 'border-border text-muted hover:text-ink hover:bg-slate-50'
                        }`}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                        </svg>
                        {isCompared ? 'Added' : 'Compare'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Compare bar */}
        {compareIds.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-xl p-4 z-40">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-ink">Compare ({compareIds.length}/3):</span>
                <div className="flex gap-2">
                  {compareIds.map(id => {
                    const s = schemes.find(s => s.id === id)
                    return s ? (
                      <div key={id} className="bg-navy/10 text-navy text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                        {s.shortName}
                        <button onClick={() => toggleCompare(id)} className="text-navy/60 hover:text-navy ml-0.5">✕</button>
                      </div>
                    ) : null
                  })}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCompareIds([])}
                  className="text-sm text-muted hover:text-ink border border-border px-4 py-2 rounded-lg"
                >
                  Clear All
                </button>
                <button className="bg-navy text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-navy-light transition-colors">
                  Compare Side by Side →
                </button>
              </div>
            </div>
          </div>
        )}

        {compareIds.length > 0 && <div className="h-20" />}

        {/* Bottom CTA */}
        <div className="mt-14 rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1760872645513-63b6846ce3c9?w=1400&h=300&fit=crop&auto=format"
              alt="India parliament"
              className="w-full h-full object-cover"
              style={{ objectPosition: 'center 40%' }}
            />
            <div className="absolute inset-0 bg-navy/80" />
          </div>
          <div className="relative text-center py-14 px-6">
            <h3 className="font-display text-3xl text-white mb-2">Different needs. A stronger tomorrow.</h3>
            <p className="text-white/60 mb-6 text-sm">Explore and choose the right scheme for you.</p>
            <button
              onClick={() => setScreen('eligibility')}
              className="bg-saffron hover:bg-saffron/90 text-white font-semibold px-8 py-3.5 rounded-xl transition-all active:scale-95"
            >
              Start Exploring →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
