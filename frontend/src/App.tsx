import { useState } from 'react'
import type { Screen } from './data/schemes'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Eligibility from './pages/Eligibility'
import Results from './pages/Results'
import Schemes from './pages/Schemes'

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [formData, setFormData] = useState<Record<string, string>>({})

  const navigate = (s: Screen) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setScreen(s)
  }

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Navbar screen={screen} setScreen={navigate} />

      <main className="flex-1">
        {screen === 'home' && <Home setScreen={navigate} />}
        {screen === 'eligibility' && <Eligibility setScreen={navigate} setFormData={setFormData} />}
        {screen === 'results' && <Results setScreen={navigate} formData={formData} />}
        {screen === 'schemes' && <Schemes setScreen={navigate} />}
      </main>

      {screen !== 'eligibility' && screen !== 'results' && (
        <Footer setScreen={navigate} />
      )}
    </div>
  )
}
