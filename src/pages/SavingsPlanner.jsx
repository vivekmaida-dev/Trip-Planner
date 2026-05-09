import { useMemo, useState } from 'react'
import Card from '../components/ui/Card'
import SavingsTimeline from '../components/charts/SavingsTimeline'
import { destinationsData } from '../data/destinations'
import { formatINR } from '../utils/formatters'

export default function SavingsPlanner(){
 const [target, setTarget]=useState(120000)
 const [current, setCurrent]=useState(15000)
 const [monthly, setMonthly]=useState(12000)
 const [months, setMonths]=useState(8)
 const projection = useMemo(()=>{ const rem=Math.max(0,target-current); return { monthlyNeed: rem/Math.max(months,1), monthsNeed: Math.ceil(rem/Math.max(monthly,1)) } }, [target,current,monthly,months])
 const alternatives = useMemo(()=>destinationsData.slice(0,4).map((d)=>({ ...d, estimate:d.flight[1]*2 + d.hotelBase.mid*5 })).filter((d)=>d.estimate<=target),[target])
 return <div className='space-y-4'><Card><h2 className='section-title'>Savings Planner</h2><div className='grid gap-2 sm:grid-cols-4'><input className='input-base' type='number' value={target} onChange={(e)=>setTarget(Number(e.target.value))} placeholder='Target budget'/><input className='input-base' type='number' value={current} onChange={(e)=>setCurrent(Number(e.target.value))} placeholder='Current savings'/><input className='input-base' type='number' value={monthly} onChange={(e)=>setMonthly(Number(e.target.value))} placeholder='Monthly capacity'/><input className='input-base' type='number' value={months} onChange={(e)=>setMonths(Number(e.target.value))} placeholder='Months to save'/></div><p className='mt-2 text-sm text-text-secondary'>Need {formatINR(projection.monthlyNeed)} / month to hit in {months} month(s). At current pace: {projection.monthsNeed} month(s).</p></Card><Card><SavingsTimeline total={target} current={current} monthly={monthly}/></Card><Card><h3 className='section-title'>Month-by-month</h3><div className='max-h-64 overflow-auto'><table className='w-full text-sm'><tbody>{Array.from({length:Math.max(months,1)},(_,i)=><tr key={i} className='border-t border-border-subtle'><td className='py-1'>Month {i+1}</td><td>{formatINR(current + monthly*(i+1))}</td></tr>)}</tbody></table></div></Card><Card><h3 className='section-title'>With this budget, you could go to...</h3><div className='grid gap-2 sm:grid-cols-2'>{alternatives.slice(0,6).map((a)=><div key={a.id} className='rounded-xl border border-border-subtle p-2 text-sm'>{a.emoji} {a.name} • {formatINR(a.estimate)}</div>)}</div></Card></div>
}
