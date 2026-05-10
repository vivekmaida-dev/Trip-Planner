import { LayoutDashboard, PlaneTakeoff, Scale, HandCoins, PiggyBank, FolderKanban, Settings } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useUIStore } from '../../store/uiStore'

const nav=[['/dashboard','Dashboard',LayoutDashboard],['/plan-trip','Plan Trip',PlaneTakeoff],['/compare-trips','Compare Trips',Scale],['/expense-tracker','Expense Tracker',HandCoins],['/savings-planner','Savings Planner',PiggyBank],['/my-trips','My Trips',FolderKanban],['/settings','Settings',Settings]]

export default function Sidebar(){
 const { sidebarOpen, setSidebarOpen } = useUIStore()
 return <aside
  style={{ top: 0, flexShrink: 0 }}
  className={`fixed z-30 h-screen w-64 border-r border-border-subtle bg-bg-card/95 p-4 overflow-y-auto
    md:sticky md:top-0 md:h-screen md:translate-x-0
    ${sidebarOpen?'translate-x-0':'-translate-x-full'} transition-transform duration-200`}
 >
  <div className='mb-6 flex items-center justify-between'>
   <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:'1.1rem', fontWeight:700, margin:0, background:'linear-gradient(135deg,#3d8ef0,#a855f7)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Trip Budget</h1>
   <button className='md:hidden flex items-center justify-center w-8 h-8 rounded-lg border border-border-subtle text-text-secondary hover:text-text-primary' onClick={()=>setSidebarOpen(false)}>✕</button>
  </div>
  <nav className='space-y-1'>
   {nav.map(([to,label,Icon])=>(
    <NavLink key={to} to={to} onClick={()=>setSidebarOpen(false)} className={({isActive})=>`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${isActive?'bg-accent-blue/20 text-text-primary font-medium':'text-text-secondary hover:bg-bg-elevated'}`}>
     <Icon size={16}/>{label}
    </NavLink>
   ))}
  </nav>
 </aside>
}
