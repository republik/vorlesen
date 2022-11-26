import { css } from 'glamor'

import { generateDays, getLocalizedWeekdays } from '../../lib/utils'

const weekdayNames = getLocalizedWeekdays()

const styles = {
  week: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }),
  day: css({
    textAlign: 'center',
  }),
}

export default function Grid({
  anchor,
  slots,
  weekdayAsComponent,
  placeholderAsComponent,
  weekdays = [0, 1, 2, 3, 4, 5, 6],
}) {
  const weeks = new Set()

  const days = generateDays(anchor).map((day) => {
    weeks.add(day.weekNumber)
    const slot = slots.find(
      (slot) => slot.key === day.date.format('YYYY-MM-DD'),
    )

    return {
      ...day,
      slot,
    }
  })

  // ensure there are 6 weeks rendered
  if (weeks.size < 6) {
    weeks.add(99)
  }

  return (
    <>
      {[...weeks].map((weekNumber, i) => {
        return (
          <div key={weekNumber}>
            {i === 0 && (
              <div {...styles.week}>
                {weekdays.map((weekdayNumber, i) => {
                  const props = {
                    weekNumber,
                    weekdayNumber,
                    weekdayName: weekdayNames[weekdayNumber],
                  }
                  const Component = weekdayAsComponent

                  return (
                    <div key={i} {...styles.day}>
                      {(Component && <Component {...props} />) || null}
                    </div>
                  )
                })}
              </div>
            )}
            <div {...styles.week}>
              {weekdays.map((weekdayNumber, i) => {
                const day = days.find(
                  (day) =>
                    day.weekNumber === weekNumber &&
                    day.weekdayNumber === weekdayNumber,
                )

                const Component = day?.slot?.slotAsComponent
                const Placeholder = placeholderAsComponent

                return (
                  <div key={i} {...styles.day}>
                    {(Component && <Component {...day} />) ||
                      (Placeholder && <Placeholder {...day} />) ||
                      null}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </>
  )
}
