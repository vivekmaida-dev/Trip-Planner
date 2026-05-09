import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const homeCities = ['Delhi','Mumbai','Bengaluru','Hyderabad','Chennai','Kolkata','Pune','Ahmedabad','Jaipur','Lucknow']

export const useSettingsStore = create(
  persist(
    (set) => ({
      homeCity: 'Delhi',
      defaultCurrency: 'INR',
      preferences: {
        defaultGroupSize: 2,
        preferredTransportMode: 'flight',
        defaultHotelTier: 'mid',
        notifications: true,
      },
      updateSettings: (patch) => set((s) => ({ ...s, ...patch })),
      updatePreferences: (patch) => set((s) => ({ preferences: { ...s.preferences, ...patch } })),
    }),
    { name: 'settings-store-v1' },
  ),
)
