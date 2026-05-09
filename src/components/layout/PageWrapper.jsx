import { motion } from 'framer-motion'
export default function PageWrapper({ children }) {
 return <motion.main initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.2}} className='px-4 py-4 md:px-6'>{children}</motion.main>
}
