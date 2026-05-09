import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUIStore = create(
  persist(
    (set) => ({
      activePage: 'plan-trip',
      sidebarOpen: false,
      compareQueue: [],
      notifications: [],
      setActivePage: (page) => set({ activePage: page }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      addToCompare: (tripId) => set((s) => ({ compareQueue: [...new Set([...s.compareQueue, tripId])].slice(-2) })),
      removeFromCompare: (tripId) => set((s) => ({ compareQueue: s.compareQueue.filter((id) => id !== tripId) })),
      pushNotification: (text) => set((s) => ({ notifications: [{ id: Date.now(), text }, ...s.notifications].slice(0, 5) })),
      dismissNotification: (id) => set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
    }),
    { name: 'ui-store-v1' },
  ),
)
