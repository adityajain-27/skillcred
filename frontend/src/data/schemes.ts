// ---------------------------------------------------------------------------
// schemes.ts – Single source of truth for scheme data.
//
// Currently the data is loaded from the local `schemes.json` file (same shape
// as the backend will return).  When you connect to the backend, replace the
// `rawSchemes` import below with an API call that returns the same JSON array,
// then pass the result into `mapApiSchemes()` + `deriveCategoriesFromSchemes()`.
// ---------------------------------------------------------------------------

import rawSchemes from '../../schemes.json'

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

/** Shape of a single object in schemes.json (mirrors the backend response) */
export type ApiScheme = {
  title: string
  slug: string
  description: string
  category: string
  tags: string[]
  eligibility: {
    min_age: number | null
    max_age: number | null
    gender: 'all' | 'male' | 'female'
    income_limit: number | null
    caste: string[]
    occupation: string[]
    state: string
  }
  benefits: string
  application_url: string
  ministry: string
  launched_year: number
  is_active: boolean
}

/** Internal shape used by the UI components */
export type Scheme = {
  id: string           // = slug
  name: string         // = title
  shortName: string    // abbreviation derived from title initials
  ministry: string
  description: string
  category: string
  benefits: string
  tags: string[]
  imgSeed: string      // Unsplash photo seed (per-category fallback)
  applicationUrl: string
  eligibility: ApiScheme['eligibility']
}

export type EligibilityStatus = 'eligible' | 'partial' | 'not-eligible'

export type SchemeResult = Scheme & {
  status: EligibilityStatus
  reason: string
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

function deriveShortName(title: string): string {
  const initials = title
    .split(/\s+/)
    .filter(w => /^[A-Z]/.test(w))
    .map(w => w[0])
    .join('')
  return initials.length >= 2 ? initials.slice(0, 6) : title.slice(0, 8).toUpperCase()
}

function mapApiScheme(api: ApiScheme): Scheme {
  return {
    id: api.slug,
    name: api.title,
    shortName: deriveShortName(api.title),
    ministry: api.ministry,
    description: api.description,
    category: api.category,
    benefits: api.benefits,
    tags: api.tags,
    imgSeed: CATEGORY_IMG_SEEDS[api.category] ?? '1500206279733-bf2e2244c36a',
    applicationUrl: api.application_url,
    eligibility: api.eligibility,
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Map raw API/JSON array → internal Scheme array.
 * Swap the import above with your backend response and call this function.
 */
export function mapApiSchemes(apiData: ApiScheme[]): Scheme[] {
  return apiData.filter(s => s.is_active).map(mapApiScheme)
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

// ─── Active data (auto-populated from schemes.json) ───────────────────────────

export const schemes: Scheme[] = mapApiSchemes(rawSchemes as ApiScheme[])

export const categories: Category[] = deriveCategoriesFromSchemes(schemes)

// ─── Eligibility engine ───────────────────────────────────────────────────────

function parseIncomeFromLabel(label: string): number | null {
  if (!label) return null
  if (label.includes('Below')) return 100000
  if (label.includes('1,00,000') && label.includes('2,00,000')) return 200000
  if (label.includes('2,00,000') && label.includes('5,00,000')) return 500000
  if (label.includes('5,00,000') && label.includes('10,00,000')) return 1000000
  if (label.includes('Above')) return 9999999
  return null
}

function occupationMatches(formOccupation: string, schemeOccupations: string[]): boolean {
  if (!schemeOccupations || schemeOccupations.length === 0) return true
  const occ = formOccupation.toLowerCase()
  return schemeOccupations.some(so => {
    const s = so.toLowerCase()
    if (occ.includes('farmer') && (s.includes('farmer') || s === 'agriculture')) return true
    if (occ.includes('student') && s.includes('student')) return true
    if ((occ.includes('self') || occ.includes('business')) &&
        (s.includes('business') || s.includes('self') || s.includes('entrepreneur') || s.includes('trader'))) return true
    if ((occ.includes('daily') || occ.includes('unorganis')) && s.includes('unorganized')) return true
    if (occ.includes('artisan') && (s.includes('artisan') || s.includes('craftsman'))) return true
    if (occ.includes('vendor') && s.includes('vendor')) return true
    if (occ.includes('employ') && s.includes('employ')) return true
    return false
  })
}

/**
 * Compute eligibility for all schemes given a user's form data.
 * Returns results sorted: eligible → partial → not-eligible.
 *
 * When the backend handles matching, replace this function call with an API
 * request and cast the response to SchemeResult[].
 */
export function computeEligibility(
  formData: Record<string, string>,
  schemeList: Scheme[] = schemes,
): SchemeResult[] {
  const age = formData.age ? parseInt(formData.age, 10) : null
  const income = parseIncomeFromLabel(formData.income)
  const gender = formData.gender?.toLowerCase() ?? ''
  const caste = formData.category?.toLowerCase() ?? ''
  const occupation = formData.occupation ?? ''
  const disability = formData.disabilityStatus ?? ''

  const results: SchemeResult[] = schemeList.map(scheme => {
    const elig = scheme.eligibility
    const missingInfo: string[] = []
    let fails = 0

    // Age
    if (age !== null) {
      if (elig.min_age !== null && age < elig.min_age) fails++
      if (elig.max_age !== null && age > elig.max_age) fails++
    } else if (elig.min_age !== null || elig.max_age !== null) {
      missingInfo.push('Age information required')
    }

    // Income
    if (income !== null && elig.income_limit !== null) {
      if (income > elig.income_limit) fails++
    } else if (income === null && elig.income_limit !== null) {
      missingInfo.push('Income certificate required')
    }

    // Gender
    if (elig.gender !== 'all' && gender && gender !== 'all') {
      if (elig.gender !== gender) fails++
    }

    // Caste
    if (elig.caste?.length > 0 && caste) {
      const normCaste = caste.replace('prefer not to say', 'general').replace('ews', 'general')
      if (!elig.caste.map(c => c.toLowerCase()).includes(normCaste)) {
        missingInfo.push('Caste/category certificate may be needed')
      }
    }

    // Occupation
    if (elig.occupation?.length > 0) {
      if (occupation) {
        if (!occupationMatches(occupation, elig.occupation)) fails++
      } else {
        missingInfo.push('Occupation details required')
      }
    }

    // Disability schemes
    if (scheme.category === 'disability' && !disability.includes('Yes')) {
      fails++
    }

    let status: EligibilityStatus
    let reason: string

    if (fails > 0) {
      status = 'not-eligible'
      reason = buildNotEligibleReason(scheme, age, income, gender, occupation, elig)
    } else if (missingInfo.length > 0) {
      status = 'partial'
      reason = 'Most criteria matched but some information is missing or unverified.'
    } else {
      status = 'eligible'
      reason = 'All checked criteria matched your profile. You appear to qualify for this scheme.'
    }

    return {
      ...scheme,
      status,
      reason,
      ...(missingInfo.length > 0 && status !== 'not-eligible' ? { missingInfo } : {}),
    }
  })

  const order: EligibilityStatus[] = ['eligible', 'partial', 'not-eligible']
  return results.sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status))
}

function buildNotEligibleReason(
  scheme: Scheme,
  age: number | null,
  income: number | null,
  gender: string,
  occupation: string,
  elig: ApiScheme['eligibility'],
): string {
  if (age !== null && elig.min_age !== null && age < elig.min_age)
    return `Age criterion not met. Minimum age required is ${elig.min_age} years.`
  if (age !== null && elig.max_age !== null && age > elig.max_age)
    return `Age criterion not met. Maximum age for this scheme is ${elig.max_age} years.`
  if (income !== null && elig.income_limit !== null && income > elig.income_limit)
    return `Income exceeds the limit of ₹${elig.income_limit.toLocaleString('en-IN')} per year.`
  if (elig.gender !== 'all' && gender !== elig.gender)
    return `This scheme is available only to ${elig.gender} applicants.`
  if (elig.occupation.length > 0 && occupation && !occupationMatches(occupation, elig.occupation))
    return `Occupation does not match. This scheme is for: ${elig.occupation.join(', ')}.`
  if (scheme.category === 'disability')
    return 'This scheme requires a disability certificate (40%+ disability).'
  return 'One or more eligibility criteria were not met based on your profile.'
}

// Kept for any legacy imports — now always empty (Results.tsx uses computeEligibility instead)
export const eligibilityResults: SchemeResult[] = []
