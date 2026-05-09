export default function PriceTile({ title, subtitle, price, selected, onClick }) {
 return <button type='button' onClick={onClick} className={`w-full rounded-xl border p-3 text-left transition ${selected?'border-accent-blue bg-accent-blue/10':'border-border-subtle bg-bg-elevated/50 hover:border-accent-blue/60'}`}>
  <p className='text-sm text-text-primary'>{title}</p><p className='text-xs text-text-secondary'>{subtitle}</p><p className='mt-1 font-semibold'>₹{Math.round(price).toLocaleString('en-IN')}</p>
 </button>
}
