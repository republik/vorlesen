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

function UserSlotEditor({ user, slot }) {
  const [book, bookResult] = useMutation(BOOK_CALENDAR_SLOT_USER)
  const [cancel, cancelResult] = useMutation(CANCEL_CALENDAR_SLOT_USER)
  const [error, setError] = useState(false)

  useEffect(() => {
    const errorObject = bookResult.error || cancelResult.error || false

    if (errorObject) {
      setError(errorObject)
    }
  }, [bookResult.error, cancelResult.error])

  const slotBookedUserIds = slot.users.map((user) => user.id)
  const isBooked = slotBookedUserIds.includes(user.id)
  const loading = bookResult.loading || cancelResult.loading

  const handleChangeCheckbox = ({ user, action }) => {
    const variables = { id: slot.id, userId: user.id }

    setError(false)

    if (action === 'book') {
      return book({ variables })
    }

    if (action === 'cancel') {
      return cancel({ variables })
    }
  }

  const action = isBooked ? 'cancel' : 'book'

  return (
    <div key={user.id} style={{ minHeight: '3rem' }}>
      <Checkbox
        onChange={() => handleChangeCheckbox({ user, action })}
        checked={isBooked}
        disabled={loading}
      >
        {user.name}{' '}
        {getMessages(error, ({ children }) => (
          <span>{children}</span>
        ))}
        {loading && <InlineSpinner size={'1rem'} />}
      </Checkbox>
    </div>
  )
}

export default function Editor({ date, slot }) {
  const usersResult = useQuery(GET_USERS)
  const [isOpen, setOpen] = useState(false)

  const loading = usersResult.loading
  const users = usersResult?.data?.users

  return (
    <>
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
        <Overlay onClose={() => setOpen(false)}>
          <OverlayToolbar
            title={date.format('dddd, D. MMMM YYYY')}
            onClose={() => setOpen(false)}
          />
          <OverlayBody>
            {users.map((user) => (
              <UserSlotEditor key={user.id} user={user} slot={slot} />
            ))}
          </OverlayBody>
        </Overlay>
      )}
    </>
  )
}
