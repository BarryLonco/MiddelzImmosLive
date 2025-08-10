
'use client'
import { useEffect, useState } from 'react'
import SearchBar from '@/components/SearchBar'
import ListingCard from '@/components/ListingCard'
import { DEFAULT_CITIES } from '@/lib/cities'

export default function Page() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchLive = async (cities: string[] = DEFAULT_CITIES, _filters: any = {}) => {
    setLoading(true)
    try {
      const res = await fetch('/api/live-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cities })
      })
      const data = await res.json()
      setItems(data.items || [])
    } catch (e) {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchLive() }, [])

  return (
    <div className="flex flex-col gap-4">
      <SearchBar defaultCities={DEFAULT_CITIES} onSearch={fetchLive} />
      {loading && <div className="text-sm text-slate-500">Lade Angebote…</div>}
      <div className="grid md:grid-cols-2 gap-4">
        {items.map(item => <ListingCard key={item.id} item={item} />)}
      </div>
      {!loading && items.length === 0 && <div className="text-slate-500">Keine Treffer.</div>}
    </div>
  )
}
