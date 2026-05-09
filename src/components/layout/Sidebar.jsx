import { LayoutDashboard, PlaneTakeoff, Scale, HandCoins, PiggyBank, FolderKanban, Settings } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useUIStore } from '../../store/uiStore'

const nav=[['/dashboard','Dashboard',LayoutDashboard],['/plan-trip','Plan Trip',PlaneTakeoff],['/compare-trips','Compare Trips',Scale],['/expense-tracker','Expense Tracker',HandCoins],['/savings-planner','Savings Planner',PiggyBank],['/my-trips','My Trips',FolderKanban],['/settings','Settings',Settings]]

export default function Sidebar(){
 const { sidebarOpen, setSidebarOpen } = useUIStore()
 return <aside className={`fixed z-30 h-screen w-72 border-r border-border-subtle bg-bg-card/95 p-4 md:sticky md:translate-x-0 ${sidebarOpen?'translate-x-0':'-translate-x-full'} transition-transform md:block`}>
  <div className='mb-6 flex items-center justify-between'><h1 className='font-display text-xl gradient-text'>Trip Budget Planner</h1><button className='md:hidden' onClick={()=>setSidebarOpen(false)}>✕</button></div>
  <nav className='space-y-1'>{nav.map(([to,label,Icon])=><NavLink key={to} to={to} className={({isActive})=>`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${isActive?'bg-accent-blue/20 text-text-primary':'text-text-secondary hover:bg-bg-elevated'}`}><Icon size={16}/>{label}</NavLink>)}</nav>
 </aside>
}
