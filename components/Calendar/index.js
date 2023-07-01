import dayjs from 'dayjs'
import { useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import { getFromTo, isEditor } from '../../lib/utils'
import { useMe } from '../../lib/contexts/me'
import EditorModeToggle from './EditorModeToggle'
import DatePicker from './DatePicker'
import Grid from './Grid'
import Hint from './Hint'
import Slot, { Placeholder, Weekday } from './Slot'
import Stats from './Stats'
import Caption from './Caption'
import { fragmentCalendar, fragmentSlot, fragmentUser } from './fragments'

export const GET_SLOTS = gql`
  query VorlesenGetSlots($slug: String!, $from: DateTime!, $to: DateTime!) {
    me {
      ...User
      calendar(slug: $slug) {
        ...Calendar
        slots(from: $from, to: $to) {
          ...Slot
        }
      }
    }
  }

  ${fragmentUser}
  ${fragmentCalendar}
  ${fragmentSlot}
`

export default function Calendar() {
  const { me, isEditor, isEditorMode } = useMe()
  const [anchor, setAnchor] = useState(dayjs().startOf('month'))

  const options = {
    ssr: false,
    skip: !me,
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
      {isEditor && <EditorModeToggle />}
      <DatePicker date={anchor.clone()} onPick={setAnchor} />
      <Grid
        anchor={anchor.format('YYYY-MM-DD')}
        slots={slots}
        weekdayAsComponent={Weekday}
        placeholderAsComponent={Placeholder}
      />
      {isEditorMode && <Stats slots={slots} />}
      <Caption />
    </>
  )
}
