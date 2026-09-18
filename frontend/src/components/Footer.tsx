import type { Screen } from '../data/schemes'

type Props = { setScreen: (s: Screen) => void }

export default function Footer({ setScreen }: Props) {
  return (
    <footer className="bg-navy-dark text-white mt-auto">
      <div className="h-1 tricolor-stripe" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <svg viewBox="0 0 36 36" width="18" height="18" fill="none">
                  <circle cx="18" cy="18" r="10" stroke="white" strokeWidth="2" />
                  <circle cx="18" cy="18" r="3" fill="white" />
                  <line x1="18" y1="8" x2="18" y2="4" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <line x1="18" y1="28" x2="18" y2="32" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <line x1="8" y1="18" x2="4" y2="18" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <line x1="28" y1="18" x2="32" y2="18" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold">NagrikSeva</div>
                <div className="text-[10px] text-white/50">Government Services Portal</div>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Making government schemes accessible, transparent, and easy to understand for every citizen.
            </p>
            <div className="flex gap-3 mt-5">
              {['X', 'IN', 'YT', 'FB'].map(s => (
                <div key={s} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs font-semibold cursor-pointer transition-colors">
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', s: 'home' as Screen },
                { label: 'Check Eligibility', s: 'eligibility' as Screen },
                { label: 'Browse Schemes', s: 'schemes' as Screen },
              ].map(({ label, s }) => (
                <li key={label}>
                  <button
                    onClick={() => setScreen(s)}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {label}
                  </button>
                </li>
              ))}
              <li><a href="#" className="text-sm text-white/70 hover:text-white">About</a></li>
              <li><a href="#" className="text-sm text-white/70 hover:text-white">Contact</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Resources</h4>
            <ul className="space-y-2.5">
              {['Official Portals', 'State Schemes', 'Help & FAQ', 'Privacy Policy', 'Terms of Use'].map(l => (
                <li key={l}><a href="#" className="text-sm text-white/70 hover:text-white">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Stay Updated</h4>
            <p className="text-sm text-white/60 mb-4">Get the latest updates on new schemes and policy changes.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-saffron"
              />
              <button className="bg-saffron hover:bg-saffron/90 text-white px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors">
                →
              </button>
            </div>
            <p className="text-xs text-white/40 mt-2">#NagrikSeva</p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">© 2024 NagrikSeva. All rights reserved.</p>
          <p className="text-xs text-white/40">
            Made with ❤ for a stronger India &nbsp;
            <span className="text-saffron">🇮🇳</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
