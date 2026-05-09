export default function SavingsTimeline({ total=0, current=0, monthly=10000 }) {
 const remain=Math.max(0,total-current); const months=Math.max(1,Math.ceil(remain/monthly)); const pct= total?Math.min(100,(current/total)*100):0
 return <div className='space-y-3'><div className='h-3 rounded-full bg-bg-elevated'><div className='h-3 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple' style={{width:`${pct}%`}}/></div><p className='text-xs text-text-secondary'>Projected completion in {months} month(s)</p></div>
}
