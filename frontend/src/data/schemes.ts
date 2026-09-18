// ---------------------------------------------------------------------------
// schemes.ts – UI-facing shapes and mappers over the real backend API (see
// ../api.ts). The backend's rule engine is the only thing that decides
// eligibility; everything here just maps its response into shapes the
// components already expect.
// ---------------------------------------------------------------------------

import type { SchemeSummary, SchemeResult as ApiSchemeResult, ProfileInput, OverallStatus } from '../api'

// ─── Public types ────────────────────────────────────────────────────────────

export type Screen = 'home' | 'eligibility' | 'results' | 'schemes'

export type Category = {
  id: string
  name: string
  count: number
  color: string
  bg: string
  icon: string
}

/** Internal shape used by the UI components */
export type Scheme = {
  id: string           // = scheme_id
  name: string
  shortName: string    // abbreviation derived from name initials
  ministry: string
  description: string
  category: string
  benefits: string
  tags: string[]
  imgSeed: string       // Unsplash photo seed (per-category fallback)
  applicationUrl: string
}

export type EligibilityStatus = 'eligible' | 'partial' | 'not-eligible'

export type SchemeResult = Scheme & {
  status: EligibilityStatus
  reason: string
  criteria: ApiSchemeResult['criteria']
  evidence: ApiSchemeResult['evidence']
  documents: string[]
  explanation: ApiSchemeResult['explanation']
  missingInfo?: string[]
}

// ─── Category visual config ──────────────────────────────────────────────────

const CATEGORY_META: Record<string, { name: string; color: string; bg: string; icon: string }> = {
  agriculture:      { name: 'Agriculture',     color: '#15803D', bg: '#F0FDF4', icon: '🌾' },
  education:        { name: 'Education',       color: '#1D4ED8', bg: '#EFF6FF', icon: '📚' },
  health:           { name: 'Health',          color: '#DC2626', bg: '#FEF2F2', icon: '❤️' },
  housing:          { name: 'Housing',         color: '#D97706', bg: '#FFFBEB', icon: '🏠' },
  employment:       { name: 'Employment',      color: '#7C3AED', bg: '#F5F3FF', icon: '💼' },
  financial:        { name: 'Financial',       color: '#0891B2', bg: '#ECFEFF', icon: '💰' },
  women:            { name: 'Women & Child',   color: '#DB2777', bg: '#FDF2F8', icon: '👩‍👧' },
  elderly:          { name: 'Senior Citizens', color: '#9A3412', bg: '#FFF7ED', icon: '👴' },
  youth:            { name: 'Youth',           color: '#6D28D9', bg: '#F5F3FF', icon: '🎓' },
  disability:       { name: 'Disability',      color: '#0284C7', bg: '#F0F9FF', icon: '♿' },
  'social-welfare': { name: 'Social Welfare',  color: '#047857', bg: '#ECFDF5', icon: '🤝' },
}

const CATEGORY_IMG_SEEDS: Record<string, string> = {
  agriculture: '1500206279733-bf2e2244c36a',
  education:   '1427504494785-3a9ca7044f45',
  health:      '1559028006-448665bd7c7f',
  housing:     '1486325212027-8081e485255e',
  employment:  '1507003211169-0a1dd7228f2d',
  financial:   '1454023492550-5696f8ff10e1',
  women:       '1571210059434-edf9e804dfcd',
  elderly:     '1454023492550-5696f8ff10e1',
  youth:       '1427504494785-3a9ca7044f45',
  disability:  '1559028006-448665bd7c7f',
}

// ─── Mapper helpers ───────────────────────────────────────────────────────────

function deriveShortName(name: string): string {
  const initials = name
    .split(/\s+/)
    .filter(w => /^[A-Z]/.test(w))
    .map(w => w[0])
    .join('')
  return initials.length >= 2 ? initials.slice(0, 6) : name.slice(0, 8).toUpperCase()
}

function imgSeedFor(category: string): string {
  return CATEGORY_IMG_SEEDS[category] ?? '1500206279733-bf2e2244c36a'
}

export function mapSchemeSummary(s: SchemeSummary): Scheme {
  return {
    id: s.scheme_id,
    name: s.name,
    shortName: deriveShortName(s.name),
    ministry: s.ministry,
    description: s.description,
    category: s.category,
    benefits: s.benefits,
    tags: s.tags,
    imgSeed: imgSeedFor(s.category),
    applicationUrl: '',
  }
}

const STATUS_MAP: Record<OverallStatus, EligibilityStatus> = {
  POTENTIALLY_ELIGIBLE: 'eligible',
  NOT_ELIGIBLE: 'not-eligible',
  NEEDS_MORE_INFORMATION: 'partial',
}

export function mapEligibilityResult(r: ApiSchemeResult): SchemeResult {
  const missingInfo = r.criteria
    .filter(c => c.status === 'MISSING' || c.status === 'UNVERIFIABLE')
    .map(c => `${c.criterion} information required`)

  const failed = r.criteria.find(c => c.status === 'FAIL')
  const status = STATUS_MAP[r.status]

  let reason: string
  if (status === 'not-eligible' && failed) {
    reason = `${failed.criterion} criterion not met — required ${failed.required}, you provided ${failed.provided ?? 'nothing'}.`
  } else if (status === 'partial') {
    reason = 'Most criteria matched but some information is missing or unverified.'
  } else {
    reason = 'All checked criteria matched your profile. You appear to qualify for this scheme.'
  }

  return {
    id: r.scheme_id,
    name: r.scheme_name,
    shortName: deriveShortName(r.scheme_name),
    ministry: r.ministry,
    description: r.description,
    category: r.category,
    benefits: r.benefits,
    tags: r.tags,
    imgSeed: imgSeedFor(r.category),
    applicationUrl: r.source_url,
    status,
    reason,
    criteria: r.criteria,
    evidence: r.evidence,
    documents: r.documents,
    explanation: r.explanation,
    ...(missingInfo.length > 0 ? { missingInfo } : {}),
  }
}

/**
 * Derive category list (with counts) dynamically from mapped schemes.
 */
export function deriveCategoriesFromSchemes(schemeList: Scheme[]): Category[] {
  const counts: Record<string, number> = {}
  schemeList.forEach(s => {
    counts[s.category] = (counts[s.category] ?? 0) + 1
  })
  return Object.entries(counts)
    .map(([id, count]) => {
      const meta = CATEGORY_META[id] ?? {
        name: id.charAt(0).toUpperCase() + id.slice(1),
        color: '#334155',
        bg: '#F8FAFC',
        icon: '📋',
      }
      return { id, count, ...meta }
    })
    .sort((a, b) => b.count - a.count)
}

// ─── Form → API profile mapping ───────────────────────────────────────────────

/** Representative numeric income for each dropdown range label shown in the form. */
function parseIncomeFromLabel(label: string | undefined): number | undefined {
  if (!label) return undefined
  if (label.includes('Below')) return 90000
  if (label.includes('1,00,000') && label.includes('2,00,000')) return 150000
  if (label.includes('2,00,000') && label.includes('5,00,000')) return 350000
  if (label.includes('5,00,000') && label.includes('10,00,000')) return 750000
  if (label.includes('Above')) return 1200000
  return undefined
}

const OCCUPATION_MAP: Record<string, string> = {
  Farmer: 'farmer',
  Student: 'student',
  'Self-Employed': 'self-employed',
  'Salaried Employee': 'salaried employee',
  'Daily Wage Worker': 'unorganized sector',
  Unemployed: 'unemployed',
  Retired: 'retired',
  Other: 'other',
}

const CATEGORY_MAP: Record<string, string> = {
  General: 'general',
  OBC: 'obc',
  SC: 'sc',
  ST: 'st',
  EWS: 'general',
  'Prefer not to say': 'general',
}

/** Maps the eligibility form's dropdown labels to the backend's ProfileInput shape. */
export function formToProfile(form: Record<string, string>): ProfileInput {
  const profile: ProfileInput = {}
  if (form.age) profile.age = parseInt(form.age, 10)
  if (form.state) profile.state = form.state
  if (form.occupation) profile.occupation = OCCUPATION_MAP[form.occupation] ?? form.occupation.toLowerCase()
  if (form.category) profile.category = CATEGORY_MAP[form.category] ?? form.category.toLowerCase()
  const income = parseIncomeFromLabel(form.income)
  if (income !== undefined) profile.income = income
  return profile
}
