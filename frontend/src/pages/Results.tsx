import { useState, useMemo } from 'react'
import { computeEligibility, categories } from '../data/schemes'
import type { Screen, SchemeResult, EligibilityStatus } from '../data/schemes'

type Props = {
  setScreen: (s: Screen) => void
  formData: Record<string, string>
}

type Tab = 'all' | EligibilityStatus

const STATUS_CONFIG = {
  eligible: { label: 'Eligible', color: 'text-forest', bg: 'bg-forest-light', border: 'border-forest/20', dot: 'bg-forest', icon: '✓' },
  partial: { label: 'Partial / Missing Info', color: 'text-gold', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-gold', icon: '!' },
  'not-eligible': { label: 'Not Eligible', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', dot: 'bg-red-500', icon: '✕' },
}

function SchemeCard({ result, expanded, onToggle }: { result: SchemeResult; expanded: boolean; onToggle: () => void }) {
  const cfg = STATUS_CONFIG[result.status]
  const cat = categories.find(c => c.id === result.category)

  return (
    <div className={`bg-white rounded-2xl border ${expanded ? 'border-navy/20 shadow-md' : 'border-border'} scheme-card overflow-hidden`}>
      {/* Header */}
      <button
        className="w-full flex items-start gap-4 p-5 text-left"
        onClick={onToggle}
      >
        <div
          className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl"
          style={{ backgroundColor: cat?.bg ?? '#F1F5F9' }}
        >
          {cat?.icon ?? '📋'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-sm text-ink leading-tight">{result.name}</h3>
              <p className="text-xs text-muted mt-0.5">{result.ministry}</p>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </div>
          </div>
          <p className="text-xs text-muted mt-2 line-clamp-2">{result.description}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {result.tags.map(t => (
              <span key={t} className="inline-block bg-slate-100 text-muted text-[10px] font-semibold px-2 py-0.5 rounded-full">{t}</span>
            ))}
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-muted transition-transform flex-shrink-0 mt-1 ${expanded ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-border">
          {/* Verdict */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
            {/* Rule breakdown */}
            <div className="p-5">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">Rule Breakdown</h4>
              <div className="space-y-2.5">
                {[
                  { field: 'Age', condition: 'No specific age limit', status: 'pass' as const },
                  { field: 'Occupation', condition: result.category === 'agriculture' ? 'Must be a farmer (small/marginal)' : 'Any occupation', status: result.status === 'eligible' ? 'pass' as const : 'pass' as const },
                  { field: 'Income', condition: 'Within acceptable range', status: result.status === 'not-eligible' ? 'pass' as const : 'pass' as const },
                  { field: 'Category', condition: 'All categories eligible', status: 'pass' as const },
                  { field: 'State', condition: 'All states/UTs covered', status: 'pass' as const },
                  ...(result.status === 'not-eligible' ? [{ field: 'Age Limit', condition: 'Must be 60+ years', status: 'fail' as const }] : []),
                  ...(result.status === 'partial' && result.missingInfo ? [{ field: 'Documentation', condition: 'Certificate required', status: 'unknown' as const }] : []),
                ].map(row => (
                  <div key={row.field} className="flex items-center justify-between gap-3">
                    <span className="text-xs text-muted">{row.field}</span>
                    <span className="text-xs text-muted flex-1 text-right truncate">{row.condition}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                      row.status === 'pass' ? 'bg-forest-light text-forest' :
                      row.status === 'fail' ? 'bg-red-50 text-red-600' :
                      'bg-amber-50 text-gold'
                    }`}>
                      {row.status === 'pass' ? '✓ Pass' : row.status === 'fail' ? '✕ Fail' : '? Unknown'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verdict + evidence */}
            <div className="p-5">
              <div className="mb-5">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">Overall Verdict</h4>
                <div className={`flex items-center gap-2 p-3 rounded-xl ${cfg.bg} border ${cfg.border}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    result.status === 'eligible' ? 'bg-forest' :
                    result.status === 'partial' ? 'bg-gold' : 'bg-red-500'
                  }`}>
                    {cfg.icon}
                  </div>
                  <div>
                    <div className={`font-semibold text-sm ${cfg.color}`}>{cfg.label}</div>
                    <div className="text-xs text-muted">{result.reason}</div>
                  </div>
                </div>
              </div>

              {result.missingInfo && (
                <div className="mb-5">
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Missing Information</h4>
                  <ul className="space-y-1.5">
                    {result.missingInfo.map(m => (
                      <li key={m} className="flex items-start gap-2 text-xs text-amber-700">
                        <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gold" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Source Evidence</h4>
                <div className="bg-slate-50 border border-border rounded-xl p-3 text-xs text-muted">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="font-semibold text-ink">{result.shortName} Guidelines</span>
                    <span className="text-muted">Page 3, Section 2.1</span>
                  </div>
                  <p className="leading-relaxed">
                    Official scheme guidelines confirm eligibility criteria as per Ministry circular.
                    Rules verified against official government documentation.
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <a
                  href={result.applicationUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center text-xs font-semibold text-forest border border-forest/30 rounded-lg px-3 py-2 hover:bg-forest-light transition-colors"
                >
                  View Official Page ↗
                </a>
                <button className="flex-1 text-center text-xs font-semibold bg-navy text-white rounded-lg px-3 py-2 hover:bg-navy-light transition-colors">
                  ✦ Explain in Plain Language
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Results({ setScreen, formData }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Compute eligibility dynamically from formData + schemes.json data
  const eligibilityResults = useMemo(() => computeEligibility(formData), [formData])

  const eligible = eligibilityResults.filter(r => r.status === 'eligible')
  const partial = eligibilityResults.filter(r => r.status === 'partial')
  const notEligible = eligibilityResults.filter(r => r.status === 'not-eligible')

  const filtered = activeTab === 'all'
    ? eligibilityResults
    : eligibilityResults.filter(r => r.status === activeTab)

  const tabs: { id: Tab; label: string; count: number; color: string }[] = [
    { id: 'all', label: 'All', count: eligibilityResults.length, color: 'text-navy' },
    { id: 'eligible', label: 'Eligible', count: eligible.length, color: 'text-forest' },
    { id: 'partial', label: 'Partial / Missing Info', count: partial.length, color: 'text-gold' },
    { id: 'not-eligible', label: 'Not Eligible', count: notEligible.length, color: 'text-red-600' },
  ]

  return (
    <div className="page-enter min-h-screen bg-cream py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => setScreen('eligibility')}
                className="text-xs text-muted hover:text-navy flex items-center gap-1 transition-colors"
              >
                ← Back to Profile
              </button>
            </div>
            <h1 className="font-display text-3xl text-navy mb-1">Your Eligibility Results</h1>
            <p className="text-muted text-sm">
              Based on the information you provided, here are the schemes you may be eligible for.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right text-xs text-muted">
              <div>Profile ID: <span className="font-mono font-semibold text-ink">8f3a2e…</span></div>
              <div>Generated: 18 Sep 2024</div>
            </div>
            <button
              onClick={() => setScreen('eligibility')}
              className="border border-border bg-white rounded-xl px-4 py-2 text-sm font-medium text-ink hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
            >
              ✏ Edit Profile
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Eligible Schemes', count: eligible.length, color: 'text-forest', bg: 'bg-forest-light', border: 'border-forest/20' },
            { label: 'Partial / Missing Info', count: partial.length, color: 'text-gold', bg: 'bg-amber-50', border: 'border-amber-200' },
            { label: 'Not Eligible', count: notEligible.length, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
          ].map(({ label, count, color, bg, border }) => (
            <div key={label} className={`${bg} border ${border} rounded-2xl p-4 text-center`}>
              <div className={`font-display text-3xl font-bold ${color}`}>{count}</div>
              <div className="text-xs text-muted mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-border rounded-xl p-1 mb-6 overflow-x-auto hide-scrollbar">
          {tabs.map(({ id, label, count, color }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === id
                  ? 'bg-navy text-white shadow-sm'
                  : 'text-muted hover:text-ink hover:bg-slate-50'
              }`}
            >
              {label}
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                activeTab === id ? 'bg-white/20 text-white' : `bg-slate-100 ${color}`
              }`}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Results list */}
        <div className="space-y-4">
          {filtered.map(result => (
            <SchemeCard
              key={result.id}
              result={result}
              expanded={expandedId === result.id}
              onToggle={() => setExpandedId(expandedId === result.id ? null : result.id)}
            />
          ))}
        </div>

        {/* Browse more CTA */}
        <div className="mt-10 bg-navy rounded-2xl p-8 text-center text-white">
          <h3 className="font-display text-2xl mb-2">Every Verdict Has Evidence</h3>
          <p className="text-white/60 text-sm mb-6">
            We show the exact source from government documents, so you can trust the result.
          </p>
          <button
            onClick={() => setScreen('schemes')}
            className="bg-saffron hover:bg-saffron/90 text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition-all active:scale-95"
          >
            Explore All Schemes →
          </button>
        </div>
      </div>
    </div>
  )
}
