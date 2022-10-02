import * as dayjs from 'dayjs'
import * as weekday from 'dayjs/plugin/weekday'
import * as weekOfYear from 'dayjs/plugin/weekOfYear'
import * as localeData from 'dayjs/plugin/localeData'
import 'dayjs/locale/de-ch'

dayjs.extend(weekday)
dayjs.extend(weekOfYear)
dayjs.extend(localeData)
dayjs.locale('de-ch')

export const generateDays = (anchor) => {
  const anchorObject = dayjs(anchor)

  const slots = []

  const startOfMonth = anchorObject.clone().startOf('month')
  const startOfMonthWeekday = startOfMonth.weekday()
  const offsetStart = 0 - startOfMonthWeekday

  const daysInMonth = startOfMonth.daysInMonth()

  const endOfMonth = anchorObject.clone().endOf('month')
  const endOfMonthWeekday = endOfMonth.weekday()
  const daysUntilSunday = 6 - endOfMonthWeekday
  const offsetEnd = daysInMonth + daysUntilSunday

  for (let offset = offsetStart; offset < offsetEnd; offset++) {
    const date = startOfMonth.clone().add(offset, 'days')
    const weekNumber = date.week()
    const weekdayNumber = date.weekday()

    slots.push({ date, weekNumber, weekdayNumber })
  }

  return slots
}

export const getLocalizedWeekdays = () => {
  const weeksdays = dayjs.weekdaysMin()

  return [
    weeksdays[1],
    weeksdays[2],
    weeksdays[3],
    weeksdays[4],
    weeksdays[5],
    weeksdays[6],
    weeksdays[0],
  ]
}

export const getFromTo = (anchor) => {
  const date = dayjs(anchor)

  return {
    from: date.toISOString(),
    to: date.clone().endOf('month').toISOString(),
  }
}
