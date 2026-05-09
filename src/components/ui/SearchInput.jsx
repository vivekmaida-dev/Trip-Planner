import { Search } from 'lucide-react'
export default function SearchInput(props){
 return <div className='relative'><Search size={16} className='absolute left-3 top-2.5 text-text-muted'/><input className='input-base pl-9' {...props} /></div>
}
