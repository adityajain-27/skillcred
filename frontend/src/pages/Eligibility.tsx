import { useState } from 'react'
import type { Screen } from '../data/schemes'

type Props = {
  setScreen: (s: Screen) => void
  setFormData: (d: Record<string, string>) => void
}

const occupations = ['Farmer', 'Student', 'Self-Employed', 'Salaried Employee', 'Daily Wage Worker', 'Unemployed', 'Retired', 'Other']
const states = ['Andhra Pradesh', 'Assam', 'Bihar', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi']
const categories = ['General', 'OBC', 'SC', 'ST', 'EWS', 'Prefer not to say']
const incomes = ['Below ₹1,00,000', '₹1,00,000 – ₹2,00,000', '₹2,00,000 – ₹5,00,000', '₹5,00,000 – ₹10,00,000', 'Above ₹10,00,000']
const landHoldings = ['No land holding', 'Less than 1 hectare', '1–2 hectares', '2–5 hectares', 'More than 5 hectares']
const familySizes = ['1', '2', '3', '4', '5', '6', '7', '8+']

const privacyPoints = [
  'No personal data shared publicly',
  'Used only to match relevant schemes',
  'You can skip any field',
  'We follow data privacy best practices',
]

const SelectField = ({
  label,
  icon,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string
  icon: string
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder?: string
}) => (
  <div>
    <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-base">{icon}</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full pl-9 pr-4 py-3 bg-white border border-border rounded-xl text-sm text-ink appearance-none focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all"
      >
        <option value="">{placeholder || `Select ${label}`}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
)

const InputField = ({
  label,
  icon,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string
  icon: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) => (
  <div>
    <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-base">{icon}</span>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-3 bg-white border border-border rounded-xl text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all"
      />
    </div>
  </div>
)

export default function Eligibility({ setScreen, setFormData }: Props) {
  const [form, setForm] = useState({
    age: '',
    income: '',
    occupation: '',
    state: '',
    category: '',
    landHolding: '',
    familySize: '',
    disabilityStatus: '',
    studentStatus: '',
    additionalInfo: '',
  })
  const [skipUnknown, setSkipUnknown] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }))

  const completedFields = Object.values(form).filter(v => v && v !== '').length
  const totalFields = Object.keys(form).length - 1 // exclude additionalInfo
  const progress = Math.round((completedFields / totalFields) * 100)

  const handleSubmit = () => {
    const errs: string[] = []
    if (!form.age) errs.push('age')
    if (!form.occupation) errs.push('occupation')
    if (errs.length > 0 && !skipUnknown) {
      setErrors(errs)
      return
    }
    setFormData(form)
    setScreen('results')
  }

  return (
    <div className="page-enter min-h-screen bg-cream py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Progress header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-2 text-sm text-muted">
            <span className="w-6 h-6 rounded-full bg-forest text-white flex items-center justify-center text-xs font-bold">1</span>
            <span className="font-semibold text-forest">Tell Us About You</span>
          </div>
          <div className="flex-1 h-px bg-border" />
          <div className="flex items-center gap-2 text-sm text-muted">
            <span className="w-6 h-6 rounded-full bg-border text-muted flex items-center justify-center text-xs font-bold">2</span>
            <span>Your Results</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              {/* Form header */}
              <div className="flex items-center justify-between p-6 pb-0">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-forest animate-pulse" />
                    <span className="text-xs text-muted font-medium">Step 1 of 2</span>
                  </div>
                  <h1 className="font-display text-2xl sm:text-3xl text-navy">Tell us about yourself</h1>
                  <p className="text-muted text-sm mt-1">
                    This helps us find the most relevant schemes for you. You can skip any field.
                  </p>
                </div>
                <button className="hidden sm:block text-xs text-forest border border-forest/30 rounded-lg px-3 py-1.5 hover:bg-forest-light transition-colors">
                  Save & Continue Later
                </button>
              </div>

              {/* Progress bar */}
              <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-muted">Profile completeness</span>
                  <span className="text-xs font-semibold text-navy">{progress}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-forest rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Form fields */}
              <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <InputField
                  label="Age"
                  icon="🎂"
                  value={form.age}
                  onChange={set('age')}
                  placeholder="e.g. 28"
                  type="number"
                />
                <SelectField
                  label="Annual Income (per year)"
                  icon="₹"
                  value={form.income}
                  onChange={set('income')}
                  options={incomes}
                  placeholder="Select income range"
                />
                <SelectField
                  label="Occupation"
                  icon="💼"
                  value={form.occupation}
                  onChange={set('occupation')}
                  options={occupations}
                />
                <SelectField
                  label="State / Union Territory"
                  icon="🗺"
                  value={form.state}
                  onChange={set('state')}
                  options={states}
                />
                <SelectField
                  label="Category"
                  icon="👥"
                  value={form.category}
                  onChange={set('category')}
                  options={categories}
                />
                <SelectField
                  label="Land Holding"
                  icon="🌾"
                  value={form.landHolding}
                  onChange={set('landHolding')}
                  options={landHoldings}
                />
                <SelectField
                  label="Family Size"
                  icon="👨‍👩‍👧‍👦"
                  value={form.familySize}
                  onChange={set('familySize')}
                  options={familySizes}
                />
                <SelectField
                  label="Disability Status"
                  icon="♿"
                  value={form.disabilityStatus}
                  onChange={set('disabilityStatus')}
                  options={['No', 'Yes – 40% to 80%', 'Yes – Above 80%']}
                />
                <SelectField
                  label="Student Status"
                  icon="🎓"
                  value={form.studentStatus}
                  onChange={set('studentStatus')}
                  options={['No', 'Yes – School', 'Yes – College/University', 'Yes – Vocational Training']}
                />

                {/* Additional info – full width */}
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                    Any additional information (optional)
                  </label>
                  <textarea
                    value={form.additionalInfo}
                    onChange={e => setForm(f => ({ ...f, additionalInfo: e.target.value }))}
                    placeholder="E.g. I am a small farmer, I have a specific requirement, etc."
                    rows={3}
                    className="w-full px-4 py-3 bg-white border border-border rounded-xl text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all resize-none"
                  />
                </div>

                {/* Skip checkbox */}
                <div className="sm:col-span-2 lg:col-span-3 flex items-start gap-3">
                  <input
                    id="skip"
                    type="checkbox"
                    checked={skipUnknown}
                    onChange={e => setSkipUnknown(e.target.checked)}
                    className="mt-0.5 accent-navy w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="skip" className="text-sm text-muted cursor-pointer">
                    I don't know / Prefer not to say for any field. You can skip any field — missing information will not cause an error.
                  </label>
                </div>

                {errors.length > 0 && !skipUnknown && (
                  <div className="sm:col-span-2 lg:col-span-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                    Please fill in at least Age and Occupation to get accurate results, or check the box above to skip.
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="px-6 py-5 bg-slate-50 border-t border-border flex items-center justify-between gap-4">
                <button
                  onClick={() => setScreen('home')}
                  className="text-sm text-muted hover:text-navy flex items-center gap-1.5 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 bg-forest hover:bg-forest/90 text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition-all active:scale-95 shadow-lg shadow-forest/20"
                >
                  Find My Schemes
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Privacy card */}
            <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-forest-light flex items-center justify-center text-forest">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-sm text-ink">Your information is safe</h3>
              </div>
              <ul className="space-y-2.5">
                {privacyPoints.map(p => (
                  <li key={p} className="flex items-start gap-2 text-xs text-muted">
                    <svg className="w-3.5 h-3.5 text-forest mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* What you'll get */}
            <div className="bg-navy rounded-2xl p-5 text-white">
              <h3 className="font-display text-lg mb-3">Real Schemes.<br />Real Opportunities.</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-4">
                From farmers to students, workers to entrepreneurs — there's a scheme for you.
              </p>
              <div className="rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1601689892697-b64daa00ff6d?w=400&h=200&fit=crop&auto=format"
                  alt="Indian citizens in traditional dress"
                  className="w-full h-28 object-cover"
                />
              </div>
              <p className="text-white/50 text-xs mt-3 italic">"Sahi jaankari, sahi disha, behtar kal."</p>
            </div>

            {/* Help */}
            <div className="bg-saffron-light border border-saffron/20 rounded-2xl p-4">
              <div className="text-sm font-semibold text-saffron mb-1">Need help?</div>
              <p className="text-xs text-muted">
                Call the National Helpline: <span className="font-semibold text-ink">1800-11-0001</span> (Toll Free)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
