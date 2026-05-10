import { useMemo, useState } from 'react'
import Card from '../components/ui/Card'
import AnimatedNumber from '../components/ui/AnimatedNumber'
import Button from '../components/ui/Button'
import DonutChart from '../components/charts/DonutChart'
import BudgetBars from '../components/charts/BudgetBars'
import MonthGrid from '../components/charts/MonthGrid'
import { formatINR } from '../utils/formatters'
import {
  calculateActivitiesCost, calculateExtrasCost, calculateFoodCost,
  calculateHotelCost, calculatePerPerson, calculateSavings,
  calculateTotal, calculateTransportCost, suggestAlternatives,
} from '../utils/budgetCalc'
import { legKey } from './TransportSection'
import { seasonFromMonth } from '../utils/dateUtils'

const VISA_COLORS = { free: '#22c55e', on_arrival: '#3d8ef0', e_visa: '#a855f7', required: '#f97316' }
const VISA_LABEL  = { free: 'Visa Free', on_arrival: 'Visa on Arrival', e_visa: 'e-Visa', required: 'Visa Required' }

export default function OutputPanel({ trip, destination, destinations = [], onSave, onCompare, allDestinations }) {
  const [monthsToSave, setMonthsToSave] = useState(6)
  const [savePerMonth, setSavePerMonth] = useState(10000)

  const data = useMemo(() => {
    if (!destination) return null
    const selected = destinations.length ? destinations : [destination]
    const cityDays = trip.cityDays || {}
    const season = seasonFromMonth(trip.month, destination)

    // Build per-city budget using actual days set by user
    const legTransports = trip.legTransports || {}
    const people = trip.people.adults + trip.people.children * 0.5
    const stops = ['home', ...selected.map(d => d.id)]

    // Calculate total transport across all legs
    let transport = 0
    stops.slice(0, -1).forEach((fromId, i) => {
      const toId = stops[i + 1]
      const key = legKey(fromId, toId)
      const toDest = selected.find(d => d.id === toId)
      const isFirst = i === 0
      const legT = legTransports[key] || (isFirst
        ? { mode: 'flight', tier: 'standard', roundTrip: true }
        : { mode: 'other', amount: 0 })
      if (isFirst) {
        transport += calculateTransportCost({ ...legT, passengers: trip.people.total }, toDest, {})
      } else {
        transport += (legT.amount || 0)
      }
    })

    const cityFood = trip.cityFood || {}
    let stay = 0, food = 0
    const itinerary = selected.map((d) => {
      const days = cityDays[d.id] || Math.max(1, Math.round(trip.days / selected.length))
      const nights = Math.max(1, days - 1)
      const diet = cityFood[d.id] || trip.food.diet  // per-city override
      stay += calculateHotelCost(trip.stay.tier, trip.stay.rooms, nights, season, d.hotelBase)
      food += calculateFoodCost(d.foodPerMeal, people, days, diet, trip.stay.tier, trip.food)
      return { id: d.id, name: d.name, country: d.country, emoji: d.emoji, days, visa: d.visa, diet }
    })

    const totalDays = itinerary.reduce((s, x) => s + x.days, 0)
    const activities = calculateActivitiesCost(trip.activities, trip.people.adults, trip.people.children)
      + (trip.equipmentRental || 0) + ((trip.guideFee || 0) * totalDays)
    const extrasBase = (trip.visaFee || 0) * trip.people.total
      + ep(trip.extras.insurance, trip.people.total)
      + ep(trip.extras.sim, trip.people.total)
      + ep(trip.extras.laundry, trip.people.total)
      + (trip.extras.shopping || 0) + (trip.extras.medical || 0)
    const extras = calculateExtrasCost(0, 0, trip.extras.forex, 0, 0, 0, trip.extras.emergencyBuffer, extrasBase, transport + stay + food + activities)
    const total = calculateTotal({ transport, stay, food, activities, extras })
    const perPerson = calculatePerPerson(total, trip.people.total, trip.customSplitEnabled ? trip.customSplit : null)

    return { season, transport, stay, food, activities, extras, total, perPerson, itinerary, totalDays }
  }, [trip, destination, destinations])

  if (!destination || !data) {
    return (
      <div className='output-panel-wrap'>
        <Card>
          <div style={{ textAlign: 'center', padding: '32px 16px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🗺️</div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
              Search and select a destination on the left to see your live budget breakdown here.
            </p>
          </div>
        </Card>
      </div>
    )
  }

  const chartData = [
    { name: 'Transport', value: data.transport },
    { name: 'Stay',      value: data.stay },
    { name: 'Food',      value: data.food },
    { name: 'Activities',value: data.activities },
    { name: 'Extras',    value: data.extras },
  ]
  const savings = calculateSavings(data.total, 0, savePerMonth)
  const alts = suggestAlternatives(data.total, destination, allDestinations)

  return (
    <div className='output-panel-wrap'>

      {/* ── Grand Total ─────────────────────────────────────────── */}
      <Card style={{ background: 'linear-gradient(135deg, rgba(61,142,240,0.12), rgba(168,85,247,0.08))', border: '1px solid rgba(61,142,240,0.3)' }}>
        <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0 0 4px' }}>Grand Total</p>
        <p style={{ fontFamily: 'Syne, sans-serif', fontSize: '2.2rem', fontWeight: 700, margin: 0, background: 'linear-gradient(135deg,#3d8ef0,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          <AnimatedNumber value={data.total} formatter={formatINR} />
        </p>
        <div className='grand-total-grid'>
          <div style={{ color: '#94a3b8' }}>Per person
            <span style={{ color: '#f1f5f9', marginLeft: 6, fontWeight: 600 }}>{formatINR(data.total / Math.max(trip.people.total, 1))}</span>
          </div>
          <div style={{ color: '#94a3b8' }}>Per day
            <span style={{ color: '#f1f5f9', marginLeft: 6, fontWeight: 600 }}>{formatINR(data.total / Math.max(data.totalDays, 1))}</span>
          </div>
          <div style={{ color: '#94a3b8' }}>{destination.currency}
            <span style={{ color: '#f1f5f9', marginLeft: 6, fontWeight: 600 }}>
              {(data.total * (destination.exchangeRate || 0.012)).toFixed(0)}
            </span>
          </div>
          <div style={{ color: '#94a3b8' }}>CO₂
            <span style={{ color: '#22c55e', marginLeft: 6, fontWeight: 600 }}>{Math.round(data.transport / 80)} kg</span>
          </div>
        </div>
      </Card>

      {/* ── Final Itinerary ──────────────────────────────────────── */}
      <Card>
        <h4 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, margin: '0 0 12px', fontSize: '0.95rem' }}>
          🗓️ Final Itinerary — {data.itinerary.length} {data.itinerary.length === 1 ? 'city' : 'cities'} · {data.totalDays} days
        </h4>
        {data.itinerary.length === 0 ? (
          <p style={{ color: '#475569', fontSize: '0.82rem' }}>No cities selected yet. Use the destination search.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {data.itinerary.map((stop, idx) => (
              <div
                key={stop.id}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: '#161f30', border: '1px solid #1e2d45', borderRadius: 10, padding: '9px 14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                    background: idx === 0 ? '#3d8ef0' : '#1e2d45',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.65rem', fontWeight: 700, color: idx === 0 ? '#fff' : '#94a3b8',
                  }}>{idx + 1}</span>
                  <span style={{ fontSize: '1rem' }}>{stop.emoji}</span>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: '#f1f5f9' }}>{stop.name}</p>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8' }}>
                      {stop.country}
                      {stop.diet && stop.diet !== 'mix' && (
                        <span style={{ marginLeft: 6, color: stop.diet === 'veg' ? '#22c55e' : '#f97316' }}>
                          · {stop.diet === 'veg' ? '🥦 Veg' : '🍗 Non-veg'}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  {stop.visa !== 'free' && (
                    <span style={{ fontSize: '0.65rem', color: VISA_COLORS[stop.visa] || '#94a3b8', background: `${VISA_COLORS[stop.visa]}18`, padding: '2px 7px', borderRadius: 10 }}>
                      {VISA_LABEL[stop.visa] || stop.visa}
                    </span>
                  )}
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#3d8ef0' }}>
                    {stop.days} day{stop.days !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ── Charts ──────────────────────────────────────────────── */}
      <Card>
        <DonutChart data={chartData} />
        <BudgetBars items={chartData} total={data.total} />
      </Card>

      {/* ── Season & timing ─────────────────────────────────────── */}
      <Card>
        <h4 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, margin: '0 0 10px', fontSize: '0.95rem' }}>🌤️ Season & Timing</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: '0.8rem', padding: '3px 10px', borderRadius: 20, background: 'rgba(61,142,240,0.15)', color: '#3d8ef0', fontWeight: 600 }}>
            {data.season}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>for {destination.name} in month {trip.month}</span>
        </div>
        <MonthGrid month={trip.month} bestMonths={destination.bestMonths} avoidMonths={destination.avoidMonths} />
      </Card>

      {/* ── Visa & Logistics ────────────────────────────────────── */}
      <Card>
        <h4 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, margin: '0 0 10px', fontSize: '0.95rem' }}>✈️ Visa & Logistics</h4>
        {/* Transport legs summary */}
        {data.itinerary.length > 0 && (
          <div style={{ marginBottom: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {['home', ...data.itinerary.map(s => s.id)].slice(0, -1).map((fromId, i) => {
              const toStop = data.itinerary[i]
              if (!toStop) return null
              const key = legKey(fromId, toStop.id)
              const lt = (trip.legTransports || {})[key] || (i === 0 ? { mode: 'flight' } : { mode: 'other' })
              const modeLabel = { flight: '✈️ Flight', car: '🚗 Car', train: '🚂 Train', bus: '🚌 Bus', other: '🚀 Other' }[lt.mode] || lt.mode
              const fromLabel = fromId === 'home' ? '🏠 Home' : (data.itinerary[i - 1]?.emoji + ' ' + data.itinerary[i - 1]?.name)
              return (
                <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', padding: '5px 8px', background: '#0f1623', borderRadius: 8, border: '1px solid #1e2d45' }}>
                  <span style={{ color: '#94a3b8' }}>{fromLabel} → {toStop.emoji} {toStop.name}</span>
                  <span style={{ color: '#3d8ef0', fontWeight: 600 }}>{modeLabel}</span>
                </div>
              )
            })}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.8rem' }}>
          {data.itinerary.map(stop => (
            <div key={stop.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8' }}>
              <span>{stop.emoji} {stop.name}</span>
              <span style={{ color: VISA_COLORS[stop.visa] || '#94a3b8', fontWeight: 600 }}>
                {VISA_LABEL[stop.visa] || stop.visa}
              </span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid #1e2d45', marginTop: 6, paddingTop: 6, color: '#94a3b8' }}>
            Flight: ~{destination.flightHours}h from Delhi
          </div>
        </div>
      </Card>

      {/* ── Savings Planner ─────────────────────────────────────── */}
      <Card>
        <h4 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, margin: '0 0 12px', fontSize: '0.95rem' }}>💰 Savings Planner</h4>
        <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 8 }}>
          Months to save: <strong style={{ color: '#f1f5f9' }}>{monthsToSave}</strong>
          <input type='range' min='1' max='24' value={monthsToSave} onChange={e => setMonthsToSave(Number(e.target.value))} style={{ marginTop: 4 }} />
        </label>
        <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 8 }}>
          I can save / month (₹)
          <input className='input-base' type='number' value={savePerMonth} onChange={e => setSavePerMonth(Number(e.target.value))} style={{ marginTop: 4 }} />
        </label>
        <div style={{ background: '#161f30', borderRadius: 8, padding: '10px 12px', fontSize: '0.8rem' }}>
          <p style={{ margin: '0 0 4px', color: '#94a3b8' }}>To reach your goal in {monthsToSave} months:</p>
          <p style={{ margin: 0, color: '#3d8ef0', fontWeight: 700, fontSize: '1rem' }}>{formatINR(data.total / monthsToSave)} / month</p>
          <p style={{ margin: '6px 0 0', color: '#94a3b8' }}>At {formatINR(savePerMonth)}/month → ready in <strong style={{ color: '#22c55e' }}>{savings.months} months</strong></p>
        </div>
      </Card>

      {/* ── Suggest Similar ─────────────────────────────────────── */}
      {alts.length > 0 && (
        <Card>
          <h4 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, margin: '0 0 10px', fontSize: '0.95rem' }}>🔍 Similar Budget Destinations</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {alts.map(a => (
              <button
                key={a.id}
                onClick={() => window.dispatchEvent(new CustomEvent('switch-destination', { detail: a.id }))}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '9px 12px', borderRadius: 10, border: '1px solid #1e2d45',
                  background: 'transparent', cursor: 'pointer', color: '#f1f5f9',
                  fontSize: '0.83rem', transition: 'border-color 0.2s, background 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#3d8ef0'; e.currentTarget.style.background = 'rgba(61,142,240,0.06)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e2d45'; e.currentTarget.style.background = 'transparent' }}
              >
                <span>{a.emoji} {a.name}, {a.country}</span>
                <span style={{ color: '#22c55e', fontWeight: 600 }}>{formatINR(Math.round(a.estimate))}</span>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* ── Action buttons ──────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Button onClick={onSave}>💾 Save Trip</Button>
        <Button variant='secondary' onClick={onCompare}>⚖️ Compare</Button>
      </div>
    </div>
  )
}

function ep(v, p) { return (v || 0) * p }
