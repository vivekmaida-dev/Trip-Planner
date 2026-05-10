import { Menu, Bell } from 'lucide-react'
import { useUIStore } from '../../store/uiStore'

export default function TopBar(){
 const { setSidebarOpen, notifications } = useUIStore()
 return (
  <header className='sticky top-0 z-20 border-b border-border-subtle bg-bg-primary/90 px-3 py-3 backdrop-blur md:px-6' style={{ minWidth: 0 }}>
   <div className='flex items-center gap-3'>
    <button className='md:hidden flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl border border-border-subtle text-text-secondary' onClick={()=>setSidebarOpen(true)}>
     <Menu size={18}/>
    </button>
    <p className='font-display text-base md:text-lg flex-1 min-w-0 truncate'>Plan better. Spend smarter.</p>
    <button className='relative flex-shrink-0 rounded-full border border-border-subtle p-2'>
     <Bell size={16}/>
     {notifications.length>0 && <span className='absolute -right-1 -top-1 h-3 w-3 rounded-full bg-accent-orange'/>}
    </button>
   </div>
  </header>
 )
}
