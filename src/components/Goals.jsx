import { useEffect, useState } from 'react'

const options = [
  { key: 'P', label: 'P' },
  { key: 'E', label: 'E' },
  { key: 'R', label: 'R' },
  { key: 'M', label: 'M' },
  { key: 'A', label: 'A' },
]

export default function Goals({ baseUrl }) {
  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')
  const [dimension, setDimension] = useState('P')
  const [loading, setLoading] = useState(false)

  const load = async () => {
    try {
      const res = await fetch(`${baseUrl}/goals`)
      if (res.ok) setItems(await res.json())
    } catch (e) {}
  }

  useEffect(() => { load() }, [baseUrl])

  const add = async () => {
    if (!title.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, dimension, cadence: 'daily' }),
      })
      if (res.ok) {
        setTitle('')
        setDimension('P')
        load()
      }
    } finally {
      setLoading(false)
    }
  }

  const toggleDone = async (id, status) => {
    await fetch(`${baseUrl}/goals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: status === 'done' ? 'active' : 'done' }),
    })
    load()
  }

  return (
    <div className="bg-white/70 backdrop-blur rounded-xl p-6 shadow-sm border border-white/60">
      <h2 className="text-xl font-semibold mb-3">Mål og mikrovaner</h2>
      <div className="flex gap-2 mb-4">
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Nyt mål..." className="flex-1 border rounded-md px-3 py-2"/>
        <select value={dimension} onChange={(e)=>setDimension(e.target.value)} className="border rounded-md px-2">
          {options.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
        </select>
        <button onClick={add} disabled={loading} className="px-3 py-2 bg-emerald-600 text-white rounded-md">{loading? 'Tilføjer...' : 'Tilføj'}</button>
      </div>
      <ul className="space-y-2">
        {items.map(it => (
          <li key={it.id} className="flex items-center justify-between bg-white border rounded-md p-3">
            <div className="flex items-center gap-3">
              <button onClick={()=>toggleDone(it.id, it.status)} className={`h-5 w-5 rounded-full border flex items-center justify-center ${it.status==='done' ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>{it.status==='done' ? '✓' : ''}</button>
              <div>
                <div className={`font-medium ${it.status==='done' ? 'line-through text-gray-400' : ''}`}>{it.title}</div>
                <div className="text-xs text-gray-500">Dimension: {it.dimension}</div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
