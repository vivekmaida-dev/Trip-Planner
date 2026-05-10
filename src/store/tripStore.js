import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const createDefaultTrip = () => ({
  id: `trip-${Date.now()}`,
  name: '',
  destinationId: '',
  destinationIds: [],
  month: new Date().getMonth() + 1,
  startDate: '',
  endDate: '',
  days: 5,
  people: { total: 2, adults: 2, children: 0, separateKidsRoom: false },
  transport: { mode: 'flight', roundTrip: true, passengers: 2, tier: 'standard', baggage: 0, seatSelection: 0, localTransport: 800 },
  legTransports: {}, // keyed "fromId__toId" → per-leg transport config
  cityFood: {},      // keyed by cityId → { diet: 'veg'|'mix'|'nonveg' } overrides global food.diet
  stay: { type: 'hotel', tier: 'mid', rooms: 1, nights: 4, breakfastIncluded: false, mixed: [] },
  food: { diet: 'mix', mealsPerDay: 3, includeBreakfast: true, includeLunch: true, includeDinner: true, streetFood: false, drinks: 200, snacks: 100 },
  activities: [],
  extras: { insurance: 500, forex: 1, sim: 300, laundry: 100, shopping: 2500, emergencyBuffer: 10, medical: 300 },
  customSplitEnabled: false,
  customSplit: [
    { name: 'Person 1', percent: 50 },
    { name: 'Person 2', percent: 50 },
  ],
  createdAt: new Date().toISOString(),
})

export const useTripStore = create(
  persist(
    (set, get) => ({
      currentTrip: createDefaultTrip(),
      savedTrips: [],
      templates: [
        { id: 't1', name: 'Weekend Getaway', days: 3, people: 2, stayTier: 'mid' },
        { id: 't2', name: 'Week-long Hill Trip', days: 7, people: 4, stayTier: 'budget' },
        { id: 't3', name: 'International 7-day', days: 7, people: 2, stayTier: 'premium' },
        { id: 't4', name: 'Budget Backpacker', days: 6, people: 1, stayTier: 'budget' },
        { id: 't5', name: 'Luxury 5-day', days: 5, people: 2, stayTier: 'luxury' },
      ],
      saveTripDraft: (patch) => set((s) => ({ currentTrip: { ...s.currentTrip, ...patch } })),
      updateCurrentTrip: (patch) => set((s) => ({ currentTrip: { ...s.currentTrip, ...patch } })),
      saveTrip: (name) => set((s) => {
        const trip = { ...s.currentTrip, id: `trip-${Date.now()}`, name: name || s.currentTrip.name || 'Untitled Trip', createdAt: new Date().toISOString() }
        return { savedTrips: [trip, ...s.savedTrips], currentTrip: { ...s.currentTrip, name: trip.name } }
      }),
      deleteTrip: (tripId) => set((s) => ({ savedTrips: s.savedTrips.filter((t) => t.id !== tripId) })),
      duplicateTrip: (tripId) => set((s) => {
        const trip = s.savedTrips.find((t) => t.id === tripId)
        if (!trip) return s
        const copy = { ...trip, id: `trip-${Date.now()}`, name: `${trip.name} (Copy)`, createdAt: new Date().toISOString() }
        return { savedTrips: [copy, ...s.savedTrips] }
      }),
      loadTrip: (tripId) => set((s) => ({ currentTrip: s.savedTrips.find((t) => t.id === tripId) || s.currentTrip })),
      clearCurrent: () => set({ currentTrip: createDefaultTrip() }),
      saveAsTemplate: (trip) => set((s) => ({ templates: [...s.templates, { id: `t-${Date.now()}`, name: trip.name || 'Custom Template', days: trip.days, people: trip.people.total, stayTier: trip.stay.tier }] })),
      applyTemplate: (templateId) => set((s) => {
        const t = s.templates.find((x) => x.id === templateId)
        if (!t) return s
        return { currentTrip: { ...s.currentTrip, days: t.days, people: { ...s.currentTrip.people, total: t.people, adults: t.people }, stay: { ...s.currentTrip.stay, tier: t.stayTier } } }
      }),
      importTrips: (trips) => set((s) => ({ savedTrips: [...trips, ...s.savedTrips] })),
    }),
    { name: 'trip-store-v1' },
  ),
)
