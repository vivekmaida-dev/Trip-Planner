import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import { calcTripDays, effectiveLeaves, listHolidayHits, seasonFromMonth } from '../utils/dateUtils'

export default function DatesSection({ trip, destination, onUpdate }) {
 const days = calcTripDays(trip.startDate, trip.endDate) || trip.days
 const season = seasonFromMonth(trip.month, destination)
 const holidays = listHolidayHits(trip.startDate, trip.endDate)
 const multiplier = { peak:1.4, shoulder:1, off_peak:0.75, monsoon:0.6 }[season]
 return <Card><h3 className='section-title'>Dates & Timing</h3><div className='grid gap-3 sm:grid-cols-3'><label><span className='text-xs text-text-secondary'>Travel month</span><select className='input-base' value={trip.month} onChange={(e)=>onUpdate({ month:Number(e.target.value) })}>{Array.from({length:12},(_,i)=><option key={i+1} value={i+1}>{i+1}</option>)}</select></label><label><span className='text-xs text-text-secondary'>Start date</span><input className='input-base' type='date' value={trip.startDate} onChange={(e)=>onUpdate({ startDate:e.target.value })} /></label><label><span className='text-xs text-text-secondary'>End date</span><input className='input-base' type='date' value={trip.endDate} onChange={(e)=>onUpdate({ endDate:e.target.value, days })} /></label></div>
 <div className='mt-3 grid gap-2 sm:grid-cols-2 text-sm'><p>Trip duration: <strong>{days} days</strong></p><p>Effective leave days: <strong>{effectiveLeaves(trip.startDate, trip.endDate)}</strong></p></div>
 <div className='mt-2 flex items-center gap-2'><Badge tone='yellow'>Season: {season}</Badge><Badge tone='blue'>Multiplier x{multiplier}</Badge></div>
 {holidays.length>0 && <ul className='mt-2 text-xs text-text-secondary'>{holidays.map((h)=><li key={h.date}>{h.date}: {h.holiday.name}</li>)}</ul>}
 </Card>
}
