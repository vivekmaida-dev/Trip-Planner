import { transportCo2 } from './co2Calculator'

export const applySeasonMultiplier = (basePrice, season) => {
  const map = { peak: 1.4, shoulder: 1, off_peak: 0.75, monsoon: 0.6 }
  return basePrice * (map[season] || 1)
}

export const calculateFuelCost = (distance, kmpl, fuelPrice, numVehicles) => ((distance * 2) / Math.max(kmpl, 1)) * fuelPrice * numVehicles

export const calculateTransportCost = (transport, dest, config = {}) => {
  const ppl = transport.passengers || 1
  if (transport.mode === 'flight') {
    const tier = transport.tier === 'budget' ? 0 : transport.tier === 'peak' ? 2 : 1
    const base = (dest.flight?.[tier] || 6500) * (transport.roundTrip ? 2 : 1) * ppl
    const baggage = (transport.baggage || 0) * ppl
    const seat = (transport.seatSelection || 0) * ppl
    return base + baggage + seat + (transport.airportDeparture || 0) + (transport.airportArrival || 0)
  }
  if (transport.mode === 'train') {
    const classIdx = transport.classTier === '2ac' ? 2 : transport.classTier === '3ac' ? 1 : 0
    let fare = (dest.train?.[classIdx] || 2200) * ppl
    if (transport.tatkal) fare *= 1.3
    if (transport.meals) fare += 200 * ppl * Math.max(config.days || 1, 1)
    return fare + (transport.stationTransfer || 0)
  }
  if (transport.mode === 'bus') {
    const idx = transport.busTier === 'luxury' ? 2 : transport.busTier === 'ac' ? 1 : 0
    return (dest.bus?.[idx] || 1500) * ppl + (transport.stationTransfer || 0)
  }
  if (transport.mode === 'car') {
    const fuel = calculateFuelCost(dest.distance || 300, transport.kmpl || 15, transport.fuelPrice || 103, transport.vehicles || 1)
    const driver = transport.hireDriver ? (transport.driverRate || 900) * (config.days || 1) * (transport.vehicles || 1) : 0
    const parking = (transport.parkingPerDay || 100) * (config.days || 1)
    const rental = transport.vehicleType === 'rented' ? (transport.rentalPerDay || 1500) * (config.days || 1) : 0
    return fuel + driver + parking + (transport.toll || 0) + rental
  }
  return Number(transport.amount || 0) + Number(transport.localTransport || 0)
}

export const calculateHotelCost = (tier, rooms, nights, season, destBase) => applySeasonMultiplier((destBase?.[tier] || 3000) * rooms * nights, season)

export const calculateFoodCost = (meals, people, days, diet, tier, extras = {}) => {
  const type = diet === 'veg' ? 'veg' : diet === 'nonveg' ? 'nonveg' : 'veg'
  const unit = meals[type]?.[tier] || 250
  const multiplier = extras.streetFood ? 0.6 : 1
  const breakfast = extras.includeBreakfast ? unit * 0.7 : 0
  const lunch = extras.includeLunch ? unit : 0
  const dinner = extras.includeDinner ? unit * 1.15 : 0
  const base = (breakfast + lunch + dinner) * people * days * multiplier
  return base + (extras.drinks || 0) * people * days + (extras.snacks || 0) * days
}

export const calculateActivitiesCost = (activities, people, children) => activities.reduce((sum, a) => {
  const count = a.perPerson ? people + children * 0.5 : 1
  return sum + (a.cost || 0) * count
}, 0)

export const calculateExtrasCost = (visa, insurance, forex, sim, laundry, shopping, buffer, misc, subtotal=0) => {
  const base = visa + insurance + sim + laundry + shopping + misc
  return base + subtotal * ((forex + buffer) / 100)
}

export const calculateTotal = (parts) => Object.values(parts).reduce((a, b) => a + b, 0)

export const calculatePerPerson = (total, people, customSplit) => {
  if (customSplit?.length) return customSplit.map((p) => ({ ...p, amount: (total * p.percent) / 100 }))
  return [{ name: 'Per person', percent: 100 / people, amount: total / Math.max(people, 1) }]
}

export const calculateCO2 = (transport, vehicle, distance, people) => transportCo2({ mode: transport, vehicles: vehicle, distance, passengers: people })

export const calculateSavings = (total, currentSavings, monthlyCapacity) => {
  const left = Math.max(0, total - currentSavings)
  const months = Math.max(1, Math.ceil(left / Math.max(monthlyCapacity, 1)))
  return { remaining: left, months, monthlyNeeded: left / months }
}

export const suggestAlternatives = (budget, currentDest, allDests) =>
  allDests.filter((d) => d.id !== currentDest?.id)
    .map((d) => ({ ...d, estimate: (d.hotelBase.mid * d.days.recommended) + d.flight[1] * 2 }))
    .filter((d) => d.estimate >= budget * 0.8 && d.estimate <= budget * 1.2)
    .slice(0, 3)
