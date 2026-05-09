export default function Badge({ children, tone='blue' }) {
 const map={blue:'bg-accent-blue/15 text-accent-blue',green:'bg-accent-green/15 text-accent-green',orange:'bg-accent-orange/15 text-accent-orange',yellow:'bg-accent-yellow/15 text-accent-yellow',purple:'bg-accent-purple/15 text-accent-purple'}
 return <span className={`rounded-full px-2 py-1 text-xs ${map[tone]}`}>{children}</span>
}
