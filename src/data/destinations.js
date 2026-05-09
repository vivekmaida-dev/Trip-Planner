import countries from 'world-countries'

const regionBuckets = [
  'Southeast Asia',
  'Middle East',
  'Central Asia',
  'South Asia',
  'Europe - West',
  'Europe - East',
  'Europe - North',
  'Africa',
  'East Asia',
  'Pacific',
  'Americas - North',
  'Americas - South',
  'Caribbean',
]

const indiaCurated = [
  ['Manali', 'India - North', '🏔️', true, 980, ['mountains', 'adventure']],
  ['Shimla', 'India - North', '🏔️', true, 720, ['mountains', 'history']],
  ['Kasol', 'India - North', '🏕️', true, 1020, ['mountains', 'food']],
  ['Dharamshala', 'India - North', '🧘', true, 940, ['mountains', 'history']],
  ['Rishikesh', 'India - North', '🛶', true, 520, ['adventure', 'spiritual']],
  ['Mussoorie', 'India - North', '🌲', true, 560, ['mountains']],
  ['Nainital', 'India - North', '⛵', true, 640, ['mountains']],
  ['Auli', 'India - North', '⛷️', true, 920, ['mountains', 'adventure']],
  ['Leh Ladakh', 'India - North', '🏔️', false, 0, ['mountains', 'adventure']],
  ['Spiti Valley', 'India - North', '🚙', true, 1300, ['mountains', 'adventure']],
  ['Jaipur', 'India - West', '🏰', true, 560, ['history', 'food']],
  ['Udaipur', 'India - West', '🚤', true, 1260, ['history']],
  ['Jaisalmer', 'India - West', '🏜️', true, 1600, ['history', 'adventure']],
  ['Jodhpur', 'India - West', '🟦', true, 1200, ['history']],
  ['Goa', 'India - West', '🏖️', true, 3800, ['beach', 'food']],
  ['Gokarna', 'India - South', '🌊', true, 4100, ['beach']],
  ['Varkala', 'India - South', '🌴', false, 0, ['beach']],
  ['Pondicherry', 'India - South', '🏝️', true, 4700, ['beach', 'food']],
  ['Andaman', 'India - East', '🐠', false, 0, ['beach', 'adventure']],
  ['Lakshadweep', 'India - South', '🏝️', false, 0, ['beach']],
  ['Ooty', 'India - South', '🌿', true, 5200, ['mountains']],
  ['Coorg', 'India - South', '☕', true, 4800, ['mountains', 'food']],
  ['Munnar', 'India - South', '🍃', false, 0, ['mountains']],
  ['Hampi', 'India - South', '🗿', true, 3900, ['history']],
  ['Mysore', 'India - South', '🏛️', true, 4300, ['history']],
  ['Wayanad', 'India - South', '🌧️', true, 5000, ['wildlife']],
  ['Shillong', 'India - Northeast', '⛰️', false, 0, ['mountains']],
  ['Tawang', 'India - Northeast', '🛕', false, 0, ['mountains', 'spiritual']],
  ['Kaziranga', 'India - Northeast', '🦏', false, 0, ['wildlife']],
  ['Gangtok', 'India - Northeast', '🎏', false, 0, ['mountains']],
  ['Puri', 'India - East', '🛕', true, 3500, ['beach', 'spiritual']],
  ['Digha', 'India - East', '🌊', true, 3100, ['beach']],
  ['Mandarmani', 'India - East', '🏖️', true, 3300, ['beach']],
  ['Sundarbans', 'India - East', '🐅', false, 0, ['wildlife']],
  ['Corbett', 'India - North', '🐘', true, 550, ['wildlife']],
  ['Ranthambore', 'India - West', '🐯', true, 780, ['wildlife']],
  ['Kanha', 'India - North', '🐅', false, 0, ['wildlife']],
  ['Pench', 'India - North', '🐆', false, 0, ['wildlife']],
  ['Bandhavgarh', 'India - North', '🌳', false, 0, ['wildlife']],
  ['Periyar', 'India - South', '🌲', false, 0, ['wildlife']],
  ['Bandipur', 'India - South', '🐘', true, 4700, ['wildlife']],
  ['Nagarhole', 'India - South', '🦬', true, 4600, ['wildlife']],
  ['Mudumalai', 'India - South', '🦌', true, 5000, ['wildlife']],
  ['Tadoba', 'India - West', '🐅', true, 2200, ['wildlife']],
  ['Panna', 'India - North', '🐆', true, 1200, ['wildlife']],
  ['Satpura', 'India - North', '🌲', true, 1500, ['wildlife']],
  ['Varanasi', 'India - North', '🪔', true, 1600, ['spiritual', 'history']],
  ['Bodh Gaya', 'India - East', '☸️', true, 1200, ['spiritual']],
  ['Amritsar', 'India - North', '🛕', true, 900, ['spiritual', 'food']],
  ['Ayodhya', 'India - North', '🛕', true, 1300, ['spiritual']],
]

const nearby = [
  ['Kathmandu', 'Nepal', 'Nepal & Bhutan', '🇳🇵'],
  ['Pokhara', 'Nepal', 'Nepal & Bhutan', '🇳🇵'],
  ['Chitwan', 'Nepal', 'Nepal & Bhutan', '🇳🇵'],
  ['Lumbini', 'Nepal', 'Nepal & Bhutan', '🇳🇵'],
  ['Thimphu', 'Bhutan', 'Nepal & Bhutan', '🇧🇹'],
  ['Paro', 'Bhutan', 'Nepal & Bhutan', '🇧🇹'],
  ['Punakha', 'Bhutan', 'Nepal & Bhutan', '🇧🇹'],
  ['Colombo', 'Sri Lanka', 'South Asia', '🇱🇰'],
  ['Kandy', 'Sri Lanka', 'South Asia', '🇱🇰'],
  ['Galle', 'Sri Lanka', 'South Asia', '🇱🇰'],
  ['Ella', 'Sri Lanka', 'South Asia', '🇱🇰'],
  ['Sigiriya', 'Sri Lanka', 'South Asia', '🇱🇰'],
  ['Dhaka', 'Bangladesh', 'South Asia', '🇧🇩'],
  ["Cox's Bazar", 'Bangladesh', 'South Asia', '🇧🇩'],
  ['Yangon', 'Myanmar', 'Southeast Asia', '🇲🇲'],
  ['Bagan', 'Myanmar', 'Southeast Asia', '🇲🇲'],
  ['Inle Lake', 'Myanmar', 'Southeast Asia', '🇲🇲'],
  ['Male', 'Maldives', 'South Asia', '🇲🇻'],
  ['Bangkok', 'Thailand', 'Southeast Asia', '🇹🇭'],
  ['Phuket', 'Thailand', 'Southeast Asia', '🇹🇭'],
  ['Chiang Mai', 'Thailand', 'Southeast Asia', '🇹🇭'],
  ['Singapore', 'Singapore', 'Southeast Asia', '🇸🇬'],
  ['Bali', 'Indonesia', 'Southeast Asia', '🇮🇩'],
  ['Jakarta', 'Indonesia', 'Southeast Asia', '🇮🇩'],
  ['Kuala Lumpur', 'Malaysia', 'Southeast Asia', '🇲🇾'],
  ['Langkawi', 'Malaysia', 'Southeast Asia', '🇲🇾'],
  ['Ho Chi Minh City', 'Vietnam', 'Southeast Asia', '🇻🇳'],
  ['Hanoi', 'Vietnam', 'Southeast Asia', '🇻🇳'],
  ['Dubai', 'United Arab Emirates', 'Middle East', '🇦🇪'],
  ['Abu Dhabi', 'United Arab Emirates', 'Middle East', '🇦🇪'],
  ['Doha', 'Qatar', 'Middle East', '🇶🇦'],
  ['Muscat', 'Oman', 'Middle East', '🇴🇲'],
  ['Tashkent', 'Uzbekistan', 'Central Asia', '🇺🇿'],
]

const mkDestination = ({ id, name, country, region, emoji, type, driveable, distance, tags }) => ({
  id,
  name,
  country,
  region,
  emoji,
  type,
  driveable,
  distance,
  days: { min: 3, recommended: 6, max: 12 },
  activityFees: { budget: 800, mid: 1800, premium: 3600 },
  visa: country === 'India' ? 'free' : ['free', 'on_arrival', 'e_visa', 'required'][Math.abs(country.length) % 4],
  visaNote: country === 'India' ? 'No visa needed for domestic travel.' : 'Processing 3-10 business days. Check official embassy website.',
  bestMonths: [10, 11, 12, 1, 2, 3],
  avoidMonths: [6, 7, 8],
  climate: tags.includes('beach') ? 'Tropical' : tags.includes('mountains') ? 'Alpine' : 'Temperate',
  currency: country === 'India' ? 'INR' : 'USD',
  exchangeRate: country === 'India' ? 1 : 0.012,
  flightHours: country === 'India' ? 1.8 : 6,
  flight: [4500, 7800, 14500],
  train: country === 'India' ? [1800, 3200, 5200] : null,
  bus: country === 'India' ? [900, 1800, 2800] : null,
  hotelBase: { budget: 1800, mid: 3200, premium: 5900, luxury: 11000 },
  foodPerMeal: {
    veg: { budget: 180, mid: 360, premium: 720 },
    nonveg: { budget: 240, mid: 450, premium: 900 },
  },
  popularActivities: [
    { name: 'City Tour', cost: 1200, perPerson: true },
    { name: 'Local Experience', cost: 2500, perPerson: false },
  ],
  tags,
})

const destinations = []

indiaCurated.forEach(([name, region, emoji, driveable, distance, tags], index) => {
  destinations.push(
    mkDestination({
      id: `ind-${index}-${name.toLowerCase().replace(/\s+/g, '-')}`,
      name,
      country: 'India',
      region,
      emoji,
      type: 'domestic',
      driveable,
      distance,
      tags,
    }),
  )
})

nearby.forEach(([name, country, region, emoji], index) => {
  destinations.push(
    mkDestination({
      id: `nearby-${index}-${name.toLowerCase().replace(/\s+/g, '-')}`,
      name,
      country,
      region,
      emoji,
      type: 'nearby',
      driveable: false,
      distance: 0,
      tags: ['adventure', 'food'],
    }),
  )
})

countries.forEach((country, index) => {
  const cname = country?.name?.common
  if (!cname || cname === 'India') return

  const capital = (country.capital && country.capital[0]) || `${cname} Capital`
  const region = regionBuckets[index % regionBuckets.length]
  const emoji = country.flag || '🌍'

  ;[capital, `${capital} Old Quarter`].forEach((city, cityIndex) => {
    destinations.push(
      mkDestination({
        id: `${country.cca2?.toLowerCase() || 'xx'}-${cityIndex}`,
        name: city,
        country: cname,
        region,
        emoji,
        type: 'international',
        driveable: false,
        distance: 0,
        tags: cityIndex === 0 ? ['history', 'food'] : ['adventure', 'culture'],
      }),
    )
  })
})

export const destinationsData = destinations

export const regionFilters = [
  'All',
  'India - North',
  'India - South',
  'India - East',
  'India - West',
  'India - Northeast',
  'Nepal & Bhutan',
  'Southeast Asia',
  'Middle East',
  'Central Asia',
  'South Asia',
  'Europe - West',
  'Europe - East',
  'Europe - North',
  'Africa',
  'East Asia',
  'Pacific',
  'Americas - North',
  'Americas - South',
  'Caribbean',
]
