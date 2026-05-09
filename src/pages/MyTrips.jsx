import { useMemo, useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useTripStore } from '../store/tripStore'
import { formatINR } from '../utils/formatters'

export default function MyTrips(){
 const { savedTrips, loadTrip, deleteTrip, duplicateTrip, saveAsTemplate, importTrips } = useTripStore()
 const [sortBy,setSortBy]=useState('createdAt')
 const [filter,setFilter]=useState('all')
 const sorted=useMemo(()=>[...savedTrips].filter((t)=>filter==='all'?true:filter==='domestic'?t.destinationType==='domestic':t.destinationType==='international').sort((a,b)=>sortBy==='budget'?(b.total||0)-(a.total||0):new Date(b.createdAt)-new Date(a.createdAt)),[savedTrips,sortBy,filter])
 const exportJSON=()=>{ const blob=new Blob([JSON.stringify(savedTrips,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='trips-export.json'; a.click() }
 const importJSON=(f)=>{ const r=new FileReader(); r.onload=()=>{ try{ importTrips(JSON.parse(String(r.result))) }catch{} }; r.readAsText(f) }
 return <div className='space-y-4'><Card><div className='flex flex-wrap items-center gap-2'><select className='input-base max-w-56' value={sortBy} onChange={(e)=>setSortBy(e.target.value)}><option value='createdAt'>Date created</option><option value='tripDate'>Trip date</option><option value='budget'>Budget</option><option value='destination'>Destination</option></select><select className='input-base max-w-56' value={filter} onChange={(e)=>setFilter(e.target.value)}><option value='all'>All</option><option value='domestic'>Domestic</option><option value='international'>International</option></select><Button onClick={exportJSON}>Export JSON</Button><label className='tab-btn cursor-pointer'>Import JSON<input type='file' accept='application/json' className='hidden' onChange={(e)=>e.target.files?.[0] && importJSON(e.target.files[0])}/></label></div></Card>{sorted.length===0?<Card>No saved trips yet.</Card>:<div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-3'>{sorted.map((t)=><Card key={t.id}><h3 className='font-display text-lg'>{t.name}</h3><p className='text-sm text-text-secondary'>{t.startDate || 'Date TBD'} • {t.days} days</p><p className='mt-2 text-sm'>Per person: {formatINR((t.total||0)/Math.max(t.people?.total||1,1))}</p><div className='mt-3 flex flex-wrap gap-2'><button className='tab-btn' onClick={()=>loadTrip(t.id)}>View</button><button className='tab-btn' onClick={()=>loadTrip(t.id)}>Edit</button><button className='tab-btn' onClick={()=>duplicateTrip(t.id)}>Duplicate</button><button className='tab-btn' onClick={()=>saveAsTemplate(t)}>Template</button><button className='tab-btn text-red-300' onClick={()=>deleteTrip(t.id)}>Delete</button></div></Card>)}</div>}</div>
}
