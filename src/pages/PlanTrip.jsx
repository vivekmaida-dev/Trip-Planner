import { useEffect, useMemo } from 'react'
import DestinationSection from '../sections/DestinationSection'
import DatesSection from '../sections/DatesSection'
import TransportSection from '../sections/TransportSection'
import StaySection from '../sections/StaySection'
import FoodSection from '../sections/FoodSection'
import GroupSection from '../sections/GroupSection'
import ActivitiesSection from '../sections/ActivitiesSection'
import MoneySection from '../sections/MoneySection'
import OutputPanel from '../sections/OutputPanel'
import { destinationsData } from '../data/destinations'
import { useTripStore } from '../store/tripStore'
import { useUIStore } from '../store/uiStore'

export default function PlanTrip(){
 const { currentTrip, updateCurrentTrip, saveTrip } = useTripStore()
 const { addToCompare, pushNotification } = useUIStore()
 const destination = useMemo(()=>destinationsData.find((d)=>d.id===currentTrip.destinationId), [currentTrip.destinationId])
 useEffect(()=>{
  const listener=(ev)=>updateCurrentTrip({ destinationId:ev.detail })
  window.addEventListener('switch-destination', listener)
  return ()=>window.removeEventListener('switch-destination', listener)
 }, [updateCurrentTrip])
 const onSave = ()=>{ saveTrip(currentTrip.name || (destination ? `${destination.name} Trip` : 'New Trip')); pushNotification('Trip saved') }
 const onCompare = ()=>{ if(currentTrip.id) addToCompare(currentTrip.id); pushNotification('Added to compare queue') }

 return <div className='grid gap-4 lg:grid-cols-[1.15fr_.85fr]'><div className='space-y-4'><DestinationSection trip={currentTrip} onUpdate={updateCurrentTrip}/><DatesSection trip={currentTrip} destination={destination} onUpdate={updateCurrentTrip}/><TransportSection trip={currentTrip} destination={destination} onUpdate={updateCurrentTrip}/><StaySection trip={currentTrip} destination={destination} onUpdate={updateCurrentTrip}/><FoodSection trip={currentTrip} onUpdate={updateCurrentTrip}/><GroupSection trip={currentTrip} onUpdate={updateCurrentTrip}/><ActivitiesSection trip={currentTrip} destination={destination} onUpdate={updateCurrentTrip}/><MoneySection trip={currentTrip} destination={destination} onUpdate={updateCurrentTrip}/></div><OutputPanel trip={currentTrip} destination={destination} onSave={onSave} onCompare={onCompare} allDestinations={destinationsData}/></div>
}
