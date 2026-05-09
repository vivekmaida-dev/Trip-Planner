import { Menu, Bell } from 'lucide-react'
import { useUIStore } from '../../store/uiStore'

export default function TopBar(){
 const { setSidebarOpen, notifications } = useUIStore()
 return <header className='sticky top-0 z-20 border-b border-border-subtle bg-bg-primary/90 px-4 py-3 backdrop-blur md:px-6'><div className='flex items-center justify-between'><button className='md:hidden' onClick={()=>setSidebarOpen(true)}><Menu /></button><p className='font-display text-lg'>Plan better. Spend smarter.</p><button className='relative rounded-full border border-border-subtle p-2'><Bell size={16}/>{notifications.length>0 && <span className='absolute -right-1 -top-1 h-3 w-3 rounded-full bg-accent-orange'/>}</button></div></header>
}
