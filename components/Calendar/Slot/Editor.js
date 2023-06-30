import { css } from 'glamor'
import { useEffect, useState } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'
import {
  Checkbox,
  InlineSpinner,
  Label,
  Overlay,
  OverlayBody,
  OverlayToolbar,
} from '@project-r/styleguide'
import { getMessages } from '../Error'
import { fragmentSlot, fragmentUser } from '../fragments'

export const styles = {
  clickable: css({
    cursor: 'pointer',
  }),
}

const GET_USERS = gql`
  query VorlesenGetUsers {
    users(search: "", role: "vorlesen") {
      ...User
    }
  }

  ${fragmentUser}
`

const BOOK_CALENDAR_SLOT_USER = gql`
  mutation VorlesenBookCalendarSlotUser($id: ID!, $userId: ID!) {
    bookCalendarSlot(id: $id, userId: $userId) {
      ...Slot
    }
  }

  ${fragmentSlot}
`

const CANCEL_CALENDAR_SLOT_USER = gql`
  mutation VorlesenBookCalendarSlotUser($id: ID!, $userId: ID!) {
    cancelCalendarSlot(id: $id, userId: $userId) {
      ...Slot
    }
  }

  ${fragmentSlot}
`

export default function Editor({ date, slot }) {
  const usersResult = useQuery(GET_USERS)
  const [book, bookResult] = useMutation(BOOK_CALENDAR_SLOT_USER)
  const [cancel, cancelResult] = useMutation(CANCEL_CALENDAR_SLOT_USER)
  const [error, setError] = useState(false)
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    const errorObject = bookResult.error || cancelResult.error || false

    if (errorObject) {
      setError(errorObject)
    }
  }, [bookResult.error, cancelResult.error])

  const users = usersResult?.data?.users

  const loading =
    (!users?.length && usersResult.loading) ||
    bookResult.loading ||
    cancelResult.loading

  const handleChangeCheckbox = ({ user, action }) => {
    const variables = { id: slot.id, userId: user.id }

    if (action === 'book') {
      return book({ variables })
    }

    if (action === 'cancel') {
      return cancel({ variables })
    }
  }

  const handleClose = () => {
    bookResult.reset?.()
    cancelResult.reset?.()
    setError(false)
    setOpen(false)
  }

  const slotBookedUserIds = slot.users.map((user) => user.id)

  return (
    <>
      {/* Loading indicator */}
      {loading && <InlineSpinner size={'1.5rem'} />}

      {!loading && (
        <div {...styles.clickable} onClick={() => setOpen(true)}>
          {slot?.users?.map((user) => (
            <div key={user.id}>
              <Label>{user.initials}</Label>
            </div>
          ))}
          {!slot.users.length && <Label>—</Label>}
        </div>
      )}

      {isOpen && (
        <Overlay onClose={handleClose}>
          <OverlayToolbar
            title={date.format('dddd, D. MMMM YYYY')}
            onClose={handleClose}
          />
          <OverlayBody>
            {users.map((user) => {
              const isBooked = slotBookedUserIds.includes(user.id)
              const action = isBooked ? 'cancel' : 'book'

              return (
                <div key={user.id} style={{ minHeight: '2rem' }}>
                  <Checkbox
                    onChange={() => handleChangeCheckbox({ user, action })}
                    checked={isBooked}
                    disabled={loading}
                  >
                    {user.name}
                  </Checkbox>
                </div>
              )
            })}

            {/* Error occured */}
            {error && getMessages(error)}
          </OverlayBody>
        </Overlay>
      )}
    </>
  )
}
