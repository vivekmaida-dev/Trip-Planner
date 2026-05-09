import BudgetBar from '../ui/BudgetBar'
export default function BudgetBars({ items, total }) {
 return <div className='space-y-2'>{items.map((x,i)=><BudgetBar key={x.name} label={x.name} value={x.value} total={total} color={['bg-accent-blue','bg-accent-green','bg-accent-purple','bg-accent-orange','bg-accent-yellow'][i%5]} />)}</div>
}
