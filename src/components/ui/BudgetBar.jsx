import { formatINR } from '../../utils/formatters'
export default function BudgetBar({ label, value, total, color='bg-accent-blue' }) {
 const width = total ? Math.max(2,(value/total)*100) : 0
 return <div className='space-y-1'><div className='flex justify-between text-xs text-text-secondary'><span>{label}</span><span>{formatINR(value)}</span></div><div className='h-2 rounded-full bg-bg-elevated'><div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{width:`${width}%`}}/></div></div>
}
