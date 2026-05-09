import { useEffect, useState } from 'react'
export default function AnimatedNumber({ value, formatter=(v)=>v.toLocaleString('en-IN') }) {
 const [display, setDisplay] = useState(value)
 useEffect(()=>{
  let raf
  const start = display
  const delta = value - start
  const t0 = performance.now()
  const dur = 400
  const step=(t)=>{const p=Math.min(1,(t-t0)/dur); setDisplay(start + delta*p); if(p<1) raf=requestAnimationFrame(step)}
  raf=requestAnimationFrame(step)
  return ()=>cancelAnimationFrame(raf)
 }, [value])
 return <span>{formatter(Math.round(display))}</span>
}
