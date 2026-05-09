import Tooltip from '../ui/Tooltip'
export default function MonthGrid({ bestMonths=[], avoidMonths=[], month=1 }) {
 const names=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
 return <div className='grid grid-cols-6 gap-2 sm:grid-cols-12'>{names.map((m,i)=>{const n=i+1; const best=bestMonths.includes(n); const avoid=avoidMonths.includes(n); const monsoon=[6,7,8].includes(n); const cls = avoid?'bg-red-500/20 text-red-300':best?'bg-accent-green/20 text-accent-green':monsoon?'bg-blue-500/20 text-blue-300':'bg-accent-yellow/15 text-accent-yellow'; return <Tooltip key={m} text={best?'Ideal month':avoid?'Avoid due to weather':monsoon?'Monsoon risk':'Shoulder season'}><div className={`rounded-lg px-2 py-1 text-center text-xs ${cls} ${month===n?'ring-1 ring-accent-blue':''}`}>{m}</div></Tooltip>})}</div>
}
