import { differenceInCalendarDays, eachDayOfInterval, format, isWeekend } from 'date-fns'
import { publicHolidays } from '../data/publicHolidays'

export const calcTripDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0
  return Math.max(1, differenceInCalendarDays(new Date(endDate), new Date(startDate)) + 1)
}

export const listHolidayHits = (startDate, endDate) => {
  if (!startDate || !endDate) return []
  const all = eachDayOfInterval({ start: new Date(startDate), end: new Date(endDate) })
  return all
    .map((d) => ({ date: format(d, 'yyyy-MM-dd'), dow: format(d, 'EEE') }))
    .map((d) => ({ ...d, holiday: publicHolidays.find((h) => h.date === d.date) }))
    .filter((d) => d.holiday)
}

export const effectiveLeaves = (startDate, endDate) => {
  if (!startDate || !endDate) return 0
  const all = eachDayOfInterval({ start: new Date(startDate), end: new Date(endDate) })
  const holidays = new Set(publicHolidays.map((h) => h.date))
  return all.filter((day) => !isWeekend(day) && !holidays.has(format(day, 'yyyy-MM-dd'))).length
}

export const seasonFromMonth = (month, destination) => {
  const m = Number(month)
  if ((destination?.avoidMonths || []).includes(m)) return 'monsoon'
  if ((destination?.bestMonths || []).includes(m)) return 'peak'
  if ([4,5,9].includes(m)) return 'shoulder'
  return 'off_peak'
}
