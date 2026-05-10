import { useState } from 'react'
import Card from '../components/ui/Card'
import PriceTile from '../components/ui/PriceTile'
import Slider from '../components/ui/Slider'
import Toggle from '../components/ui/Toggle'
import { ChevronDown, ChevronUp, Plane, Car, Train, Bus, MoreHorizontal } from 'lucide-react'
import { formatINR } from '../utils/formatters'
import { calculateTransportCost } from '../utils/budgetCalc'

// ── Leg key helper ────────────────────────────────────────────────
export const legKey = (fromId, toId) => `${fromId}__${toId}`

// ── Default transport for a new leg ──────────────────────────────
const DEFAULT_FIRST_LEG = { mode: 'flight', tier: 'standard', roundTrip: true, baggage: 0, seatSelection: 0 }
const DEFAULT_INTRA_LEG  = { mode: 'other', amount: 2500 }

const MODE_ICON = { flight: Plane, car: Car, train: Train, bus: Bus, other: MoreHorizontal }
const MODE_LABEL = { flight: 'Flight', car: 'Car', train: 'Train', bus: 'Bus', other: 'Other' }

// ── Per-leg cost estimator ────────────────────────────────────────
function estimateLegCost(transport, dest, isFirstLeg, people) {
  if (!isFirstLeg) return transport.amount || 0
  return calculateTransportCost({ ...transport, passengers: people }, dest, {})
}

// ── Single leg card ───────────────────────────────────────────────
function LegCard({ leg, isFirstLeg, transport, people, onChange }) {
  const [open, setOpen] = useState(isFirstLeg)
  const ModeIcon = MODE_ICON[transport.mode] || MoreHorizontal
  const cost = estimateLegCost(transport, leg.toDest, isFirstLeg, people)
  const setT = (patch) => onChange({ ...transport, ...patch })

  return (
    <div style={{ border: '1px solid #1e2d45', borderRadius: 12, overflow: 'hidden', marginBottom: 8 }}>
      {/* Leg header — always visible */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px', background: open ? '#131d2e' : 'transparent',
          border: 'none', cursor: 'pointer', color: '#f1f5f9', gap: 10,
          transition: 'background 0.15s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
          {/* From → To */}
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                {leg.fromEmoji} {leg.fromLabel}
              </span>
              <span style={{ color: '#475569', fontSize: '0.75rem' }}>→</span>
              <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                {leg.toEmoji} {leg.toLabel}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
              <ModeIcon size={12} style={{ color: '#3d8ef0', flexShrink: 0 }} />
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{MODE_LABEL[transport.mode]}</span>
              {cost > 0 && (
                <span style={{ fontSize: '0.72rem', color: '#22c55e', marginLeft: 4 }}>
                  {formatINR(cost)}
                </span>
              )}
            </div>
          </div>
        </div>
        <div style={{ flexShrink: 0, color: '#475569' }}>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {/* Leg details — collapsible */}
      {open && (
        <div style={{ padding: '12px 14px', borderTop: '1px solid #1e2d45', background: '#0a1120' }}>
          {/* Mode selector */}
          <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: '0 0 8px' }}>Transport mode</p>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', flexWrap: 'nowrap', paddingBottom: 4 }}>
            {['flight', 'car', 'train', 'bus', 'other'].map((m) => {
              const Icon = MODE_ICON[m]
              return (
                <button
                  key={m}
                  className={`tab-btn flex-shrink-0 ${transport.mode === m ? 'active' : ''}`}
                  onClick={() => setT({ mode: m, amount: transport.amount })}
                  style={{ display: 'flex', alignItems: 'center', gap: 5 }}
                >
                  <Icon size={12} />
                  {MODE_LABEL[m]}
                </button>
              )
            })}
          </div>

          {/* Mode-specific options */}
          <div style={{ marginTop: 12 }}>
            {/* FLIGHT */}
            {transport.mode === 'flight' && isFirstLeg && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div className='grid grid-cols-1 gap-2 sm:grid-cols-3'>
                  <PriceTile title='Budget' subtitle='LCC carriers' price={leg.toDest?.flight?.[0] || 4500}
                    selected={transport.tier === 'budget'} onClick={() => setT({ tier: 'budget' })} />
                  <PriceTile title='Standard' subtitle='Balanced fares' price={leg.toDest?.flight?.[1] || 7800}
                    selected={transport.tier === 'standard'} onClick={() => setT({ tier: 'standard' })} />
                  <PriceTile title='Peak / Last min' subtitle='High flexibility' price={leg.toDest?.flight?.[2] || 14500}
                    selected={transport.tier === 'peak'} onClick={() => setT({ tier: 'peak' })} />
                </div>
                <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
                  <Toggle label='Round trip' checked={!!transport.roundTrip} onChange={v => setT({ roundTrip: v })} />
                  <Slider label='Baggage add-on (₹/person)' min={0} max={3000} value={transport.baggage || 0} onChange={v => setT({ baggage: v })} />
                </div>
              </div>
            )}
            {transport.mode === 'flight' && !isFirstLeg && (
              <IntraLegCost transport={transport} setT={setT} placeholder='e.g. ₹8,000 for budget flight' />
            )}

            {/* CAR */}
            {transport.mode === 'car' && isFirstLeg && (
              <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
                <label><span className='text-xs text-text-secondary'>Fuel price (₹/L)</span>
                  <input className='input-base' type='number' value={transport.fuelPrice || 103} onChange={e => setT({ fuelPrice: Number(e.target.value) })} /></label>
                <label><span className='text-xs text-text-secondary'>Mileage (km/L)</span>
                  <input className='input-base' type='number' value={transport.kmpl || 15} onChange={e => setT({ kmpl: Number(e.target.value) })} /></label>
                <Slider label='Vehicles' min={1} max={3} value={transport.vehicles || 1} onChange={v => setT({ vehicles: v })} />
                <Toggle label='Hire driver' checked={!!transport.hireDriver} onChange={v => setT({ hireDriver: v })} />
              </div>
            )}
            {transport.mode === 'car' && !isFirstLeg && (
              <IntraLegCost transport={transport} setT={setT} placeholder='e.g. ₹2,500 petrol + tolls' />
            )}

            {/* TRAIN */}
            {transport.mode === 'train' && isFirstLeg && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'nowrap', overflowX: 'auto' }}>
                {['sleeper', '3ac', '2ac'].map(c => (
                  <button key={c} className={`tab-btn flex-shrink-0 ${transport.classTier === c ? 'active' : ''}`}
                    onClick={() => setT({ classTier: c })}>{c.toUpperCase()}</button>
                ))}
                <Toggle label='Tatkal' checked={!!transport.tatkal} onChange={v => setT({ tatkal: v })} />
              </div>
            )}
            {transport.mode === 'train' && !isFirstLeg && (
              <IntraLegCost transport={transport} setT={setT} placeholder='e.g. ₹1,500 train ticket' />
            )}

            {/* BUS */}
            {transport.mode === 'bus' && isFirstLeg && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'nowrap', overflowX: 'auto' }}>
                {['ordinary', 'ac', 'luxury'].map(b => (
                  <button key={b} className={`tab-btn flex-shrink-0 ${transport.busTier === b ? 'active' : ''}`}
                    onClick={() => setT({ busTier: b })}>{b.charAt(0).toUpperCase() + b.slice(1)}</button>
                ))}
              </div>
            )}
            {transport.mode === 'bus' && !isFirstLeg && (
              <IntraLegCost transport={transport} setT={setT} placeholder='e.g. ₹800 intercity bus' />
            )}

            {/* OTHER */}
            {transport.mode === 'other' && (
              <IntraLegCost transport={transport} setT={setT} placeholder='Total cost for this leg (₹)' />
            )}
          </div>

          {/* CO2 hint for first leg flights */}
          {isFirstLeg && transport.mode === 'flight' && leg.toDest && (
            <p style={{ marginTop: 10, fontSize: '0.72rem', color: '#475569' }}>
              ~{Math.round((leg.toDest.flightHours || 1) * 90)} kg CO₂ · {leg.toDest.flightHours || '?'}h flight
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// ── Manual cost input for intra-trip legs ─────────────────────────
function IntraLegCost({ transport, setT, placeholder }) {
  return (
    <div>
      <label>
        <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>
          Total cost for this leg (₹)
        </span>
        <input
          className='input-base'
          type='number'
          placeholder={placeholder}
          value={transport.amount || ''}
          onChange={e => setT({ amount: Number(e.target.value) })}
        />
      </label>
      <p style={{ marginTop: 5, fontSize: '0.7rem', color: '#475569' }}>
        Enter the actual fare — flight booking sites, bus operators, etc.
      </p>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────
export default function TransportSection({ trip, destinations = [], onUpdate }) {
  const people = trip.people?.total || 1
  const legTransports = trip.legTransports || {}

  // Build legs: [home, dest0, dest1, dest2, ...]
  const stops = ['home', ...destinations.map(d => d.id)]

  // No destinations selected → show placeholder
  if (destinations.length === 0) {
    return (
      <Card>
        <h3 className='section-title'>Transport</h3>
        <p style={{ color: '#475569', fontSize: '0.85rem' }}>
          Add destinations above to configure transport legs.
        </p>
      </Card>
    )
  }

  const legs = stops.slice(0, -1).map((fromId, i) => {
    const toId = stops[i + 1]
    const toDest = destinations.find(d => d.id === toId) || null
    const fromDest = destinations.find(d => d.id === fromId) || null

    return {
      key: legKey(fromId, toId),
      fromId,
      toId,
      fromLabel: fromId === 'home' ? 'Home (Delhi)' : (fromDest?.name || fromId),
      toLabel: toDest?.name || toId,
      fromEmoji: fromId === 'home' ? '🏠' : (fromDest?.emoji || '📍'),
      toEmoji: toDest?.emoji || '📍',
      toDest,
      isFirst: i === 0,
    }
  })

  const updateLeg = (key, patch) => {
    onUpdate({ legTransports: { ...legTransports, [key]: { ...(legTransports[key] || {}), ...patch } } })
  }

  // Total transport cost
  const totalCost = legs.reduce((sum, leg) => {
    const t = legTransports[leg.key] || (leg.isFirst ? DEFAULT_FIRST_LEG : DEFAULT_INTRA_LEG)
    return sum + estimateLegCost(t, leg.toDest, leg.isFirst, people)
  }, 0)

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h3 className='section-title' style={{ margin: 0 }}>Transport</h3>
        {totalCost > 0 && (
          <span style={{ fontSize: '0.78rem', color: '#22c55e', fontWeight: 600 }}>
            Total: {formatINR(totalCost)}
          </span>
        )}
      </div>

      {legs.map((leg) => {
        const transport = legTransports[leg.key] || (leg.isFirst ? DEFAULT_FIRST_LEG : DEFAULT_INTRA_LEG)
        return (
          <LegCard
            key={leg.key}
            leg={leg}
            isFirstLeg={leg.isFirst}
            transport={transport}
            people={people}
            onChange={(patch) => updateLeg(leg.key, patch)}
          />
        )
      })}
    </Card>
  )
}
