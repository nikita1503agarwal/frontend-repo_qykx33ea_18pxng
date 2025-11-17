import { useMemo, useState } from 'react'
import Layout from './components/Layout'
import CheckInForm from './components/CheckInForm'
import Summary from './components/Summary'
import Goals from './components/Goals'

function App() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [refreshKey, setRefreshKey] = useState(0)

  const onSaved = () => setRefreshKey((k)=>k+1)

  return (
    <Layout>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <CheckInForm baseUrl={baseUrl} onSaved={onSaved} />
          <div id="maal">
            <Goals baseUrl={baseUrl} />
          </div>
        </div>
        <div className="space-y-6">
          <Summary baseUrl={baseUrl} refreshKey={refreshKey} />
          <div id="indsigter" className="bg-white/70 backdrop-blur rounded-xl p-6 shadow-sm border border-white/60">
            <h2 className="text-xl font-semibold mb-2">Hurtige forklaringer (PERMA)</h2>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              <li><span className="font-semibold">P – Positive Emotioner:</span> små, hyppige øjeblikke af glæde, taknemmelighed og håb.</li>
              <li><span className="font-semibold">E – Engagement:</span> brug dine styrker på meningsfulde udfordringer – flow.</li>
              <li><span className="font-semibold">R – Relationer:</span> kvalitet i forbindelser øger trivsel og robusthed.</li>
              <li><span className="font-semibold">M – Mening:</span> forbind dine handlinger med et større “hvorfor”.</li>
              <li><span className="font-semibold">A – Accomplishment:</span> små sejre og fremdrift styrker mestring.</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default App
