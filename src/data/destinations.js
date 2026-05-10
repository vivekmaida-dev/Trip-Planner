// ─── Destination Database ─────────────────────────────────────────
// Each entry: { id, name, country, region, emoji, type, driveable, distance,
//   days, visa, visaNote, bestMonths, avoidMonths, currency, exchangeRate,
//   flightHours, flight, train, bus, hotelBase, foodPerMeal, popularActivities, tags }

const mk = ({
  id, name, country, region, emoji, type = 'international',
  driveable = false, distance = 0, tags = [],
  visa = 'required', visaNote = 'Apply at embassy or online. Check official website.',
  bestMonths = [10, 11, 12, 1, 2, 3], avoidMonths = [6, 7, 8],
  currency = 'EUR', exchangeRate = 0.011,
  flightHours = 8, flight = [28000, 48000, 80000],
  train = null, bus = null,
  hotelBase = { budget: 3200, mid: 6500, premium: 13000, luxury: 28000 },
  foodPerMeal = { veg: { budget: 350, mid: 700, premium: 1400 }, nonveg: { budget: 450, mid: 900, premium: 1800 } },
  popularActivities = [{ name: 'City Tour', cost: 2000, perPerson: true }],
}) => ({
  id, name, country, region, emoji, type, driveable, distance,
  days: { min: 2, recommended: 5, max: 14 },
  activityFees: { budget: 1000, mid: 2500, premium: 5000 },
  visa, visaNote, bestMonths, avoidMonths,
  climate: tags.includes('beach') ? 'Mediterranean' : tags.includes('mountains') ? 'Alpine' : 'Temperate',
  currency, exchangeRate,
  flightHours, flight, train, bus, hotelBase, foodPerMeal, popularActivities, tags,
})

// ─── INDIA ────────────────────────────────────────────────────────
const indiaBase = {
  type: 'domestic', visa: 'free', visaNote: 'No visa required.',
  currency: 'INR', exchangeRate: 1,
  hotelBase: { budget: 800, mid: 2200, premium: 5500, luxury: 12000 },
  foodPerMeal: { veg: { budget: 150, mid: 320, premium: 650 }, nonveg: { budget: 200, mid: 400, premium: 800 } },
  train: [800, 1800, 3200], bus: [400, 900, 1800],
}

const mkIndia = (name, region, emoji, driveable, distance, tags, extra = {}) => mk({
  id: `in-${name.toLowerCase().replace(/[\s()'/]/g, '-')}`,
  name, country: 'India', region, emoji, driveable, distance, tags,
  bestMonths: tags.includes('beach') ? [10, 11, 12, 1, 2, 3] :
              tags.includes('mountains') && region.includes('North') ? [5, 6, 9, 10] :
              [10, 11, 12, 1, 2, 3],
  avoidMonths: tags.includes('mountains') && region.includes('North') ? [1, 2, 12] : [6, 7, 8],
  flightHours: distance > 2000 ? 2.5 : distance > 1000 ? 2 : 1.5,
  flight: distance > 3000 ? [4500, 7500, 14000] : distance > 1500 ? [3500, 6000, 11000] : [2500, 4500, 8500],
  ...indiaBase,
  ...extra,
})

const INDIA = [
  // North
  mkIndia('Manali', 'India - North', '🏔️', true, 980, ['mountains', 'adventure'], { bestMonths: [5, 6, 9, 10], avoidMonths: [1, 2, 12] }),
  mkIndia('Shimla', 'India - North', '🏔️', true, 720, ['mountains', 'history']),
  mkIndia('Kasol', 'India - North', '🏕️', true, 1020, ['mountains', 'food'], { bestMonths: [4, 5, 6, 9, 10] }),
  mkIndia('Dharamshala', 'India - North', '🧘', true, 940, ['mountains', 'history', 'spiritual']),
  mkIndia('McLeod Ganj', 'India - North', '🛕', true, 960, ['spiritual', 'mountains']),
  mkIndia('Rishikesh', 'India - North', '🛶', true, 520, ['adventure', 'spiritual']),
  mkIndia('Haridwar', 'India - North', '🪔', true, 500, ['spiritual']),
  mkIndia('Mussoorie', 'India - North', '🌲', true, 560, ['mountains']),
  mkIndia('Nainital', 'India - North', '⛵', true, 640, ['mountains']),
  mkIndia('Auli', 'India - North', '⛷️', true, 920, ['mountains', 'adventure']),
  mkIndia('Leh Ladakh', 'India - North', '🏔️', false, 0, ['mountains', 'adventure'], { bestMonths: [6, 7, 8, 9], avoidMonths: [1, 2, 3, 12] }),
  mkIndia('Spiti Valley', 'India - North', '🚙', true, 1300, ['mountains', 'adventure'], { bestMonths: [6, 7, 8, 9] }),
  mkIndia('Chandigarh', 'India - North', '🌳', true, 540, ['history', 'food']),
  mkIndia('Amritsar', 'India - North', '🛕', true, 900, ['spiritual', 'food', 'history']),
  mkIndia('Varanasi', 'India - North', '🪔', true, 1600, ['spiritual', 'history']),
  mkIndia('Ayodhya', 'India - North', '🛕', true, 1300, ['spiritual']),
  mkIndia('Agra', 'India - North', '🕌', true, 420, ['history']),
  mkIndia('Delhi', 'India - North', '🏛️', true, 0, ['history', 'food']),
  mkIndia('Corbett', 'India - North', '🐘', true, 550, ['wildlife']),
  mkIndia('Kanha', 'India - North', '🐅', false, 0, ['wildlife']),
  mkIndia('Pench', 'India - North', '🐆', false, 0, ['wildlife']),
  mkIndia('Bandhavgarh', 'India - North', '🌳', false, 0, ['wildlife']),
  mkIndia('Panna', 'India - North', '🐆', true, 1200, ['wildlife']),
  mkIndia('Satpura', 'India - North', '🌲', true, 1500, ['wildlife']),
  mkIndia('Bodh Gaya', 'India - East', '☸️', true, 1200, ['spiritual']),
  // West
  mkIndia('Jaipur', 'India - West', '🏰', true, 560, ['history', 'food']),
  mkIndia('Udaipur', 'India - West', '🚤', true, 1260, ['history']),
  mkIndia('Jaisalmer', 'India - West', '🏜️', true, 1600, ['history', 'adventure']),
  mkIndia('Jodhpur', 'India - West', '🟦', true, 1200, ['history']),
  mkIndia('Pushkar', 'India - West', '🐪', true, 700, ['spiritual', 'adventure']),
  mkIndia('Mount Abu', 'India - West', '⛰️', true, 1400, ['mountains']),
  mkIndia('Goa', 'India - West', '🏖️', false, 0, ['beach', 'food'], { flightHours: 2, flight: [4000, 7000, 13000], bestMonths: [11, 12, 1, 2, 3], avoidMonths: [6, 7, 8] }),
  mkIndia('Mumbai', 'India - West', '🏙️', false, 0, ['food', 'history']),
  mkIndia('Pune', 'India - West', '🌉', false, 0, ['food', 'history']),
  mkIndia('Tadoba', 'India - West', '🐅', true, 2200, ['wildlife']),
  mkIndia('Ahmedabad', 'India - West', '🏛️', true, 1900, ['history', 'food']),
  mkIndia('Ranthambore', 'India - West', '🐯', true, 780, ['wildlife']),
  // South
  mkIndia('Gokarna', 'India - South', '🌊', false, 0, ['beach'], { flightHours: 2 }),
  mkIndia('Varkala', 'India - South', '🌴', false, 0, ['beach']),
  mkIndia('Pondicherry', 'India - South', '🏝️', false, 0, ['beach', 'food']),
  mkIndia('Ooty', 'India - South', '🌿', false, 0, ['mountains']),
  mkIndia('Coorg', 'India - South', '☕', false, 0, ['mountains', 'food']),
  mkIndia('Munnar', 'India - South', '🍃', false, 0, ['mountains']),
  mkIndia('Hampi', 'India - South', '🗿', false, 0, ['history']),
  mkIndia('Mysore', 'India - South', '🏛️', false, 0, ['history']),
  mkIndia('Wayanad', 'India - South', '🌧️', false, 0, ['wildlife']),
  mkIndia('Periyar', 'India - South', '🌲', false, 0, ['wildlife']),
  mkIndia('Bandipur', 'India - South', '🐘', false, 0, ['wildlife']),
  mkIndia('Nagarhole', 'India - South', '🦬', false, 0, ['wildlife']),
  mkIndia('Mudumalai', 'India - South', '🦌', false, 0, ['wildlife']),
  mkIndia('Bangalore', 'India - South', '💻', false, 0, ['food', 'history']),
  mkIndia('Chennai', 'India - South', '🏛️', false, 0, ['history', 'food']),
  mkIndia('Hyderabad', 'India - South', '🍖', false, 0, ['history', 'food']),
  mkIndia('Alleppey', 'India - South', '🚤', false, 0, ['beach', 'adventure']),
  mkIndia('Kovalam', 'India - South', '🏖️', false, 0, ['beach']),
  mkIndia('Lakshadweep', 'India - South', '🏝️', false, 0, ['beach']),
  // East
  mkIndia('Andaman', 'India - East', '🐠', false, 0, ['beach', 'adventure']),
  mkIndia('Puri', 'India - East', '🛕', true, 3500, ['beach', 'spiritual']),
  mkIndia('Digha', 'India - East', '🌊', true, 3100, ['beach']),
  mkIndia('Mandarmani', 'India - East', '🏖️', true, 3300, ['beach']),
  mkIndia('Sundarbans', 'India - East', '🐅', false, 0, ['wildlife']),
  mkIndia('Kolkata', 'India - East', '🏛️', false, 0, ['history', 'food']),
  mkIndia('Darjeeling', 'India - East', '🍵', false, 0, ['mountains', 'food']),
  mkIndia('Sikkim', 'India - East', '🏔️', false, 0, ['mountains']),
  // Northeast
  mkIndia('Shillong', 'India - Northeast', '⛰️', false, 0, ['mountains']),
  mkIndia('Tawang', 'India - Northeast', '🛕', false, 0, ['mountains', 'spiritual']),
  mkIndia('Kaziranga', 'India - Northeast', '🦏', false, 0, ['wildlife']),
  mkIndia('Gangtok', 'India - Northeast', '🎏', false, 0, ['mountains']),
  mkIndia('Cherrapunji', 'India - Northeast', '🌧️', false, 0, ['mountains', 'adventure']),
  mkIndia('Ziro', 'India - Northeast', '🌾', false, 0, ['culture']),
]

// ─── NEARBY INTERNATIONAL ─────────────────────────────────────────
const mkNearby = (name, country, region, emoji, tags, extra = {}) => mk({
  id: `nb-${name.toLowerCase().replace(/[\s'()]/g, '-')}`,
  name, country, region, emoji, type: 'nearby', tags,
  visa: ['Nepal', 'Bhutan', 'Maldives'].includes(country) ? 'on_arrival' : 'e_visa',
  visaNote: 'Check official embassy website for latest requirements.',
  currency: country === 'Nepal' ? 'NPR' : country === 'Bhutan' ? 'BTN' :
            country === 'Sri Lanka' ? 'LKR' : country === 'Maldives' ? 'MVR' : 'USD',
  exchangeRate: country === 'Nepal' ? 0.6 : country === 'Bhutan' ? 1 :
                country === 'Sri Lanka' ? 0.25 : 0.012,
  flightHours: 2.5,
  flight: [8000, 15000, 28000],
  hotelBase: { budget: 1200, mid: 3000, premium: 7000, luxury: 16000 },
  foodPerMeal: { veg: { budget: 200, mid: 450, premium: 900 }, nonveg: { budget: 280, mid: 600, premium: 1200 } },
  ...extra,
})

const NEARBY = [
  mkNearby('Kathmandu', 'Nepal', 'Nepal & Bhutan', '🇳🇵', ['history', 'spiritual', 'adventure']),
  mkNearby('Pokhara', 'Nepal', 'Nepal & Bhutan', '🇳🇵', ['mountains', 'adventure']),
  mkNearby('Chitwan', 'Nepal', 'Nepal & Bhutan', '🇳🇵', ['wildlife']),
  mkNearby('Lumbini', 'Nepal', 'Nepal & Bhutan', '🇳🇵', ['spiritual']),
  mkNearby('Everest Base Camp', 'Nepal', 'Nepal & Bhutan', '🏔️', ['mountains', 'adventure'], { bestMonths: [3, 4, 5, 10, 11] }),
  mkNearby('Thimphu', 'Bhutan', 'Nepal & Bhutan', '🇧🇹', ['history', 'culture']),
  mkNearby('Paro', 'Bhutan', 'Nepal & Bhutan', '🇧🇹', ['history', 'spiritual']),
  mkNearby('Punakha', 'Bhutan', 'Nepal & Bhutan', '🇧🇹', ['history']),
  mkNearby('Colombo', 'Sri Lanka', 'South Asia', '🇱🇰', ['history', 'food']),
  mkNearby('Kandy', 'Sri Lanka', 'South Asia', '🇱🇰', ['history', 'spiritual']),
  mkNearby('Galle', 'Sri Lanka', 'South Asia', '🇱🇰', ['beach', 'history']),
  mkNearby('Ella', 'Sri Lanka', 'South Asia', '🇱🇰', ['mountains', 'adventure']),
  mkNearby('Sigiriya', 'Sri Lanka', 'South Asia', '🇱🇰', ['history']),
  mkNearby('Trincomalee', 'Sri Lanka', 'South Asia', '🇱🇰', ['beach']),
  mkNearby('Dhaka', 'Bangladesh', 'South Asia', '🇧🇩', ['history', 'food']),
  mkNearby("Cox's Bazar", 'Bangladesh', 'South Asia', '🇧🇩', ['beach']),
  mkNearby('Male', 'Maldives', 'South Asia', '🇲🇻', ['beach'], { hotelBase: { budget: 5000, mid: 12000, premium: 30000, luxury: 80000 }, flight: [12000, 22000, 40000] }),
  mkNearby('Baa Atoll', 'Maldives', 'South Asia', '🏝️', ['beach'], { hotelBase: { budget: 6000, mid: 15000, premium: 40000, luxury: 100000 } }),
  mkNearby('Yangon', 'Myanmar', 'Southeast Asia', '🇲🇲', ['history']),
  mkNearby('Bagan', 'Myanmar', 'Southeast Asia', '🇲🇲', ['history']),
  mkNearby('Inle Lake', 'Myanmar', 'Southeast Asia', '🇲🇲', ['adventure']),
]

// ─── SOUTHEAST ASIA ───────────────────────────────────────────────
const mkSEA = (name, country, emoji, tags, extra = {}) => mk({
  id: `sea-${name.toLowerCase().replace(/[\s'()]/g, '-')}`,
  name, country, region: 'Southeast Asia', emoji, type: 'international', tags,
  visa: 'on_arrival',
  visaNote: 'Visa on arrival / e-Visa available for Indian passport. Check duration limits.',
  currency: country === 'Thailand' ? 'THB' : country === 'Singapore' ? 'SGD' :
            country === 'Indonesia' ? 'IDR' : country === 'Malaysia' ? 'MYR' :
            country === 'Vietnam' ? 'VND' : country === 'Philippines' ? 'PHP' :
            country === 'Cambodia' ? 'KHR' : 'USD',
  exchangeRate: country === 'Thailand' ? 0.34 : country === 'Singapore' ? 0.061 :
                country === 'Indonesia' ? 0.0056 : country === 'Malaysia' ? 0.019 :
                country === 'Vietnam' ? 0.0034 : 0.012,
  flightHours: 4.5,
  flight: [12000, 22000, 38000],
  hotelBase: { budget: 1500, mid: 3500, premium: 8000, luxury: 18000 },
  foodPerMeal: { veg: { budget: 200, mid: 500, premium: 1000 }, nonveg: { budget: 280, mid: 650, premium: 1300 } },
  bestMonths: [11, 12, 1, 2, 3], avoidMonths: [6, 7, 8],
  ...extra,
})

const SEA = [
  mkSEA('Bangkok', 'Thailand', '🇹🇭', ['food', 'history', 'culture']),
  mkSEA('Phuket', 'Thailand', '🏖️', ['beach', 'adventure']),
  mkSEA('Chiang Mai', 'Thailand', '🛕', ['history', 'food', 'culture']),
  mkSEA('Koh Samui', 'Thailand', '🌴', ['beach']),
  mkSEA('Pattaya', 'Thailand', '🎡', ['beach', 'food']),
  mkSEA('Krabi', 'Thailand', '🏝️', ['beach', 'adventure']),
  mkSEA('Singapore', 'Singapore', '🇸🇬', ['food', 'culture', 'history'], { hotelBase: { budget: 5500, mid: 10000, premium: 22000, luxury: 50000 }, flight: [15000, 26000, 45000] }),
  mkSEA('Bali', 'Indonesia', '🌺', ['beach', 'spiritual', 'culture']),
  mkSEA('Jakarta', 'Indonesia', '🏙️', ['history', 'food']),
  mkSEA('Yogyakarta', 'Indonesia', '🛕', ['history', 'culture']),
  mkSEA('Lombok', 'Indonesia', '🏔️', ['beach', 'adventure']),
  mkSEA('Komodo', 'Indonesia', '🦎', ['adventure', 'wildlife']),
  mkSEA('Kuala Lumpur', 'Malaysia', '🇲🇾', ['food', 'history']),
  mkSEA('Langkawi', 'Malaysia', '🏝️', ['beach']),
  mkSEA('Penang', 'Malaysia', '🍜', ['food', 'history']),
  mkSEA('Ho Chi Minh City', 'Vietnam', '🇻🇳', ['history', 'food']),
  mkSEA('Hanoi', 'Vietnam', '🏛️', ['history', 'food']),
  mkSEA('Ha Long Bay', 'Vietnam', '⛵', ['adventure', 'nature']),
  mkSEA('Hoi An', 'Vietnam', '🏮', ['history', 'culture']),
  mkSEA('Da Nang', 'Vietnam', '🌊', ['beach', 'food']),
  mkSEA('Siem Reap', 'Cambodia', '🛕', ['history', 'culture']),
  mkSEA('Phnom Penh', 'Cambodia', '🏛️', ['history']),
  mkSEA('Manila', 'Philippines', '🇵🇭', ['history', 'food']),
  mkSEA('Palawan', 'Philippines', '🏝️', ['beach', 'adventure']),
  mkSEA('Cebu', 'Philippines', '🌊', ['beach', 'history']),
  mkSEA('Vientiane', 'Laos', '🛕', ['history', 'culture'], { visa: 'on_arrival' }),
  mkSEA('Luang Prabang', 'Laos', '🏮', ['history', 'spiritual']),
]

// ─── MIDDLE EAST ──────────────────────────────────────────────────
const mkME = (name, country, emoji, tags, extra = {}) => mk({
  id: `me-${name.toLowerCase().replace(/[\s'()]/g, '-')}`,
  name, country, region: 'Middle East', emoji, type: 'international', tags,
  visa: country === 'UAE' || country === 'Qatar' || country === 'Oman' ? 'on_arrival' : 'e_visa',
  visaNote: 'Indian passport: Visa on arrival / e-Visa available. Check entry requirements.',
  currency: country === 'UAE' ? 'AED' : country === 'Qatar' ? 'QAR' :
            country === 'Saudi Arabia' ? 'SAR' : country === 'Israel' ? 'ILS' : 'USD',
  exchangeRate: country === 'UAE' ? 0.22 : country === 'Qatar' ? 0.22 : 0.012,
  flightHours: 4,
  flight: [10000, 18000, 32000],
  hotelBase: { budget: 3000, mid: 6000, premium: 14000, luxury: 35000 },
  foodPerMeal: { veg: { budget: 400, mid: 800, premium: 1600 }, nonveg: { budget: 550, mid: 1100, premium: 2200 } },
  bestMonths: [10, 11, 12, 1, 2, 3, 4], avoidMonths: [6, 7, 8],
  ...extra,
})

const MIDDLE_EAST = [
  mkME('Dubai', 'UAE', '🇦🇪', ['food', 'adventure', 'history']),
  mkME('Abu Dhabi', 'UAE', '🕌', ['history', 'culture']),
  mkME('Doha', 'Qatar', '🇶🇦', ['history', 'food']),
  mkME('Muscat', 'Oman', '🇴🇲', ['history', 'adventure']),
  mkME('Salalah', 'Oman', '🌴', ['beach', 'adventure']),
  mkME('Riyadh', 'Saudi Arabia', '🇸🇦', ['history', 'culture'], { visa: 'e_visa' }),
  mkME('Jeddah', 'Saudi Arabia', '🌊', ['beach', 'history']),
  mkME('Istanbul', 'Turkey', '🕌', ['history', 'food', 'culture'], { currency: 'TRY', exchangeRate: 0.024, flightHours: 5.5 }),
  mkME('Cappadocia', 'Turkey', '🎈', ['adventure', 'history', 'culture']),
  mkME('Antalya', 'Turkey', '🏖️', ['beach', 'history']),
  mkME('Bodrum', 'Turkey', '⛵', ['beach']),
  mkME('Pamukkale', 'Turkey', '🌊', ['history', 'adventure']),
  mkME('Amman', 'Jordan', '🏛️', ['history', 'culture'], { visa: 'on_arrival' }),
  mkME('Petra', 'Jordan', '🗿', ['history', 'adventure']),
  mkME('Wadi Rum', 'Jordan', '🏜️', ['adventure']),
  mkME('Tel Aviv', 'Israel', '🌊', ['beach', 'food', 'history'], { visa: 'e_visa' }),
  mkME('Jerusalem', 'Israel', '🕌', ['spiritual', 'history']),
  mkME('Beirut', 'Lebanon', '🏙️', ['food', 'history']),
  mkME('Tehran', 'Iran', '🕌', ['history', 'culture'], { visa: 'required' }),
  mkME('Isfahan', 'Iran', '🕌', ['history', 'culture']),
]

// ─── EUROPE ───────────────────────────────────────────────────────
const mkEU = (name, country, region, emoji, tags, extra = {}) => mk({
  id: `eu-${name.toLowerCase().replace(/[\s'(),éàüäöñçșțıø]/g, (c) => {
    const m = { é:'e', à:'a', ü:'u', ä:'a', ö:'o', ñ:'n', ç:'c', ș:'s', ț:'t', ı:'i', ø:'o' }
    return m[c] || '-'
  })}`,
  name, country, region, emoji, type: 'international', tags,
  visa: 'required',
  visaNote: 'Schengen Visa required for Indian passport. Apply 3-4 weeks in advance.',
  currency: ['UK', 'United Kingdom'].includes(country) ? 'GBP' :
            ['Switzerland'].includes(country) ? 'CHF' :
            ['Norway', 'Sweden', 'Denmark'].includes(country) ? 'SEK' : 'EUR',
  exchangeRate: ['UK', 'United Kingdom'].includes(country) ? 0.0096 :
                ['Switzerland'].includes(country) ? 0.0088 : 0.011,
  flightHours: 8.5,
  flight: [32000, 55000, 95000],
  hotelBase: { budget: 3500, mid: 7500, premium: 16000, luxury: 38000 },
  foodPerMeal: { veg: { budget: 500, mid: 1000, premium: 2000 }, nonveg: { budget: 650, mid: 1300, premium: 2600 } },
  bestMonths: [4, 5, 6, 9, 10], avoidMonths: [12, 1, 2],
  ...extra,
})

const EUROPE = [
  // Spain
  mkEU('Madrid', 'Spain', 'Europe - West', '🇪🇸', ['history', 'food', 'culture'], { bestMonths: [4, 5, 9, 10, 11] }),
  mkEU('Barcelona', 'Spain', 'Europe - West', '🏛️', ['beach', 'history', 'food', 'culture']),
  mkEU('Seville', 'Spain', 'Europe - West', '💃', ['history', 'culture', 'food'], { bestMonths: [3, 4, 10, 11] }),
  mkEU('Granada', 'Spain', 'Europe - West', '🏰', ['history', 'culture']),
  mkEU('Valencia', 'Spain', 'Europe - West', '🍊', ['beach', 'food', 'history']),
  mkEU('Bilbao', 'Spain', 'Europe - West', '🎨', ['food', 'culture']),
  mkEU('Málaga', 'Spain', 'Europe - West', '☀️', ['beach', 'history']),
  mkEU('Toledo', 'Spain', 'Europe - West', '⚔️', ['history', 'culture']),
  mkEU('San Sebastián', 'Spain', 'Europe - West', '🦞', ['food', 'beach']),
  mkEU('Salamanca', 'Spain', 'Europe - West', '🏛️', ['history', 'culture']),
  mkEU('Ibiza', 'Spain', 'Europe - West', '🎶', ['beach', 'adventure']),
  mkEU('Palma de Mallorca', 'Spain', 'Europe - West', '🌴', ['beach', 'history']),
  // France
  mkEU('Paris', 'France', 'Europe - West', '🗼', ['history', 'food', 'culture'], { bestMonths: [4, 5, 6, 9, 10] }),
  mkEU('Lyon', 'France', 'Europe - West', '🍷', ['food', 'history']),
  mkEU('Nice', 'France', 'Europe - West', '🌊', ['beach', 'food']),
  mkEU('Marseille', 'France', 'Europe - West', '⚓', ['beach', 'history', 'food']),
  mkEU('Bordeaux', 'France', 'Europe - West', '🍷', ['food', 'history']),
  mkEU('Strasbourg', 'France', 'Europe - West', '🏰', ['history', 'culture']),
  mkEU('Cannes', 'France', 'Europe - West', '🎬', ['beach']),
  mkEU('Versailles', 'France', 'Europe - West', '🏰', ['history']),
  mkEU('Normandy', 'France', 'Europe - West', '🏖️', ['history']),
  mkEU('Mont Saint-Michel', 'France', 'Europe - West', '⛪', ['history', 'adventure']),
  // Italy
  mkEU('Rome', 'Italy', 'Europe - West', '🏛️', ['history', 'food', 'culture']),
  mkEU('Florence', 'Italy', 'Europe - West', '🎨', ['history', 'food', 'culture']),
  mkEU('Venice', 'Italy', 'Europe - West', '🚤', ['history', 'culture']),
  mkEU('Milan', 'Italy', 'Europe - West', '👗', ['food', 'culture']),
  mkEU('Naples', 'Italy', 'Europe - West', '🍕', ['food', 'history']),
  mkEU('Amalfi Coast', 'Italy', 'Europe - West', '🌊', ['beach', 'history']),
  mkEU('Sicily', 'Italy', 'Europe - West', '🏝️', ['beach', 'history', 'food']),
  mkEU('Cinque Terre', 'Italy', 'Europe - West', '🌈', ['beach', 'adventure']),
  mkEU('Turin', 'Italy', 'Europe - West', '🍫', ['food', 'history']),
  mkEU('Bologna', 'Italy', 'Europe - West', '🍝', ['food']),
  mkEU('Verona', 'Italy', 'Europe - West', '❤️', ['history', 'culture']),
  // UK
  mkEU('London', 'United Kingdom', 'Europe - West', '🎡', ['history', 'food', 'culture'], { currency: 'GBP', exchangeRate: 0.0096, hotelBase: { budget: 5000, mid: 11000, premium: 25000, luxury: 60000 } }),
  mkEU('Edinburgh', 'United Kingdom', 'Europe - West', '🏰', ['history', 'culture']),
  mkEU('Bath', 'United Kingdom', 'Europe - West', '🛁', ['history']),
  mkEU('Oxford', 'United Kingdom', 'Europe - West', '📚', ['history']),
  mkEU('Cambridge', 'United Kingdom', 'Europe - West', '🚣', ['history']),
  mkEU('Manchester', 'United Kingdom', 'Europe - West', '⚽', ['culture', 'food']),
  mkEU('Liverpool', 'United Kingdom', 'Europe - West', '🎸', ['culture', 'history']),
  // Germany
  mkEU('Berlin', 'Germany', 'Europe - West', '🇩🇪', ['history', 'culture', 'food']),
  mkEU('Munich', 'Germany', 'Europe - West', '🍺', ['food', 'history', 'culture']),
  mkEU('Hamburg', 'Germany', 'Europe - West', '⚓', ['history', 'food']),
  mkEU('Frankfurt', 'Germany', 'Europe - West', '🏙️', ['history', 'food']),
  mkEU('Cologne', 'Germany', 'Europe - West', '⛪', ['history', 'culture']),
  mkEU('Dresden', 'Germany', 'Europe - East', '🎨', ['history', 'culture']),
  mkEU('Heidelberg', 'Germany', 'Europe - West', '🏰', ['history']),
  mkEU('Nuremberg', 'Germany', 'Europe - West', '🏰', ['history']),
  mkEU('Rothenburg', 'Germany', 'Europe - West', '🏡', ['history', 'culture']),
  mkEU('Stuttgart', 'Germany', 'Europe - West', '🚗', ['culture']),
  // Portugal
  mkEU('Lisbon', 'Portugal', 'Europe - West', '🇵🇹', ['history', 'food', 'culture']),
  mkEU('Porto', 'Portugal', 'Europe - West', '🍷', ['history', 'food']),
  mkEU('Algarve', 'Portugal', 'Europe - West', '🏖️', ['beach', 'adventure']),
  mkEU('Sintra', 'Portugal', 'Europe - West', '🏰', ['history']),
  mkEU('Madeira', 'Portugal', 'Europe - West', '🌺', ['nature', 'adventure']),
  mkEU('Azores', 'Portugal', 'Europe - West', '🌋', ['adventure', 'nature']),
  // Netherlands
  mkEU('Amsterdam', 'Netherlands', 'Europe - West', '🇳🇱', ['history', 'culture', 'food']),
  mkEU('Rotterdam', 'Netherlands', 'Europe - West', '🌉', ['history']),
  mkEU('The Hague', 'Netherlands', 'Europe - West', '⚖️', ['history']),
  mkEU('Utrecht', 'Netherlands', 'Europe - West', '🚲', ['history', 'culture']),
  // Belgium
  mkEU('Brussels', 'Belgium', 'Europe - West', '🍫', ['history', 'food']),
  mkEU('Bruges', 'Belgium', 'Europe - West', '🏰', ['history', 'culture']),
  mkEU('Ghent', 'Belgium', 'Europe - West', '🏛️', ['history']),
  // Switzerland
  mkEU('Zurich', 'Switzerland', 'Europe - West', '🇨🇭', ['history', 'culture'], { currency: 'CHF', exchangeRate: 0.0088, hotelBase: { budget: 6000, mid: 13000, premium: 28000, luxury: 65000 } }),
  mkEU('Geneva', 'Switzerland', 'Europe - West', '⌚', ['history']),
  mkEU('Interlaken', 'Switzerland', 'Europe - West', '🏔️', ['mountains', 'adventure'], { bestMonths: [6, 7, 8, 9] }),
  mkEU('Lucerne', 'Switzerland', 'Europe - West', '🏔️', ['history', 'nature']),
  mkEU('Bern', 'Switzerland', 'Europe - West', '🐻', ['history']),
  mkEU('Zermatt', 'Switzerland', 'Europe - West', '⛷️', ['mountains', 'adventure']),
  // Austria
  mkEU('Vienna', 'Austria', 'Europe - West', '🎻', ['history', 'culture', 'food']),
  mkEU('Salzburg', 'Austria', 'Europe - West', '🎵', ['history', 'culture']),
  mkEU('Innsbruck', 'Austria', 'Europe - West', '⛷️', ['mountains', 'adventure']),
  mkEU('Hallstatt', 'Austria', 'Europe - West', '🏔️', ['nature', 'history']),
  // Czech Republic
  mkEU('Prague', 'Czech Republic', 'Europe - East', '🏰', ['history', 'food', 'culture']),
  mkEU('Cesky Krumlov', 'Czech Republic', 'Europe - East', '🏰', ['history']),
  mkEU('Brno', 'Czech Republic', 'Europe - East', '🍺', ['history']),
  // Hungary
  mkEU('Budapest', 'Hungary', 'Europe - East', '🏛️', ['history', 'food', 'culture']),
  mkEU('Pécs', 'Hungary', 'Europe - East', '🏛️', ['history']),
  // Poland
  mkEU('Warsaw', 'Poland', 'Europe - East', '🇵🇱', ['history', 'culture']),
  mkEU('Krakow', 'Poland', 'Europe - East', '🏰', ['history', 'food']),
  mkEU('Gdansk', 'Poland', 'Europe - East', '⚓', ['history']),
  mkEU('Wroclaw', 'Poland', 'Europe - East', '🌉', ['history']),
  // Croatia
  mkEU('Dubrovnik', 'Croatia', 'Europe - East', '🏰', ['beach', 'history']),
  mkEU('Split', 'Croatia', 'Europe - East', '🌊', ['beach', 'history']),
  mkEU('Zagreb', 'Croatia', 'Europe - East', '🏛️', ['history', 'culture']),
  mkEU('Hvar', 'Croatia', 'Europe - East', '🌴', ['beach']),
  mkEU('Plitvice Lakes', 'Croatia', 'Europe - East', '🌊', ['nature', 'adventure']),
  // Greece
  mkEU('Athens', 'Greece', 'Europe - East', '🏛️', ['history', 'food', 'culture'], { bestMonths: [4, 5, 9, 10, 11] }),
  mkEU('Santorini', 'Greece', 'Europe - East', '🌅', ['beach', 'culture']),
  mkEU('Mykonos', 'Greece', 'Europe - East', '🏖️', ['beach', 'culture']),
  mkEU('Crete', 'Greece', 'Europe - East', '🏝️', ['beach', 'history']),
  mkEU('Rhodes', 'Greece', 'Europe - East', '☀️', ['beach', 'history']),
  mkEU('Corfu', 'Greece', 'Europe - East', '🌿', ['beach']),
  // Scandinavia
  mkEU('Oslo', 'Norway', 'Europe - North', '🇳🇴', ['nature', 'history'], { currency: 'NOK', exchangeRate: 0.077, hotelBase: { budget: 5000, mid: 11000, premium: 24000, luxury: 55000 }, bestMonths: [5, 6, 7, 8, 9], avoidMonths: [12, 1, 2] }),
  mkEU('Bergen', 'Norway', 'Europe - North', '⛵', ['nature', 'adventure'], { currency: 'NOK', exchangeRate: 0.077 }),
  mkEU('Tromsø', 'Norway', 'Europe - North', '🌌', ['adventure', 'nature'], { bestMonths: [1, 2, 3, 11, 12], avoidMonths: [5, 6, 7] }),
  mkEU('Stockholm', 'Sweden', 'Europe - North', '🇸🇪', ['history', 'culture', 'food'], { currency: 'SEK', exchangeRate: 0.078, hotelBase: { budget: 4500, mid: 10000, premium: 22000, luxury: 50000 } }),
  mkEU('Gothenburg', 'Sweden', 'Europe - North', '🌊', ['history', 'food']),
  mkEU('Copenhagen', 'Denmark', 'Europe - North', '🇩🇰', ['history', 'food', 'culture'], { currency: 'DKK', exchangeRate: 0.11 }),
  mkEU('Helsinki', 'Finland', 'Europe - North', '🇫🇮', ['history', 'culture', 'nature'], { currency: 'EUR' }),
  mkEU('Rovaniemi', 'Finland', 'Europe - North', '🎅', ['adventure', 'nature'], { bestMonths: [12, 1, 2, 3] }),
  mkEU('Reykjavik', 'Iceland', 'Europe - North', '🌋', ['adventure', 'nature'], { currency: 'ISK', exchangeRate: 0.54, hotelBase: { budget: 7000, mid: 15000, premium: 32000, luxury: 70000 }, bestMonths: [6, 7, 8, 9] }),
  // Eastern Europe
  mkEU('Bucharest', 'Romania', 'Europe - East', '🏛️', ['history', 'culture']),
  mkEU('Transylvania', 'Romania', 'Europe - East', '🏰', ['history', 'adventure']),
  mkEU('Sofia', 'Bulgaria', 'Europe - East', '🏛️', ['history']),
  mkEU('Belgrade', 'Serbia', 'Europe - East', '🎺', ['food', 'culture']),
  mkEU('Ljubljana', 'Slovenia', 'Europe - East', '🏰', ['nature', 'history']),
  mkEU('Bled', 'Slovenia', 'Europe - East', '🏔️', ['nature', 'adventure']),
  mkEU('Tallinn', 'Estonia', 'Europe - North', '🏰', ['history', 'culture']),
  mkEU('Riga', 'Latvia', 'Europe - North', '🏛️', ['history']),
  mkEU('Vilnius', 'Lithuania', 'Europe - North', '⛪', ['history']),
  mkEU('Krakow', 'Poland', 'Europe - East', '🏰', ['history', 'food']),
  mkEU('Valletta', 'Malta', 'Europe - West', '🏰', ['history', 'beach']),
  mkEU('Nicosia', 'Cyprus', 'Europe - East', '🏝️', ['beach', 'history']),
]

// ─── EAST ASIA ────────────────────────────────────────────────────
const mkEA = (name, country, emoji, tags, extra = {}) => mk({
  id: `ea-${name.toLowerCase().replace(/[\s'()]/g, '-')}`,
  name, country, region: 'East Asia', emoji, type: 'international', tags,
  visa: country === 'Japan' ? 'on_arrival' : country === 'South Korea' ? 'on_arrival' :
        country === 'China' ? 'required' : 'e_visa',
  visaNote: country === 'Japan' ? 'Visa-free for Indian passport up to 90 days (check latest).' :
            'Check official embassy for latest visa requirements.',
  currency: country === 'Japan' ? 'JPY' : country === 'South Korea' ? 'KRW' :
            country === 'China' ? 'CNY' : country === 'Taiwan' ? 'TWD' : 'HKD',
  exchangeRate: country === 'Japan' ? 0.54 : country === 'South Korea' ? 0.057 :
                country === 'China' ? 0.11 : 0.012,
  flightHours: 7,
  flight: [25000, 42000, 75000],
  hotelBase: { budget: 3000, mid: 6500, premium: 15000, luxury: 35000 },
  foodPerMeal: { veg: { budget: 350, mid: 700, premium: 1400 }, nonveg: { budget: 450, mid: 900, premium: 1800 } },
  bestMonths: [3, 4, 5, 9, 10, 11], avoidMonths: [6, 7, 8],
  ...extra,
})

const EAST_ASIA = [
  mkEA('Tokyo', 'Japan', '🇯🇵', ['history', 'food', 'culture', 'adventure']),
  mkEA('Kyoto', 'Japan', '⛩️', ['history', 'culture', 'spiritual'], { bestMonths: [3, 4, 10, 11] }),
  mkEA('Osaka', 'Japan', '🍜', ['food', 'history', 'culture']),
  mkEA('Hiroshima', 'Japan', '🕊️', ['history']),
  mkEA('Nara', 'Japan', '🦌', ['history', 'nature']),
  mkEA('Sapporo', 'Japan', '❄️', ['food', 'nature'], { bestMonths: [1, 2, 3, 7, 8] }),
  mkEA('Fukuoka', 'Japan', '🍜', ['food', 'culture']),
  mkEA('Hakone', 'Japan', '🗻', ['nature', 'adventure']),
  mkEA('Nikko', 'Japan', '⛩️', ['history', 'nature']),
  mkEA('Seoul', 'South Korea', '🇰🇷', ['food', 'culture', 'history']),
  mkEA('Busan', 'South Korea', '🌊', ['beach', 'food']),
  mkEA('Jeju Island', 'South Korea', '🏝️', ['nature', 'beach']),
  mkEA('Beijing', 'China', '🇨🇳', ['history', 'culture']),
  mkEA('Shanghai', 'China', '🏙️', ['food', 'culture', 'history']),
  mkEA('Xi\'an', 'China', '⚔️', ['history']),
  mkEA('Chengdu', 'China', '🐼', ['food', 'wildlife']),
  mkEA('Guilin', 'China', '🏔️', ['nature', 'adventure']),
  mkEA('Hong Kong', 'Hong Kong', '🏙️', ['food', 'culture', 'history'], { visa: 'on_arrival', currency: 'HKD', exchangeRate: 0.1 }),
  mkEA('Taipei', 'Taiwan', '🇹🇼', ['food', 'culture', 'history'], { visa: 'on_arrival', currency: 'TWD', exchangeRate: 0.025 }),
  mkEA('Ulaanbaatar', 'Mongolia', '🐎', ['adventure', 'nature'], { visa: 'on_arrival' }),
]

// ─── AMERICAS ─────────────────────────────────────────────────────
const mkAM = (name, country, region, emoji, tags, extra = {}) => mk({
  id: `am-${name.toLowerCase().replace(/[\s'(),]/g, '-')}`,
  name, country, region, emoji, type: 'international', tags,
  visa: country === 'USA' || country === 'Canada' ? 'required' : 'on_arrival',
  visaNote: country === 'USA' ? 'US B-2 Visa required. Apply well in advance.' :
            country === 'Canada' ? 'eTA or Visitor Visa required.' :
            'Check official embassy for requirements.',
  currency: country === 'USA' || country === 'Canada' ? country === 'Canada' ? 'CAD' : 'USD' :
            country === 'Brazil' ? 'BRL' : country === 'Mexico' ? 'MXN' :
            country === 'Argentina' ? 'ARS' : 'USD',
  exchangeRate: country === 'USA' ? 0.012 : country === 'Canada' ? 0.016 :
                country === 'Brazil' ? 0.06 : country === 'Mexico' ? 0.2 : 0.012,
  flightHours: 16,
  flight: [45000, 75000, 130000],
  hotelBase: { budget: 4000, mid: 9000, premium: 20000, luxury: 50000 },
  foodPerMeal: { veg: { budget: 600, mid: 1200, premium: 2500 }, nonveg: { budget: 800, mid: 1600, premium: 3200 } },
  bestMonths: [5, 6, 9, 10], avoidMonths: [12, 1, 2],
  ...extra,
})

const AMERICAS = [
  mkAM('New York', 'USA', 'Americas - North', '🗽', ['history', 'food', 'culture']),
  mkAM('Los Angeles', 'USA', 'Americas - North', '🌴', ['food', 'culture', 'beach']),
  mkAM('San Francisco', 'USA', 'Americas - North', '🌉', ['history', 'food', 'culture']),
  mkAM('Las Vegas', 'USA', 'Americas - North', '🎰', ['culture', 'adventure']),
  mkAM('Miami', 'USA', 'Americas - North', '🏖️', ['beach', 'food', 'culture']),
  mkAM('Chicago', 'USA', 'Americas - North', '🏙️', ['food', 'history', 'culture']),
  mkAM('New Orleans', 'USA', 'Americas - North', '🎷', ['food', 'culture']),
  mkAM('Hawaii', 'USA', 'Americas - North', '🌺', ['beach', 'adventure', 'nature'], { flightHours: 20, flight: [55000, 90000, 150000] }),
  mkAM('Grand Canyon', 'USA', 'Americas - North', '🏜️', ['adventure', 'nature']),
  mkAM('Yellowstone', 'USA', 'Americas - North', '🌋', ['nature', 'adventure'], { bestMonths: [6, 7, 8, 9] }),
  mkAM('Toronto', 'Canada', 'Americas - North', '🇨🇦', ['history', 'food', 'culture'], { currency: 'CAD', exchangeRate: 0.016 }),
  mkAM('Vancouver', 'Canada', 'Americas - North', '🏔️', ['nature', 'food']),
  mkAM('Montreal', 'Canada', 'Americas - North', '🍁', ['history', 'food', 'culture']),
  mkAM('Banff', 'Canada', 'Americas - North', '🏔️', ['nature', 'adventure'], { bestMonths: [6, 7, 8, 9] }),
  mkAM('Mexico City', 'Mexico', 'Americas - North', '🇲🇽', ['history', 'food', 'culture'], { visa: 'on_arrival', currency: 'MXN', exchangeRate: 0.2 }),
  mkAM('Cancún', 'Mexico', 'Americas - North', '🏖️', ['beach', 'history']),
  mkAM('Rio de Janeiro', 'Brazil', 'Americas - South', '🌴', ['beach', 'culture', 'food'], { visa: 'on_arrival', currency: 'BRL', exchangeRate: 0.06, flightHours: 18 }),
  mkAM('São Paulo', 'Brazil', 'Americas - South', '🏙️', ['food', 'culture']),
  mkAM('Buenos Aires', 'Argentina', 'Americas - South', '🇦🇷', ['food', 'culture', 'history'], { visa: 'on_arrival', flightHours: 20 }),
  mkAM('Patagonia', 'Argentina', 'Americas - South', '🏔️', ['adventure', 'nature'], { bestMonths: [11, 12, 1, 2, 3] }),
  mkAM('Lima', 'Peru', 'Americas - South', '🇵🇪', ['history', 'food'], { visa: 'on_arrival', flightHours: 20 }),
  mkAM('Machu Picchu', 'Peru', 'Americas - South', '🏔️', ['history', 'adventure']),
  mkAM('Bogotá', 'Colombia', 'Americas - South', '🇨🇴', ['history', 'food'], { visa: 'on_arrival', flightHours: 18 }),
  mkAM('Cartagena', 'Colombia', 'Americas - South', '🏰', ['beach', 'history']),
  mkAM('Santiago', 'Chile', 'Americas - South', '🇨🇱', ['history', 'food'], { visa: 'on_arrival', flightHours: 21 }),
  mkAM('Havana', 'Cuba', 'Caribbean', '🇨🇺', ['history', 'culture', 'music'], { visa: 'required', flightHours: 18 }),
  mkAM('Punta Cana', 'Dominican Republic', 'Caribbean', '🏖️', ['beach'], { visa: 'on_arrival' }),
  mkAM('San Juan', 'Puerto Rico', 'Caribbean', '🏰', ['beach', 'history'], { visa: 'on_arrival' }),
  mkAM('Barbados', 'Barbados', 'Caribbean', '🌴', ['beach'], { visa: 'on_arrival' }),
]

// ─── AFRICA ───────────────────────────────────────────────────────
const mkAF = (name, country, emoji, tags, extra = {}) => mk({
  id: `af-${name.toLowerCase().replace(/[\s'()]/g, '-')}`,
  name, country, region: 'Africa', emoji, type: 'international', tags,
  visa: ['Egypt', 'Morocco', 'Kenya', 'Tanzania', 'South Africa'].includes(country) ? 'on_arrival' : 'required',
  visaNote: 'Check official embassy or consulate for visa requirements.',
  currency: country === 'Egypt' ? 'EGP' : country === 'Morocco' ? 'MAD' :
            country === 'South Africa' ? 'ZAR' : country === 'Kenya' ? 'KES' : 'USD',
  exchangeRate: country === 'Egypt' ? 0.026 : country === 'Morocco' ? 0.077 :
                country === 'South Africa' ? 0.042 : 0.012,
  flightHours: 9,
  flight: [30000, 52000, 90000],
  hotelBase: { budget: 2500, mid: 5500, premium: 12000, luxury: 28000 },
  foodPerMeal: { veg: { budget: 300, mid: 650, premium: 1300 }, nonveg: { budget: 400, mid: 850, premium: 1700 } },
  bestMonths: [11, 12, 1, 2, 3, 10], avoidMonths: [6, 7],
  ...extra,
})

const AFRICA = [
  mkAF('Cairo', 'Egypt', '🇪🇬', ['history', 'culture']),
  mkAF('Luxor', 'Egypt', '🏛️', ['history']),
  mkAF('Sharm El Sheikh', 'Egypt', '🐠', ['beach', 'adventure']),
  mkAF('Hurghada', 'Egypt', '🌊', ['beach']),
  mkAF('Marrakech', 'Morocco', '🇲🇦', ['history', 'food', 'culture']),
  mkAF('Casablanca', 'Morocco', '🏙️', ['history', 'food']),
  mkAF('Fes', 'Morocco', '🏺', ['history', 'culture']),
  mkAF('Chefchaouen', 'Morocco', '💙', ['culture', 'adventure']),
  mkAF('Cape Town', 'South Africa', '🇿🇦', ['nature', 'beach', 'adventure']),
  mkAF('Johannesburg', 'South Africa', '💎', ['history', 'culture']),
  mkAF('Kruger National Park', 'South Africa', '🦁', ['wildlife']),
  mkAF('Nairobi', 'Kenya', '🇰🇪', ['wildlife', 'culture']),
  mkAF('Maasai Mara', 'Kenya', '🦁', ['wildlife'], { bestMonths: [7, 8, 9, 10] }),
  mkAF('Zanzibar', 'Tanzania', '🏝️', ['beach']),
  mkAF('Serengeti', 'Tanzania', '🦓', ['wildlife'], { bestMonths: [1, 2, 6, 7, 8, 9] }),
  mkAF('Kilimanjaro', 'Tanzania', '🏔️', ['adventure', 'nature'], { bestMonths: [1, 2, 8, 9] }),
  mkAF('Mauritius', 'Mauritius', '🏝️', ['beach'], { visa: 'on_arrival', bestMonths: [4, 5, 9, 10, 11] }),
  mkAF('Seychelles', 'Seychelles', '🌴', ['beach'], { visa: 'on_arrival', hotelBase: { budget: 8000, mid: 18000, premium: 40000, luxury: 100000 } }),
  mkAF('Nairobi', 'Kenya', '🐘', ['wildlife']),
  mkAF('Accra', 'Ghana', '🇬🇭', ['history', 'culture']),
  mkAF('Addis Ababa', 'Ethiopia', '🇪🇹', ['history', 'culture']),
  mkAF('Dakar', 'Senegal', '🇸🇳', ['culture', 'food']),
]

// ─── PACIFIC & OCEANIA ────────────────────────────────────────────
const mkPA = (name, country, emoji, tags, extra = {}) => mk({
  id: `pa-${name.toLowerCase().replace(/[\s'()]/g, '-')}`,
  name, country, region: 'Pacific', emoji, type: 'international', tags,
  visa: country === 'Australia' ? 'e_visa' : country === 'New Zealand' ? 'e_visa' : 'on_arrival',
  visaNote: 'ETA / eVisa required. Apply online before travel.',
  currency: country === 'Australia' ? 'AUD' : country === 'New Zealand' ? 'NZD' : 'FJD',
  exchangeRate: country === 'Australia' ? 0.018 : country === 'New Zealand' ? 0.019 : 0.012,
  flightHours: 14,
  flight: [50000, 85000, 145000],
  hotelBase: { budget: 4500, mid: 9500, premium: 22000, luxury: 55000 },
  foodPerMeal: { veg: { budget: 600, mid: 1200, premium: 2400 }, nonveg: { budget: 800, mid: 1600, premium: 3200 } },
  bestMonths: [3, 4, 5, 9, 10, 11], avoidMonths: [6, 7, 8],
  ...extra,
})

const PACIFIC = [
  mkPA('Sydney', 'Australia', '🇦🇺', ['history', 'beach', 'food']),
  mkPA('Melbourne', 'Australia', '☕', ['food', 'culture']),
  mkPA('Brisbane', 'Australia', '🌞', ['beach', 'adventure']),
  mkPA('Cairns', 'Australia', '🐠', ['adventure', 'nature', 'beach']),
  mkPA('Gold Coast', 'Australia', '🏄', ['beach', 'adventure']),
  mkPA('Perth', 'Australia', '🦘', ['beach', 'nature']),
  mkPA('Uluru', 'Australia', '🪨', ['culture', 'nature'], { bestMonths: [4, 5, 6, 7, 8, 9] }),
  mkPA('Auckland', 'New Zealand', '🇳🇿', ['nature', 'adventure']),
  mkPA('Queenstown', 'New Zealand', '🏔️', ['adventure', 'nature'], { bestMonths: [12, 1, 2, 3] }),
  mkPA('Rotorua', 'New Zealand', '🌋', ['nature', 'culture']),
  mkPA('Milford Sound', 'New Zealand', '🏞️', ['nature', 'adventure']),
  mkPA('Fiji', 'Fiji', '🏝️', ['beach'], { bestMonths: [6, 7, 8, 9], hotelBase: { budget: 5000, mid: 12000, premium: 28000, luxury: 75000 } }),
  mkPA('Bora Bora', 'French Polynesia', '🌺', ['beach'], { hotelBase: { budget: 10000, mid: 25000, premium: 60000, luxury: 150000 } }),
]

// ─── CENTRAL ASIA ─────────────────────────────────────────────────
const mkCA = (name, country, emoji, tags, extra = {}) => mk({
  id: `ca-${name.toLowerCase().replace(/[\s'()]/g, '-')}`,
  name, country, region: 'Central Asia', emoji, type: 'international', tags,
  visa: 'on_arrival',
  visaNote: 'e-Visa available for Indian passport. Check validity and duration.',
  currency: country === 'Uzbekistan' ? 'UZS' : country === 'Kazakhstan' ? 'KZT' : 'USD',
  exchangeRate: country === 'Uzbekistan' ? 0.0077 : 0.012,
  flightHours: 5,
  flight: [18000, 32000, 55000],
  hotelBase: { budget: 1500, mid: 3500, premium: 8000, luxury: 18000 },
  foodPerMeal: { veg: { budget: 200, mid: 450, premium: 900 }, nonveg: { budget: 280, mid: 600, premium: 1200 } },
  bestMonths: [4, 5, 9, 10], avoidMonths: [12, 1, 2],
  ...extra,
})

const CENTRAL_ASIA = [
  mkCA('Tashkent', 'Uzbekistan', '🇺🇿', ['history', 'culture']),
  mkCA('Samarkand', 'Uzbekistan', '🕌', ['history', 'culture']),
  mkCA('Bukhara', 'Uzbekistan', '🏛️', ['history', 'culture']),
  mkCA('Khiva', 'Uzbekistan', '🏰', ['history']),
  mkCA('Almaty', 'Kazakhstan', '🏔️', ['culture', 'nature'], { currency: 'KZT', exchangeRate: 0.0015 }),
  mkCA('Astana', 'Kazakhstan', '🏙️', ['culture', 'history']),
  mkCA('Bishkek', 'Kyrgyzstan', '🏔️', ['adventure', 'nature']),
  mkCA('Issyk-Kul', 'Kyrgyzstan', '🏔️', ['nature', 'adventure'], { bestMonths: [6, 7, 8, 9] }),
  mkCA('Dushanbe', 'Tajikistan', '🏔️', ['history', 'nature']),
  mkCA('Ashgabat', 'Turkmenistan', '🏛️', ['history', 'culture'], { visa: 'required' }),
]

// ─── COMBINED EXPORT ──────────────────────────────────────────────
export const destinationsData = [
  ...INDIA,
  ...NEARBY,
  ...SEA,
  ...MIDDLE_EAST,
  ...EUROPE,
  ...EAST_ASIA,
  ...AMERICAS,
  ...AFRICA,
  ...PACIFIC,
  ...CENTRAL_ASIA,
]

export const regionFilters = [
  'All',
  'India - North',
  'India - South',
  'India - East',
  'India - West',
  'India - Northeast',
  'Nepal & Bhutan',
  'South Asia',
  'Southeast Asia',
  'Middle East',
  'Central Asia',
  'Europe - West',
  'Europe - East',
  'Europe - North',
  'East Asia',
  'Africa',
  'Pacific',
  'Americas - North',
  'Americas - South',
  'Caribbean',
]
