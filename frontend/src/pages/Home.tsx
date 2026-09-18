import type { Screen } from '../data/schemes'
import { categories } from '../data/schemes'

type Props = { setScreen: (s: Screen) => void }

const PARLIAMENT_IMG = 'https://images.unsplash.com/photo-1760872645513-63b6846ce3c9?w=900&h=650&fit=crop&auto=format'
const PEOPLE_IMG = 'https://images.unsplash.com/flagged/photo-1577604981316-298e453a19dd?w=600&h=450&fit=crop&auto=format'

const stats = [
  { value: '1,500+', label: 'Schemes across India' },
  { value: '36', label: 'States & Union Territories' },
  { value: '8', label: 'Major Sectors Covered' },
  { value: '1 Portal', label: 'For All Citizens' },
]

const steps = [
  {
    num: '1',
    title: 'Tell Us About Yourself',
    desc: 'Fill in basic details (you can skip any field you don\'t know).',
    color: 'bg-saffron-light text-saffron',
    border: 'border-saffron/20',
  },
  {
    num: '2',
    title: 'We Check Eligibility',
    desc: 'Our system matches your profile with official scheme rules.',
    color: 'bg-forest-light text-forest',
    border: 'border-forest/20',
  },
  {
    num: '3',
    title: 'See Results with Evidence',
    desc: 'Get clear verdicts with source citations from official documents.',
    color: 'bg-blue-50 text-blue-700',
    border: 'border-blue-100',
  },
  {
    num: '4',
    title: 'Take the Next Step',
    desc: 'Know what documents you need and how to apply online.',
    color: 'bg-purple-50 text-purple-700',
    border: 'border-purple-100',
  },
]

const pillars = [
  { icon: '🔍', title: 'Rule-based matching', sub: 'Transparent & consistent' },
  { icon: '📄', title: 'Official source evidence', sub: 'Directly from government documents' },
  { icon: '🔒', title: 'No hidden assumptions', sub: 'We show you what we check' },
  { icon: '🌏', title: 'Built for every citizen', sub: 'Across states, languages, backgrounds' },
]

export default function Home({ setScreen }: Props) {
  return (
    <div className="page-enter">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative bg-cream overflow-hidden">
        {/* Decorative diagonal */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute right-0 top-0 w-[55%] h-full"
            style={{
              background: 'linear-gradient(135deg, #fff8f4 0%, #fdecd8 100%)',
              clipPath: 'polygon(8% 0, 100% 0, 100% 100%, 0% 100%)',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Text */}
            <div className="z-10">
              <div className="inline-flex items-center gap-2 bg-saffron/10 border border-saffron/20 rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 rounded-full bg-saffron animate-pulse" />
                <span className="text-xs font-semibold text-saffron tracking-wide uppercase">Government Scheme Navigator</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] leading-[1.05] text-navy mb-6">
                Find the Schemes<br />
                <span className="text-saffron">You're Eligible</span> For.
              </h1>

              <p className="text-base sm:text-lg text-muted leading-relaxed mb-8 max-w-md">
                Discover government schemes that can benefit you — with clear reasons, official source citations, and next steps. No hidden assumptions, ever.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <button
                  onClick={() => setScreen('eligibility')}
                  className="flex items-center gap-2 bg-forest hover:bg-forest/90 text-white font-semibold px-7 py-3.5 rounded-xl text-sm transition-all active:scale-95 shadow-lg shadow-forest/20"
                >
                  Check My Eligibility
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
                <button
                  onClick={() => setScreen('schemes')}
                  className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-border text-navy font-semibold px-7 py-3.5 rounded-xl text-sm transition-all active:scale-95"
                >
                  Explore Schemes
                </button>
              </div>

              {/* Mini stats */}
              <div className="flex flex-wrap gap-6 pb-10">
                {[
                  { val: '1,500+', label: 'Schemes across India' },
                  { val: '36', label: 'States & UTs' },
                  { val: 'Trusted', label: 'Source-backed eligibility' },
                ].map(({ val, label }) => (
                  <div key={val} className="flex items-center gap-2">
                    <span className="text-navy font-bold text-lg font-display">{val}</span>
                    <span className="text-xs text-muted leading-tight max-w-[80px]">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero image */}
            <div className="relative flex justify-center lg:justify-end z-10 pb-0">
              <div className="relative w-full max-w-lg">
                <img
                  src={PARLIAMENT_IMG}
                  alt="India Parliament building reflected in water"
                  className="w-full h-72 lg:h-96 object-cover rounded-t-2xl"
                  style={{ objectPosition: 'center 30%' }}
                />
                {/* Floating card */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl px-5 py-4 border border-border max-w-[200px]">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-forest" />
                    <span className="text-xs font-semibold text-forest">Eligible</span>
                  </div>
                  <p className="text-xs text-muted">PM-KISAN • All criteria matched</p>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-xl shadow-lg px-4 py-3 border border-border">
                  <div className="text-xl font-bold font-display text-navy">500+</div>
                  <div className="text-xs text-muted">Schemes Covered</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust pillars ─────────────────────────────────────────── */}
      <section className="bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {pillars.map(({ icon, title, sub }) => (
              <div key={title} className="flex items-center gap-3">
                <span className="text-2xl flex-shrink-0">{icon}</span>
                <div>
                  <div className="text-sm font-semibold text-ink">{title}</div>
                  <div className="text-xs text-muted">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────────── */}
      <section className="bg-cream py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl text-navy mb-2">Explore Schemes by Category</h2>
              <p className="text-muted">From farm support to education, health to housing — find schemes that matter to you.</p>
            </div>
            <button
              onClick={() => setScreen('schemes')}
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-forest hover:text-forest/80 transition-colors"
            >
              View All Schemes
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setScreen('schemes')}
                className="scheme-card bg-white border border-border rounded-xl p-4 flex flex-col items-center gap-2 text-center group"
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-xl"
                  style={{ background: cat.bg }}
                >
                  {cat.icon}
                </div>
                <div>
                  <div className="text-xs font-semibold text-ink group-hover:text-navy">{cat.name}</div>
                  <div className="text-[11px] text-muted">{cat.count}+ schemes</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quote bar ─────────────────────────────────────────────── */}
      <section className="bg-navy py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="max-w-lg">
              <p className="text-white/80 text-xl font-display italic leading-relaxed">
                "An informed citizen is an empowered citizen."
              </p>
              <p className="text-white/50 text-sm mt-2">
                Government schemes exist to support you — let's make them easier to access.
              </p>
            </div>
            <div className="flex flex-wrap gap-8">
              {stats.map(({ value, label }) => (
                <div key={value} className="text-center">
                  <div className="font-display text-3xl text-saffron font-bold">{value}</div>
                  <div className="text-white/60 text-xs mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl text-navy mb-3">How It Works</h2>
            <p className="text-muted">A simple process to find the right opportunities for you.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={step.num} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px border-t border-dashed border-border z-0 -translate-x-1/2" />
                )}
                <div className={`relative z-10 border ${step.border} rounded-2xl p-6 bg-white scheme-card`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-4 ${step.color}`}>
                    {step.num}
                  </div>
                  <h3 className="font-semibold text-ink mb-2 leading-tight">{step.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => setScreen('eligibility')}
              className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold px-8 py-4 rounded-xl text-sm transition-all active:scale-95 shadow-lg shadow-navy/20"
            >
              Start Checking Your Eligibility
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-20"
        style={{ background: 'linear-gradient(135deg, #0C2755 0%, #1a3d72 60%, #1A6B35 100%)' }}
      >
        <div className="absolute inset-0 opacity-10">
          <img src={PEOPLE_IMG} alt="" className="w-full h-full object-cover" aria-hidden />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p className="text-white/60 text-sm font-semibold uppercase tracking-widest mb-4">Together for a More Inclusive India</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-4 leading-tight">
            Government schemes exist to support you.<br />
            <span className="text-saffron">Let's make them easier to access.</span>
          </h2>
          <p className="text-white/60 mb-8">Awareness today. A brighter tomorrow.</p>
          <button
            onClick={() => setScreen('eligibility')}
            className="bg-saffron hover:bg-saffron/90 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all active:scale-95 shadow-xl"
          >
            Check Your Eligibility →
          </button>
        </div>
      </section>
    </div>
  )
}
