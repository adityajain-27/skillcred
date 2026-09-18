// ---------------------------------------------------------------------------
// api.ts – thin client over the backend (see backend/README.md for the API).
// Backend decides all eligibility; this file only calls it and shapes responses
// for the UI. Never re-derive PASS/FAIL/status here.
// ---------------------------------------------------------------------------

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export type CriterionStatus = 'PASS' | 'FAIL' | 'MISSING' | 'UNVERIFIABLE'
export type OverallStatus = 'POTENTIALLY_ELIGIBLE' | 'NOT_ELIGIBLE' | 'NEEDS_MORE_INFORMATION'

export type Criterion = {
  criterion: string
  required: string
  provided: string | null
  status: CriterionStatus
}

export type Evidence = {
  scheme_id: string
  source: string
  text: string
  score: number
}

export type Explanation = {
  summary: string
  why_it_matches: string[]
  why_it_does_not_match: string[]
  why_it_cannot_be_determined: string[]
  missing_information: string[]
  required_documents: string[]
  next_steps: string[]
}

export type SchemeResult = {
  scheme_id: string
  scheme_name: string
  ministry: string
  description: string
  category: string
  tags: string[]
  benefits: string
  source_url: string
  status: OverallStatus
  criteria: Criterion[]
  documents: string[]
  evidence: Evidence[]
  explanation: Explanation | null
}

export type SchemeSummary = {
  scheme_id: string
  name: string
  ministry: string
  description: string
  category: string
  tags: string[]
  benefits: string
}

export type ProfileInput = {
  age?: number
  state?: string
  occupation?: string
  income?: number
  gender?: string
  category?: string
}

export async function fetchSchemes(): Promise<SchemeSummary[]> {
  const res = await fetch(`${API_BASE}/api/schemes`)
  if (!res.ok) throw new Error(`GET /api/schemes failed: ${res.status}`)
  return res.json()
}

export async function fetchSchemeDetail(schemeId: string): Promise<Record<string, unknown>> {
  const res = await fetch(`${API_BASE}/api/schemes/${schemeId}`)
  if (!res.ok) throw new Error(`GET /api/schemes/${schemeId} failed: ${res.status}`)
  return res.json()
}

export async function checkEligibility(profile: ProfileInput, explain = false): Promise<SchemeResult[]> {
  const res = await fetch(`${API_BASE}/api/eligibility?explain=${explain}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  })
  if (!res.ok) throw new Error(`POST /api/eligibility failed: ${res.status}`)
  const data = await res.json()
  return data.results
}
