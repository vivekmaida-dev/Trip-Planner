export default function Slider({ label, value, onChange, min=0, max=100, step=1, suffix='' }) {
  return <label className='block space-y-2'><span className='text-xs text-text-secondary'>{label}: <strong>{value}{suffix}</strong></span><input type='range' min={min} max={max} step={step} value={value} onChange={(e)=>onChange(Number(e.target.value))} /></label>
}
