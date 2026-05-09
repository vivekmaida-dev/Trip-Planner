import { Navigate, Route, Routes } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Sidebar from './components/layout/Sidebar'
import TopBar from './components/layout/TopBar'
import PageWrapper from './components/layout/PageWrapper'
import Dashboard from './pages/Dashboard'
import PlanTrip from './pages/PlanTrip'
import CompareTrips from './pages/CompareTrips'
import ExpenseTracker from './pages/ExpenseTracker'
import SavingsPlanner from './pages/SavingsPlanner'
import MyTrips from './pages/MyTrips'
import Settings from './pages/Settings'

const pages = [
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/plan-trip', element: <PlanTrip /> },
  { path: '/compare-trips', element: <CompareTrips /> },
  { path: '/expense-tracker', element: <ExpenseTracker /> },
  { path: '/savings-planner', element: <SavingsPlanner /> },
  { path: '/my-trips', element: <MyTrips /> },
  { path: '/settings', element: <Settings /> },
]

function App() {
  return (
    <div className='min-h-screen bg-primary text-text-primary'>
      <div className='mx-auto flex max-w-[1700px]'>
        <Sidebar />
        <div className='min-w-0 flex-1'>
          <TopBar />
          <AnimatePresence mode='wait'>
            <Routes>
              <Route path='/' element={<Navigate to='/plan-trip' replace />} />
              {pages.map((page) => (
                <Route key={page.path} path={page.path} element={<PageWrapper>{page.element}</PageWrapper>} />
              ))}
            </Routes>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default App
