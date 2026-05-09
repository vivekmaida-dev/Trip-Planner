export default function Button({ children, className='', variant='primary', ...props }) {
  const variants={primary:'bg-accent-blue text-white hover:bg-blue-500',secondary:'bg-bg-elevated text-text-primary border border-border-subtle hover:border-accent-blue',danger:'bg-red-500/20 text-red-300 border border-red-400/30'}
  return <button className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${variants[variant]} ${className}`} {...props}>{children}</button>
}
