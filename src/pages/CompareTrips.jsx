import { useMemo, useState } from 'react'
import Card from '../components/ui/Card'
import ComparisonChart from '../components/charts/ComparisonChart'
import { useTripStore } from '../store/tripStore'
import { formatINR } from '../utils/formatters'

const categories=['transport','stay','food','activities','extras']

export default function CompareTrips(){
 const { savedTrips } = useTripStore()
 const [a,setA]=useState(savedTrips[0]?.id || '')
 const [b,setB]=useState(savedTrips[1]?.id || '')
 const tripA=savedTrips.find((t)=>t.id===a)
 const tripB=savedTrips.find((t)=>t.id===b)
 const data=useMemo(()=>categories.map((c)=>({category:c,tripA:tripA?.totals?.[c] || 0, tripB:tripB?.totals?.[c] || 0})),[tripA,tripB])
 return <div className='space-y-4'><Card><h2 className='section-title'>Compare Trips</h2><div className='grid gap-2 sm:grid-cols-2'><select className='input-base' value={a} onChange={(e)=>setA(e.target.value)}>{savedTrips.map((t)=><option key={t.id} value={t.id}>{t.name}</option>)}</select><select className='input-base' value={b} onChange={(e)=>setB(e.target.value)}>{savedTrips.map((t)=><option key={t.id} value={t.id}>{t.name}</option>)}</select></div></Card><Card><ComparisonChart data={data}/></Card><Card><table className='w-full text-sm'><thead><tr className='text-left text-text-secondary'><th>Category</th><th>Trip A</th><th>Trip B</th><th>Winner</th></tr></thead><tbody>{data.map((r)=><tr key={r.category} className='border-t border-border-subtle'><td className='py-2 capitalize'>{r.category}</td><td>{formatINR(r.tripA)}</td><td>{formatINR(r.tripB)}</td><td className='text-accent-green'>{r.tripA<=r.tripB?'Trip A':'Trip B'}</td></tr>)}</tbody></table></Card></div>
}
