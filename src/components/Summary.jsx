import { useEffect, useState } from 'react'

export default function Summary({ baseUrl, refreshKey }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${baseUrl}/stats/summary?days=30`)
        if (res.ok) {
          setData(await res.json())
        }
      } catch (e) {}
    }
    load()
  }, [baseUrl, refreshKey])

  if (!data) return (
    <div className="bg-white/70 backdrop-blur rounded-xl p-6 shadow-sm border border-white/60">
      <div className="animate-pulse text-gray-400">Indlæser oversigt...</div>
    </div>
  )

  const avg = data.avg || {}
  const items = [
    { key: 'p', label: 'P', color: 'bg-pink-500' },
    { key: 'e', label: 'E', color: 'bg-orange-500' },
    { key: 'r', label: 'R', color: 'bg-green-500' },
    { key: 'm', label: 'M', color: 'bg-blue-500' },
    { key: 'a', label: 'A', color: 'bg-purple-500' },
  ]

  return (
    <div className="bg-white/70 backdrop-blur rounded-xl p-6 shadow-sm border border-white/60">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Oversigt (30 dage)</h2>
        <div className="text-sm text-gray-700">Streak: <span className="font-semibold">{data.streak}</span></div>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {items.map((it) => (
          <div key={it.key} className="text-center">
            <div className={`mx-auto h-14 w-14 ${it.color} text-white rounded-full flex items-center justify-center text-lg font-bold`}>{avg[it.key] ?? '—'}</div>
            <div className="text-xs mt-1 text-gray-600">{it.label}</div>
          </div>
        ))}
      </div>
      {data.latest && (
        <div className="mt-4 text-sm text-gray-700">
          Seneste note: <span className="italic">{data.latest.note || '—'}</span>
        </div>
      )}
    </div>
  )
}
