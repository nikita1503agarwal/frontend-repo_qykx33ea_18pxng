import { useEffect, useMemo, useState } from 'react'

const dims = [
  { key: 'p', label: 'Positive Emotions', color: 'from-rose-400 to-pink-500' },
  { key: 'e', label: 'Engagement', color: 'from-amber-400 to-orange-500' },
  { key: 'r', label: 'Relationships', color: 'from-emerald-400 to-green-500' },
  { key: 'm', label: 'Meaning', color: 'from-sky-400 to-blue-500' },
  { key: 'a', label: 'Accomplishment', color: 'from-violet-400 to-purple-500' },
]

export default function CheckInForm({ baseUrl, onSaved }) {
  const [values, setValues] = useState({ p: 5, e: 5, r: 5, m: 5, a: 5 })
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const avg = useMemo(() => {
    const sum = Object.values(values).reduce((s, v) => s + Number(v || 0), 0)
    return Math.round((sum / 5) * 10) / 10
  }, [values])

  useEffect(() => {
    // try load today from API
    const load = async () => {
      try {
        const res = await fetch(`${baseUrl}/checkins?limit=1`)
        if (res.ok) {
          const data = await res.json()
          if (data && data.length && data[0].date === new Date().toISOString().slice(0,10)) {
            const d = data[0]
            setValues({ p: d.p, e: d.e, r: d.r, m: d.m, a: d.a })
            setNote(d.note || '')
          }
        }
      } catch (e) {}
    }
    load()
  }, [baseUrl])

  const submit = async () => {
    setSaving(true)
    setError('')
    try {
      const payload = { ...values, note }
      const res = await fetch(`${baseUrl}/checkins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Kunne ikke gemme')
      const data = await res.json()
      onSaved?.(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white/70 backdrop-blur rounded-xl p-6 shadow-sm border border-white/60">
      <h2 className="text-xl font-semibold mb-4">Dagens PERMA check‑in</h2>
      <div className="space-y-5">
        {dims.map((d) => (
          <div key={d.key} className="">
            <div className="flex justify-between mb-1">
              <span className="font-medium">{d.label}</span>
              <span className="text-sm text-gray-600">{values[d.key]}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={values[d.key]}
              onChange={(e) => setValues((v) => ({ ...v, [d.key]: Number(e.target.value) }))}
              className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-current`}
            />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kort note (valgfri)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Hvad stod ud i dag?"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">Gennemsnit: <span className="font-semibold">{avg}</span></div>
          <button
            onClick={submit}
            disabled={saving}
            className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
          >{saving ? 'Gemmer...' : 'Gem dagens check‑in'}</button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </div>
  )
}
