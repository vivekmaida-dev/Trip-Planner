import Card from '../components/ui/Card'
import Slider from '../components/ui/Slider'
import Toggle from '../components/ui/Toggle'

const DIET_OPTIONS = [
  { key: 'veg',    label: '🥦 Veg',     color: '#22c55e' },
  { key: 'mix',    label: '🍱 Mix',     color: '#3d8ef0' },
  { key: 'nonveg', label: '🍗 Non-Veg', color: '#f97316' },
]

export default function FoodSection({ trip, destinations = [], onUpdate }) {
  const food = trip.food
  const cityFood = trip.cityFood || {}
  const setFood = (patch) => onUpdate({ food: { ...food, ...patch } })

  // Check if per-city overrides differ from global
  const hasOverrides = destinations.some(d => cityFood[d.id] && cityFood[d.id] !== food.diet)

  const setCityDiet = (cityId, diet) => {
    // Toggle off if same as global OR same as current override
    const next = (cityFood[cityId] === diet) ? undefined : diet
    const updated = { ...cityFood }
    if (next === undefined) delete updated[cityId]
    else updated[cityId] = next
    onUpdate({ cityFood: updated })
  }

  return (
    <Card>
      <h3 className='section-title'>Food</h3>

      {/* ── Global diet ─────────────────────────────────────────── */}
      <div style={{ marginBottom: 6 }}>
        <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: '0 0 6px' }}>
          Default diet for all cities
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {DIET_OPTIONS.map(({ key, label }) => (
            <button
              key={key}
              className={`tab-btn ${food.diet === key ? 'active' : ''}`}
              onClick={() => setFood({ diet: key })}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Per-city diet overrides ───────────────────────────────── */}
      {destinations.length > 0 && (
        <div style={{ margin: '12px 0', padding: '10px 12px', background: '#0a1120', borderRadius: 10, border: '1px solid #1e2d45' }}>
          <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: '0 0 8px', fontWeight: 600 }}>
            Override per city {hasOverrides && <span style={{ color: '#f97316' }}>· custom set</span>}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {destinations.map(d => {
              const currentDiet = cityFood[d.id] || food.diet
              const isOverridden = !!cityFood[d.id] && cityFood[d.id] !== food.diet
              return (
                <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.82rem', minWidth: 110, flex: '0 0 auto' }}>
                    {d.emoji} <span style={{ color: isOverridden ? '#f1f5f9' : '#94a3b8', fontWeight: isOverridden ? 600 : 400 }}>{d.name}</span>
                  </span>
                  <div style={{ display: 'flex', gap: 5 }}>
                    {DIET_OPTIONS.map(({ key, label, color }) => {
                      const isActive = currentDiet === key
                      return (
                        <button
                          key={key}
                          onClick={() => setCityDiet(d.id, key)}
                          style={{
                            fontSize: '0.7rem', padding: '3px 9px', borderRadius: 20,
                            border: `1px solid ${isActive ? color : '#1e2d45'}`,
                            background: isActive ? `${color}22` : 'transparent',
                            color: isActive ? color : '#475569',
                            cursor: 'pointer', transition: 'all 0.15s',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {label}
                        </button>
                      )
                    })}
                  </div>
                  {isOverridden && (
                    <button
                      onClick={() => setCityDiet(d.id, food.diet)}
                      style={{ fontSize: '0.65rem', color: '#475569', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      reset
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Meal options ─────────────────────────────────────────── */}
      <div className='mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3'>
        <label>
          <span className='text-xs text-text-secondary'>Meals/day</span>
          <select className='input-base' value={food.mealsPerDay} onChange={e => setFood({ mealsPerDay: Number(e.target.value) })}>
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>
          </select>
        </label>
        <Slider label='Alcohol / drinks (₹/person/day)' min={0} max={1000} value={food.drinks} onChange={v => setFood({ drinks: v })} />
        <Slider label='Road snacks (₹/day)' min={0} max={500} value={food.snacks} onChange={v => setFood({ snacks: v })} />
      </div>

      <div className='mt-3 space-y-2'>
        <Toggle label='Breakfast' checked={food.includeBreakfast} onChange={v => setFood({ includeBreakfast: v })} />
        <Toggle label='Lunch' checked={food.includeLunch} onChange={v => setFood({ includeLunch: v })} />
        <Toggle label='Dinner' checked={food.includeDinner} onChange={v => setFood({ includeDinner: v })} />
        <Toggle label='Street food mode (-40% cost)' checked={food.streetFood} onChange={v => setFood({ streetFood: v })} />
      </div>
    </Card>
  )
}
