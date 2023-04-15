import dayjs from 'dayjs'
import { useState } from 'react'
import { gql, useQuery } from '@apollo/client'

import DatePicker from './DatePicker'
import Grid from './Grid'
import Hint from './Hint'
import Slot, { Placeholder, Weekday } from './Slot'
import Caption from './Caption'

import { fragmentCalendar, fragmentSlot } from './fragments'

import { getFromTo } from '../../lib/utils'

export const GET_SLOTS = gql`
  query VorlesenGetSlots($slug: String!, $from: DateTime!, $to: DateTime!) {
    me {
      id
      calendar(slug: $slug) {
        ...Calendar
        slots(from: $from, to: $to) {
          ...Slot
        }
      }
    }
  }

  ${fragmentCalendar}
  ${fragmentSlot}
`

export default function Calendar() {
  const [anchor, setAnchor] = useState(dayjs().startOf('month'))

  const options = {
    ssr: false,
    variables: {
      slug: process.env.NEXT_PUBLIC_CALENDAR_SLUG,
      ...getFromTo(anchor),
    },
  }
  const { data, loading: isLoading } = useQuery(GET_SLOTS, options)

  // @TODO: handle network errors (Bad Request, etc.)

  const slots =
    data?.me?.calendar?.slots?.map((slot) => ({
      ...slot,
      slotAsComponent: Slot,
    })) || []

  const hasSlots = !!slots.length

  return (
    <>
      {!isLoading && !hasSlots && (
        <Hint>Ihrem Konto stehen keine Kalenderdaten zur Verfügung.</Hint>
      )}
      <DatePicker date={anchor.clone()} onPick={setAnchor} />
      <Grid
        anchor={anchor.format('YYYY-MM-DD')}
        slots={slots}
        weekdayAsComponent={Weekday}
        placeholderAsComponent={Placeholder}
      />
      <Caption />
    </>
  )
}
