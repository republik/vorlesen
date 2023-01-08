import dayjs from 'dayjs'
import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { Scroller, TabButton } from '@project-r/styleguide'
import { css } from 'glamor'

import { GET_SLOTS } from '../Calendar'

import Day from './Day'

const styles = {
  tabsContainer: css({
    padding: '0 0 1rem 0',
  }),
}

export default function Calendar() {
  const [anchor] = useState(dayjs().startOf('day'))
  const [tab, setTab] = useState(0)

  const options = {
    ssr: false,
    variables: {
      slug: process.env.NEXT_PUBLIC_CALENDAR_SLUG,
      from: anchor.toISOString(),
      to: anchor.add(30, 'days').toISOString(),
    },
  }
  const { data, loading } = useQuery(GET_SLOTS, options)

  const slots = data?.me?.calendar?.slots?.filter((slot) => slot.userHasBooked)

  const slot = slots?.[tab]
  const date = slot && dayjs(slot.key)

  return (
    <>
      <div {...styles.tabsContainer}>
        <Scroller activeChildIndex={tab}>
          {slots?.map((slot, index) => {
            const day = dayjs(slot.key)

            return (
              <TabButton
                key={slot.id}
                text={day.format('dd, D. MMMM')}
                isActive={tab === index}
                onClick={() => setTab(index)}
              />
            )
          })}
          {loading && <>Lade…</>}
        </Scroller>
      </div>
      {date && <Day date={date} />}
    </>
  )
}
