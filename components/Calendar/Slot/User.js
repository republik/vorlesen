import { useEffect, useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { CheckIcon, Checkbox, InlineSpinner } from '@project-r/styleguide'
import Error from '../Error'
import { fragmentSlot } from '../fragments'

const BOOK_CALENDAR_SLOT = gql`
  mutation VorlesenBookCalendarSlot($id: ID!) {
    bookCalendarSlot(id: $id) {
      ...Slot
    }
  }

  ${fragmentSlot}
`

const CANCEL_CALENDAR_SLOT = gql`
  mutation VorlesenCancelCalendarSlot($id: ID!) {
    cancelCalendarSlot(id: $id) {
      ...Slot
    }
  }

  ${fragmentSlot}
`

export default function User({ slot }) {
  const [book, bookResult] = useMutation(BOOK_CALENDAR_SLOT)
  const [cancel, cancelResult] = useMutation(CANCEL_CALENDAR_SLOT)
  const [error, setError] = useState(false)

  useEffect(() => {
    const errorObject = bookResult.error || cancelResult.error || false

    if (errorObject) {
      setError(errorObject)
    }
  }, [bookResult.error, cancelResult.error])

  const loading = bookResult.loading || cancelResult.loading
  const isImmutable = !slot.userCanBook && !slot.userCanCancel
  const isBooked = slot.userHasBooked

  const handleChangeCheckbox = () => {
    const variables = { id: slot.id }

    if (slot.userCanBook) {
      return book({ variables })
    }

    if (slot.userCanCancel) {
      return cancel({ variables })
    }
  }

  const handleReset = () => {
    bookResult.reset?.()
    cancelResult.reset?.()
    setError(false)
  }

  return (
    <div>
      {/* Loading indicator */}
      {loading && <InlineSpinner size={'1.5rem'} />}

      {/* User can mutate slot */}
      {!loading && !isImmutable && (
        <Checkbox
          onChange={() => handleChangeCheckbox()}
          checked={!slot.userCanBook}
          disabled={loading || isImmutable}
        />
      )}

      {/* User can not mutate slot anymore, but booked it */}
      {!loading && isImmutable && isBooked && <CheckIcon />}

      {/* Error occured */}
      {error && <Error error={error} onClose={handleReset} />}
    </div>
  )
}
