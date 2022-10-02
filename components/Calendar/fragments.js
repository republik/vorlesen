import { gql } from '@apollo/client'

export const fragmentCalendar = gql`
  fragment Calendar on Calendar {
    id
    slug
  }
`

export const fragmentSlot = gql`
  fragment Slot on CalendarSlot {
    id
    key
    userCanBook
    userHasBooked
    userCanCancel
  }
`
