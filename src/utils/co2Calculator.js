const MODE_FACTORS = { car: 0.12, flight: 0.255, train: 0.041, bus: 0.089, other: 0.1 }

export const transportCo2 = ({ mode, distance = 0, passengers = 1, vehicles = 1 }) => {
  const factor = MODE_FACTORS[mode] || MODE_FACTORS.other
  if (mode === 'car') return distance * factor * vehicles
  return distance * factor * passengers
}

export const impactLevel = (kg) => (kg < 200 ? 'Low' : kg < 700 ? 'Medium' : 'High')
