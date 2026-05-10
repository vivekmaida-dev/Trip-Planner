import { useEffect, useMemo, useRef, useState } from 'react'
import { X, MapPin, Search, ChevronRight, ChevronDown, Plus, Minus } from 'lucide-react'
import { destinationsData, regionFilters } from '../data/destinations'

// ── helpers ──────────────────────────────────────────────────────
function fuzzyMatch(haystack, needle) {
  const h = haystack.toLowerCase()
  const n = needle.toLowerCase().trim()
  if (!n) return false
  // Exact / starts-with / word-starts-with / includes
  if (h.startsWith(n)) return 5
  if (h.includes(n)) return 3
  const words = h.split(/\s+/)
  if (words.some(w => w.startsWith(n))) return 4
  return 0
}

// Group all cities by country for the country-expand flow
const byCountry = destinationsData.reduce((acc, d) => {
  if (!acc[d.country]) acc[d.country] = { country: d.country, emoji: d.emoji, region: d.region, cities: [] }
  acc[d.country].cities.push(d)
  return acc
}, {})

// ── component ─────────────────────────────────────────────────────
export default function DestinationSection({ trip, onUpdate }) {
  const [query, setQuery] = useState('')
  const [expandedCountry, setExpandedCountry] = useState(null) // which country is expanded in dropdown
  const [activeRegion, setActiveRegion] = useState('All')
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  const selectedIds = useMemo(
    () => (trip.destinationIds?.length ? trip.destinationIds : trip.destinationId ? [trip.destinationId] : []),
    [trip.destinationIds, trip.destinationId]
  )

  const cityDays = trip.cityDays || {}

  const selectedDestinations = useMemo(
    () => selectedIds.map(id => destinationsData.find(d => d.id === id)).filter(Boolean),
    [selectedIds]
  )

  // ── Search results ──────────────────────────────────────────────
  const results = useMemo(() => {
    const q = query.trim()
    if (q.length < 1) return []

    const cityHits = []
    const countryHits = new Map() // country → best score

    destinationsData.forEach(d => {
      if (selectedIds.includes(d.id)) return
      if (activeRegion !== 'All' && d.region !== activeRegion) return

      const nameScore = fuzzyMatch(d.name, q)
      const countryScore = fuzzyMatch(d.country, q)
      const score = Math.max(nameScore, countryScore * 0.8)
      if (score > 0) cityHits.push({ ...d, score })

      if (countryScore > 0) {
        const prev = countryHits.get(d.country) || 0
        countryHits.set(d.country, Math.max(prev, countryScore))
      }
    })

    cityHits.sort((a, b) => b.score - a.score)

    // Build country suggestion entries (only if not all cities of that country are selected)
    const countrySuggestions = []
    for (const [country, score] of countryHits) {
      const group = byCountry[country]
      if (!group) continue
      const hasUnselected = group.cities.some(c => !selectedIds.includes(c.id))
      if (!hasUnselected) continue
      countrySuggestions.push({ type: 'country', country, emoji: group.emoji, score, cities: group.cities })
    }
    countrySuggestions.sort((a, b) => b.score - a.score)

    // Deduplicate: if a country has a suggestion, don't also show all its cities as individual hits
    const countriesWithGroupEntry = new Set(countrySuggestions.map(c => c.country))
    const filteredCities = cityHits.filter(d => !countriesWithGroupEntry.has(d.country)).slice(0, 6)

    return [...countrySuggestions.slice(0, 4), ...filteredCities].slice(0, 10)
  }, [query, selectedIds, activeRegion])

  // Cities for an expanded country (shown inline inside dropdown)
  const expandedCities = useMemo(() => {
    if (!expandedCountry) return []
    const group = byCountry[expandedCountry]
    if (!group) return []
    return group.cities.filter(c => !selectedIds.includes(c.id))
  }, [expandedCountry, selectedIds])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setQuery('')
        setExpandedCountry(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ── Actions ─────────────────────────────────────────────────────
  const addCity = (dest) => {
    const next = [...selectedIds, dest.id]
    const days = { ...cityDays, [dest.id]: cityDays[dest.id] || Math.max(2, Math.round(trip.days / Math.max(next.length, 1))) }
    onUpdate({ destinationId: next[0], destinationIds: next, cityDays: days })
    // keep dropdown open if expanded country has more cities
    if (!expandedCountry) { setQuery(''); setExpandedCountry(null) }
  }

  const removeCity = (id) => {
    const next = selectedIds.filter(x => x !== id)
    const days = { ...cityDays }; delete days[id]
    onUpdate({ destinationId: next[0] || '', destinationIds: next, cityDays: days })
  }

  const setCityDays = (id, val) => {
    const d = Math.max(1, Math.min(30, Number(val) || 1))
    onUpdate({ cityDays: { ...cityDays, [id]: d } })
  }

  const reorderCity = (fromIdx, toIdx) => {
    const next = [...selectedIds]
    const [moved] = next.splice(fromIdx, 1)
    next.splice(toIdx, 0, moved)
    onUpdate({ destinationId: next[0], destinationIds: next })
  }

  const totalDays = selectedIds.reduce((s, id) => s + (cityDays[id] || 2), 0)

  // ── render ───────────────────────────────────────────────────────
  return (
    <div className='section-card'>
      {/* Header */}
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='section-title m-0'>
          <MapPin size={16} style={{ color: '#3d8ef0' }} />
          Destination
        </h3>
        {selectedIds.length > 0 && (
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            {selectedIds.length} {selectedIds.length === 1 ? 'city' : 'cities'} · {totalDays} days total
          </span>
        )}
      </div>

      {/* Region filter chips */}
      <div className='mb-3 flex gap-2 overflow-x-auto pb-1' style={{ scrollbarWidth: 'none' }}>
        {regionFilters.map(r => (
          <button
            key={r}
            onClick={() => setActiveRegion(r)}
            style={{
              flexShrink: 0,
              padding: '3px 10px',
              borderRadius: 20,
              border: `1px solid ${activeRegion === r ? '#3d8ef0' : '#1e2d45'}`,
              background: activeRegion === r ? 'rgba(61,142,240,0.15)' : 'transparent',
              color: activeRegion === r ? '#3d8ef0' : '#94a3b8',
              fontSize: '0.72rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Search input + dropdown */}
      <div className='relative'>
        <div style={{ position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
          <input
            ref={inputRef}
            className='input-base'
            style={{ paddingLeft: 36 }}
            placeholder='Search city or country (e.g. "Spain", "Barcelona", "Goa")'
            value={query}
            onChange={e => { setQuery(e.target.value); setExpandedCountry(null) }}
          />
        </div>

        {/* Dropdown */}
        {query.length >= 1 && (
          <div
            ref={dropdownRef}
            style={{
              position: 'absolute', left: 0, right: 0, top: 'calc(100% + 6px)',
              zIndex: 100, maxHeight: 380, overflowY: 'auto',
              background: '#0f1623', border: '1px solid #1e2d45',
              borderRadius: 12, boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
            }}
          >
            {results.length === 0 && (
              <p style={{ padding: '16px 14px', color: '#475569', fontSize: '0.85rem' }}>
                No destinations found for "{query}"
              </p>
            )}

            {results.map(item => {
              if (item.type === 'country') {
                const isExpanded = expandedCountry === item.country
                const citiesInCountry = item.cities.filter(c => !selectedIds.includes(c.id))
                return (
                  <div key={`country-${item.country}`}>
                    {/* Country row */}
                    <button
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 14px', background: 'transparent', border: 'none', cursor: 'pointer',
                        borderBottom: '1px solid #1e2d45',
                        color: '#f1f5f9',
                      }}
                      onClick={() => setExpandedCountry(isExpanded ? null : item.country)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: '1.1rem' }}>{item.emoji}</span>
                        <div style={{ textAlign: 'left' }}>
                          <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{item.country}</p>
                          <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>
                            {citiesInCountry.length} cities available
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: '0.7rem', color: '#3d8ef0', background: 'rgba(61,142,240,0.1)', padding: '2px 8px', borderRadius: 20 }}>
                          Country
                        </span>
                        {isExpanded
                          ? <ChevronDown size={14} style={{ color: '#94a3b8' }} />
                          : <ChevronRight size={14} style={{ color: '#94a3b8' }} />}
                      </div>
                    </button>

                    {/* Expanded cities list */}
                    {isExpanded && (
                      <div style={{ background: 'rgba(22,31,48,0.6)', borderBottom: '1px solid #1e2d45' }}>
                        {citiesInCountry.map(city => (
                          <button
                            key={city.id}
                            style={{
                              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              padding: '8px 14px 8px 32px', background: 'transparent', border: 'none',
                              cursor: 'pointer', color: '#f1f5f9', transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(61,142,240,0.08)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            onClick={() => addCity(city)}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: '0.95rem' }}>{city.emoji}</span>
                              <span style={{ fontSize: '0.85rem' }}>{city.name}</span>
                              {city.tags?.slice(0, 2).map(t => (
                                <span key={t} style={{ fontSize: '0.65rem', color: '#94a3b8', background: '#161f30', padding: '1px 6px', borderRadius: 10 }}>{t}</span>
                              ))}
                            </div>
                            <Plus size={14} style={{ color: '#3d8ef0' }} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }

              // Individual city row
              return (
                <button
                  key={item.id}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px', background: 'transparent', border: 'none', cursor: 'pointer',
                    color: '#f1f5f9', borderBottom: '1px solid rgba(30,45,69,0.5)', transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(61,142,240,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => addCity(item)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '1.1rem' }}>{item.emoji}</span>
                    <div style={{ textAlign: 'left' }}>
                      <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 500 }}>{item.name}</p>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>{item.country} · {item.region}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {item.tags?.slice(0, 2).map(t => (
                      <span key={t} style={{ fontSize: '0.65rem', color: '#94a3b8', background: '#161f30', padding: '2px 7px', borderRadius: 10 }}>{t}</span>
                    ))}
                    <Plus size={14} style={{ color: '#3d8ef0', marginLeft: 4 }} />
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Selected cities chips ─────────────────────────────────── */}
      {selectedDestinations.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 8 }}>
            Your itinerary — drag to reorder, set days per city:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {selectedDestinations.map((dest, idx) => {
              const days = cityDays[dest.id] || 2
              return (
                <div
                  key={dest.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: '#161f30', border: '1px solid #1e2d45',
                    borderRadius: 10, padding: '8px 10px',
                    transition: 'border-color 0.2s', minWidth: 0,
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(61,142,240,0.4)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#1e2d45'}
                >
                  {/* Step number */}
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                    background: idx === 0 ? '#3d8ef0' : '#1e2d45',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 700, color: idx === 0 ? '#fff' : '#94a3b8',
                  }}>
                    {idx + 1}
                  </div>

                  {/* Emoji + name */}
                  <span style={{ fontSize: '1.1rem' }}>{dest.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {dest.name}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {dest.country}
                      {dest.visa !== 'free' && <span style={{ color: '#f97316', marginLeft: 4 }}>· visa req.</span>}
                    </p>
                  </div>

                  {/* Days stepper */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                    <button
                      onClick={() => setCityDays(dest.id, days - 1)}
                      style={{ width: 20, height: 20, borderRadius: '50%', border: '1px solid #1e2d45', background: '#0f1623', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}
                    >
                      <Minus size={9} />
                    </button>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#f1f5f9', minWidth: 28, textAlign: 'center' }}>
                      {days}d
                    </span>
                    <button
                      onClick={() => setCityDays(dest.id, days + 1)}
                      style={{ width: 20, height: 20, borderRadius: '50%', border: '1px solid #1e2d45', background: '#0f1623', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}
                    >
                      <Plus size={9} />
                    </button>
                  </div>

                  {/* Move up/down — hidden on xs screens */}
                  <div className='reorder-btns' style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
                    <button
                      disabled={idx === 0}
                      onClick={() => reorderCity(idx, idx - 1)}
                      style={{ background: 'none', border: 'none', cursor: idx === 0 ? 'default' : 'pointer', color: idx === 0 ? '#1e2d45' : '#94a3b8', padding: 0, lineHeight: 1 }}
                    >▲</button>
                    <button
                      disabled={idx === selectedDestinations.length - 1}
                      onClick={() => reorderCity(idx, idx + 1)}
                      style={{ background: 'none', border: 'none', cursor: idx === selectedDestinations.length - 1 ? 'default' : 'pointer', color: idx === selectedDestinations.length - 1 ? '#1e2d45' : '#94a3b8', padding: 0, lineHeight: 1 }}
                    >▼</button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeCity(dest.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 2, borderRadius: 6, transition: 'color 0.2s', flexShrink: 0 }}
                    onMouseEnter={e => e.currentTarget.style.color = '#f97316'}
                    onMouseLeave={e => e.currentTarget.style.color = '#475569'}
                  >
                    <X size={14} />
                  </button>
                </div>
              )
            })}
          </div>

          {/* Trip total days sync button */}
          {totalDays !== trip.days && (
            <button
              onClick={() => onUpdate({ days: totalDays })}
              style={{
                marginTop: 10, width: '100%', padding: '7px 14px',
                border: '1px dashed #3d8ef0', borderRadius: 8,
                background: 'rgba(61,142,240,0.06)', color: '#3d8ef0',
                fontSize: '0.78rem', cursor: 'pointer', transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(61,142,240,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(61,142,240,0.06)'}
            >
              Sync trip duration to {totalDays} days (currently set to {trip.days} days)
            </button>
          )}
        </div>
      )}

      {/* Empty state */}
      {selectedDestinations.length === 0 && (
        <div style={{ marginTop: 14, padding: '16px', border: '1px dashed #1e2d45', borderRadius: 10, textAlign: 'center' }}>
          <MapPin size={20} style={{ color: '#1e2d45', margin: '0 auto 6px' }} />
          <p style={{ margin: 0, fontSize: '0.82rem', color: '#475569' }}>
            Search a city or country to start building your itinerary
          </p>
        </div>
      )}
    </div>
  )
}
