const monthTemplate = [
  { high: 22, low: 12, rainfall: 20, humidity: 45, daylight: 10 },
  { high: 25, low: 14, rainfall: 25, humidity: 45, daylight: 11 },
  { high: 30, low: 18, rainfall: 40, humidity: 50, daylight: 12 },
  { high: 33, low: 22, rainfall: 45, humidity: 55, daylight: 12 },
  { high: 36, low: 24, rainfall: 55, humidity: 60, daylight: 13 },
  { high: 34, low: 24, rainfall: 120, humidity: 75, daylight: 13 },
  { high: 31, low: 23, rainfall: 180, humidity: 80, daylight: 13 },
  { high: 30, low: 22, rainfall: 160, humidity: 80, daylight: 12 },
  { high: 31, low: 21, rainfall: 90, humidity: 70, daylight: 12 },
  { high: 30, low: 18, rainfall: 35, humidity: 55, daylight: 11 },
  { high: 26, low: 15, rainfall: 20, humidity: 50, daylight: 10 },
  { high: 23, low: 12, rainfall: 15, humidity: 45, daylight: 10 },
]

export const getWeatherForDestination = (destination, month) => {
  const base = monthTemplate[(month || 1) - 1]
  const cold = destination?.tags?.includes('mountains') ? -8 : 0
  const humid = destination?.tags?.includes('beach') ? 10 : 0
  return {
    ...base,
    high: base.high + cold,
    low: base.low + cold,
    humidity: Math.min(95, base.humidity + humid),
    outdoor: base.rainfall < 100 ? 'Yes' : base.rainfall < 150 ? 'Partial' : 'No',
  }
}
