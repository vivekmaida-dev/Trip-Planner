import { useMemo, useState } from 'react'
import Card from '../components/ui/Card'
import AnimatedNumber from '../components/ui/AnimatedNumber'
import Button from '../components/ui/Button'
import DonutChart from '../components/charts/DonutChart'
import BudgetBars from '../components/charts/BudgetBars'
import MonthGrid from '../components/charts/MonthGrid'
import { formatINR } from '../utils/formatters'
import { calculateActivitiesCost, calculateExtrasCost, calculateFoodCost, calculateHotelCost, calculatePerPerson, calculateSavings, calculateTotal, calculateTransportCost, suggestAlternatives } from '../utils/budgetCalc'
import { seasonFromMonth } from '../utils/dateUtils'

export default function OutputPanel({ trip, destination, onSave, onCompare, allDestinations }) {
 const [monthsToSave, setMonthsToSave] = useState(6)
 const [savePerMonth, setSavePerMonth] = useState(10000)
 const data = useMemo(()=>{
  if(!destination) return null
  const season = seasonFromMonth(trip.month, destination)
  const transport = calculateTransportCost(trip.transport, destination, { days: trip.days })
  const stay = calculateHotelCost(trip.stay.tier, trip.stay.rooms, trip.stay.nights, season, destination.hotelBase)
  const food = calculateFoodCost(destination.foodPerMeal, trip.people.adults + trip.people.children*0.5, trip.days, trip.food.diet, trip.stay.tier, trip.food)
  const activities = calculateActivitiesCost(trip.activities, trip.people.adults, trip.people.children) + (trip.equipmentRental||0) + ((trip.guideFee||0) * trip.days)
  const extrasBase = (trip.visaFee||0)*(trip.people.total) + e(trip.extras.insurance, trip.people.total) + e(trip.extras.sim, trip.people.total) + e(trip.extras.laundry, trip.people.total) + trip.extras.shopping + trip.extras.medical
  const extras = calculateExtrasCost(0,0,trip.extras.forex,0,0,0,trip.extras.emergencyBuffer,extrasBase, transport+stay+food+activities)
  const total = calculateTotal({ transport, stay, food, activities, extras })
  const perPerson = calculatePerPerson(total, trip.people.total, trip.customSplitEnabled ? trip.customSplit : null)
  return { season, transport, stay, food, activities, extras, total, perPerson }
 }, [trip, destination])

 if(!destination || !data) return <Card className='sticky top-20'>Select a destination to view budget output.</Card>
 const chartData=[{name:'Transport',value:data.transport},{name:'Stay',value:data.stay},{name:'Food',value:data.food},{name:'Activities',value:data.activities},{name:'Extras',value:data.extras}]
 const savings = calculateSavings(data.total, 0, savePerMonth)
 const alts = suggestAlternatives(data.total, destination, allDestinations)

 return <div className='sticky top-20 space-y-4'><Card><p className='text-sm text-text-secondary'>Grand Total</p><p className='font-display text-3xl'><AnimatedNumber value={data.total} formatter={formatINR} /></p><div className='mt-2 grid grid-cols-2 gap-2 text-xs text-text-secondary'><p>Per person: {formatINR(data.total / Math.max(trip.people.total,1))}</p><p>Per day: {formatINR(data.total / Math.max(trip.days,1))}</p><p>Currency ({destination.currency}): {(data.total * destination.exchangeRate).toFixed(0)}</p><p>CO2 footprint: {Math.round(data.transport/100)} kg</p></div></Card>
<Card><DonutChart data={chartData} /><BudgetBars items={chartData} total={data.total} /></Card>
<Card><h4 className='mb-2 font-display'>Season & Timing</h4><p className='text-sm text-text-secondary'>Current season: {data.season}</p><MonthGrid month={trip.month} bestMonths={destination.bestMonths} avoidMonths={destination.avoidMonths}/></Card>
<Card><h4 className='mb-2 font-display'>Visa & Logistics</h4><p className='text-sm text-text-secondary'>Visa: {destination.visa} • {destination.visaNote}</p><p className='text-sm text-text-secondary'>Flight hours: {destination.flightHours}h</p></Card>
<Card><h4 className='mb-2 font-display'>Savings Planner</h4><label className='text-xs'>Months to save: {monthsToSave}<input type='range' min='1' max='24' value={monthsToSave} onChange={(e)=>setMonthsToSave(Number(e.target.value))}/></label><label className='mt-2 block text-xs'>I can save/month<input className='input-base mt-1' type='number' value={savePerMonth} onChange={(e)=>setSavePerMonth(Number(e.target.value))}/></label><p className='mt-2 text-sm text-text-secondary'>Save {formatINR(data.total / monthsToSave)} / month or be ready in {savings.months} months at your current capacity.</p></Card>
<Card><h4 className='mb-2 font-display'>Suggest Similar</h4><div className='space-y-2'>{alts.map((a)=><button key={a.id} className='w-full rounded-lg border border-border-subtle p-2 text-left text-sm hover:border-accent-blue' onClick={()=>window.dispatchEvent(new CustomEvent('switch-destination',{detail:a.id}))}>{a.emoji} {a.name} • ₹{Math.round(a.estimate).toLocaleString('en-IN')}</button>)}</div></Card>
<div className='grid grid-cols-2 gap-2'><Button onClick={onSave}>Save Trip</Button><Button variant='secondary' onClick={onCompare}>Compare</Button></div></div>
}
function e(v,p){return (v||0)*p}
