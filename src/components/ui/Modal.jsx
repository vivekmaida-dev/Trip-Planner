export default function Modal({ open, title, children, onClose }) {
 if(!open) return null
 return <div className='fixed inset-0 z-50 grid place-items-center bg-black/50 p-4'><div className='glass-card w-full max-w-lg p-4'><div className='mb-3 flex items-center justify-between'><h3 className='font-display text-lg'>{title}</h3><button onClick={onClose}>✕</button></div>{children}</div></div>
}
