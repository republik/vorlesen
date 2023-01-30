import { useState } from 'react'
import { css } from 'glamor'

import { useQuery } from '@apollo/client'
import { Scroller, TabButton } from '@project-r/styleguide'

import { useMe } from '../../lib/contexts/me'
import { getDayjs } from '../../lib/utils'

import { GET_SLOTS } from '../Calendar'

import Day from './Day'

const styles = {
  tabsContainer: css({
    padding: '0 0 1rem 0',
  }),
}

function createFilterSlotBooked(me) {
  const isEditor = me?.roles?.includes?.('editor')

  return function filterNotMeVoice(slot) {
    if (isEditor) {
      return true
    }

    return slot.userHasBooked
  }
}

export default function Calendar() {
  const { me } = useMe()

  const [anchor] = useState(getDayjs().startOf('day'))
  const [tab, setTab] = useState(0)

  const options = {
    ssr: false,
    variables: {
      slug: process.env.NEXT_PUBLIC_CALENDAR_SLUG,
      from: anchor.toISOString(),
      to: anchor.add(7, 'days').toISOString(),
    },
  }

  const { data, loading } = useQuery(GET_SLOTS, options)

  const slots = data?.me?.calendar?.slots?.filter(createFilterSlotBooked(me))

  const slot = slots?.[tab]
  const date = slot && getDayjs(slot.key)

  return (
    <>
      <div {...styles.tabsContainer}>
        <Scroller activeChildIndex={tab}>
          {slots?.map((slot, index) => {
            const day = getDayjs(slot.key)

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
