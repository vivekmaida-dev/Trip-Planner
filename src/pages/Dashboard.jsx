import Card from '../components/ui/Card'
import { useTripStore } from '../store/tripStore'
import DonutChart from '../components/charts/DonutChart'
import { formatINR } from '../utils/formatters'

export default function Dashboard(){
 const { savedTrips } = useTripStore()
 const totalSpend=savedTrips.reduce((s,t)=>s+(t.total||0),0)
 const avg = savedTrips.length ? totalSpend / savedTrips.length : 0
 const countries = new Set(savedTrips.map((t)=>t.country).filter(Boolean)).size
 const chart=[{name:'Transport',value:Math.max(1,totalSpend*0.3)},{name:'Stay',value:Math.max(1,totalSpend*0.25)},{name:'Food',value:Math.max(1,totalSpend*0.2)},{name:'Activities',value:Math.max(1,totalSpend*0.15)},{name:'Extras',value:Math.max(1,totalSpend*0.1)}]
 return <div className='space-y-4'><div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'><Card><p className='text-xs text-text-secondary'>Total trips planned</p><p className='font-display text-2xl'>{savedTrips.length}</p></Card><Card><p className='text-xs text-text-secondary'>Countries covered</p><p className='font-display text-2xl'>{countries}</p></Card><Card><p className='text-xs text-text-secondary'>Average trip budget</p><p className='font-display text-2xl'>{formatINR(avg)}</p></Card><Card><p className='text-xs text-text-secondary'>Total planned spend</p><p className='font-display text-2xl'>{formatINR(totalSpend)}</p></Card></div><div className='grid gap-4 xl:grid-cols-2'><Card><h3 className='section-title'>Recent Trips</h3>{savedTrips.slice(0,5).map((t)=><p key={t.id} className='border-t border-border-subtle py-2 text-sm'>{t.name}</p>)}{savedTrips.length===0 && <p className='text-sm text-text-secondary'>No trips yet.</p>}</Card><Card><h3 className='section-title'>Budget Distribution</h3><DonutChart data={chart}/></Card></div></div>
}
