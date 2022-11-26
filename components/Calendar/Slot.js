import { css, merge } from 'glamor'
import { useEffect, useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import {
  useColorContext,
  Checkbox,
  CheckIcon,
  InlineSpinner,
  Interaction,
  Label,
} from '@project-r/styleguide'

import Error from './Error'
import { fragmentSlot } from './fragments'

const BOOK_CALENDAR_SLOT = gql`
  mutation BookCalendarSlot($id: ID!) {
    bookCalendarSlot(id: $id) {
      ...Slot
    }
  }

  ${fragmentSlot}
`

const CANCEL_CALENDAR_SLOT = gql`
  mutation CancelCalendarSlot($id: ID!) {
    cancelCalendarSlot(id: $id) {
      ...Slot
    }
  }

  ${fragmentSlot}
`

const styles = {
  slot: css({
    minWidth: '3rem',
    minHeight: '5rem',
  }),
  day: css({
    minWidth: '3rem',
  }),
  suggestion: css({
    borderRadius: '1rem',
    padding: '0 0.5rem',
  }),
  missingSlot: css({
    opacity: 0.5,
  }),
  weekday: css({
    minWidth: '3rem',
    minHeight: '2rem',
    textTransform: 'uppercase',
  }),
}

export function Placeholder({ date, slot }) {
  return (
    <div {...merge(styles.slot, !slot && styles.missingSlot)}>
      <Interaction.P>{date?.format('D')}</Interaction.P>
    </div>
  )
}

export function Weekday({ weekdayName }) {
  return (
    <Label>
      <div {...styles.weekday}>{weekdayName}</div>
    </Label>
  )
}

export default function Slot({ date, slot }) {
  const [book, bookResult] = useMutation(BOOK_CALENDAR_SLOT)
  const [cancel, cancelResult] = useMutation(CANCEL_CALENDAR_SLOT)
  const [error, setError] = useState(false)
  const [colorScheme] = useColorContext()

  useEffect(() => {
    const errorObject = bookResult.error || cancelResult.error || false

    if (errorObject) {
      setError(errorObject)
    }
  }, [bookResult.error, cancelResult.error])

  const isLoading = bookResult.loading || cancelResult.loading
  const isImmutable = !slot.userCanBook && !slot.userCanCancel
  const isBooked = slot.userHasBooked
  const isSuggested = !isImmutable && slot.users.length === 0

  const reset = () => {
    bookResult.reset?.()
    cancelResult.reset?.()
    setError(false)
  }

  const onChangeCheckbox = () => {
    const variables = { id: slot.id }

    if (slot.userCanBook) {
      return book({ variables })
    }

    if (slot.userCanCancel) {
      return cancel({ variables })
    }
  }

  const suggestionStyle = merge(
    styles.suggestion,
    isSuggested && colorScheme.set('color', 'default'),
    isSuggested && colorScheme.set('backgroundColor', 'primary'),
  )

  return (
    <div {...styles.slot}>
      {/* Day */}
      <div {...styles.day}>
        <Interaction.P>
          <span {...suggestionStyle}>{date.format('D')}</span>
        </Interaction.P>
      </div>

      {/* Interactive section */}
      <div>
        {/* Loading indicator */}
        {isLoading && <InlineSpinner size={'1.5rem'} />}

        {/* User can mutate slot */}
        {!isLoading && !isImmutable && (
          <Checkbox
            onChange={onChangeCheckbox}
            checked={!slot.userCanBook}
            disabled={isLoading || isImmutable}
          />
        )}

        {/* User can not mutate slot anymore, but booked it */}
        {!isLoading && isImmutable && isBooked && <CheckIcon />}

        {/* Error occured */}
        {error && <Error error={error} onClose={reset} />}
      </div>
    </div>
  )
}
