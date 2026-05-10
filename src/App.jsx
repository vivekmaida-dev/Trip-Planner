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
import { useUIStore } from './store/uiStore'

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
  const { sidebarOpen, setSidebarOpen } = useUIStore()

  return (
    <div style={{ minHeight: '100vh', background: '#080c14', color: '#f1f5f9', overflow: 'hidden' }}>
      <div style={{ display: 'flex', maxWidth: 1700, margin: '0 auto', position: 'relative' }}>
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 25,
              background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)',
            }}
          />
        )}

        <Sidebar />

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0, width: '100%', overflow: 'hidden' }}>
          <TopBar />
          <AnimatePresence mode='wait'>
            <Routes>
              <Route path='/' element={<Navigate to='/plan-trip' replace />} />
              {pages.map((page) => (
                <Route
                  key={page.path}
                  path={page.path}
                  element={<PageWrapper>{page.element}</PageWrapper>}
                />
              ))}
            </Routes>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default App
