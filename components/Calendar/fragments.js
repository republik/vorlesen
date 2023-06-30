import { gql } from '@apollo/client'

export const fragmentCalendar = gql`
  fragment Calendar on Calendar {
    id
    slug
  }
`

export const fragmentUser = gql`
  fragment User on User {
    id
    name
    initials
    email
    roles
    portrait(properties: { height: 96, width: 96 })
  }
`

export const fragmentSlot = gql`
  fragment Slot on CalendarSlot {
    id
    key
    userCanBook
    userHasBooked
    userCanCancel
    users {
      ...User
    }
  }

  ${fragmentUser}
`
