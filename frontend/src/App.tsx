import { useState, useEffect } from 'react'
import type { Screen, Scheme, Category } from './data/schemes'
import { mapSchemeSummary, deriveCategoriesFromSchemes } from './data/schemes'
import { fetchSchemes } from './api'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Eligibility from './pages/Eligibility'
import Results from './pages/Results'
import Schemes from './pages/Schemes'

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [schemesError, setSchemesError] = useState<string | null>(null)

  useEffect(() => {
    fetchSchemes()
      .then(data => {
        const mapped = data.map(mapSchemeSummary)
        setSchemes(mapped)
        setCategories(deriveCategoriesFromSchemes(mapped))
      })
      .catch(err => setSchemesError(err.message))
  }, [])

  const navigate = (s: Screen) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setScreen(s)
  }

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Navbar screen={screen} setScreen={navigate} />

      <main className="flex-1">
        {schemesError && (
          <div className="bg-red-50 border-b border-red-200 text-red-700 text-sm text-center py-2 px-4">
            Could not reach the backend ({schemesError}). Is it running at the configured API URL?
          </div>
        )}
        {screen === 'home' && <Home setScreen={navigate} categories={categories} />}
        {screen === 'eligibility' && <Eligibility setScreen={navigate} setFormData={setFormData} />}
        {screen === 'results' && <Results setScreen={navigate} formData={formData} categories={categories} />}
        {screen === 'schemes' && <Schemes setScreen={navigate} schemes={schemes} categories={categories} />}
      </main>

      {screen !== 'eligibility' && screen !== 'results' && (
        <Footer setScreen={navigate} />
      )}
    </div>
  )
}
