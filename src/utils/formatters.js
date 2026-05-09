export const formatINR = (value = 0) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)

export const formatCompactINR = (value = 0) =>
  new Intl.NumberFormat('en-IN', { notation: 'compact', maximumFractionDigits: 1 }).format(value)

export const clamp = (n, min, max) => Math.max(min, Math.min(max, n))
