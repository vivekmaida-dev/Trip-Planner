import { useMemo, useState } from 'react'
import Card from '../components/ui/Card'
import SearchInput from '../components/ui/SearchInput'
import Badge from '../components/ui/Badge'
import { destinationsData, regionFilters } from '../data/destinations'

export default function DestinationSection({ trip, onUpdate }) {
 const [query, setQuery] = useState('')
 const [region, setRegion] = useState('All')
 const filtered = useMemo(() => {
  const q = query.toLowerCase().trim()
  return destinationsData.filter((d) => (region === 'All' || d.region === region) && (!q || `${d.name} ${d.country} ${d.tags.join(' ')}`.toLowerCase().includes(q))).slice(0, 35)
 }, [query, region])

 const selected = destinationsData.find((d) => d.id === trip.destinationId)
 return <Card><h3 className='section-title'>Destination</h3><SearchInput placeholder='Search destination, country, tags...' value={query} onChange={(e)=>setQuery(e.target.value)} />
 <div className='mt-3 flex gap-2 overflow-auto pb-1'>{regionFilters.map((r)=><button key={r} className={`tab-btn ${region===r?'active':''}`} onClick={()=>setRegion(r)}>{r}</button>)}</div>
 <div className='mt-3 grid gap-2 sm:grid-cols-2'>{filtered.map((d)=><button key={d.id} className={`rounded-xl border p-2 text-left ${trip.destinationId===d.id?'border-accent-blue bg-accent-blue/10':'border-border-subtle bg-bg-elevated/50'}`} onClick={()=>onUpdate({ destinationId: d.id })}><p className='text-sm'>{d.emoji} {d.name}</p><p className='text-xs text-text-secondary'>{d.country} • {d.region}</p></button>)}</div>
 {selected && <div className='mt-3 flex flex-wrap gap-2'><Badge tone='purple'>{selected.type}</Badge><Badge tone='green'>Best: {selected.bestMonths.join(', ')}</Badge><Badge tone='orange'>Visa: {selected.visa}</Badge></div>}
 </Card>
}
