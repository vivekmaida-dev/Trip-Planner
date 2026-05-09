export default function Toggle({ label, checked, onChange }) {
  return <label className='flex items-center justify-between gap-3 text-sm'><span>{label}</span><button type='button' onClick={()=>onChange(!checked)} className={`h-6 w-11 rounded-full border transition ${checked?'bg-accent-blue border-accent-blue':'bg-bg-elevated border-border-subtle'}`}><span className={`block h-5 w-5 rounded-full bg-white transition ${checked?'translate-x-5':'translate-x-0'}`} /></button></label>
}
