import { useState } from 'react'

import { useQuery } from '@apollo/client'
import { Interaction } from '@project-r/styleguide'

import { useMe } from '../../lib/contexts/me'
import { getDayjs, createFilterSlotBooked } from '../../lib/utils'

import { GET_SLOTS } from '../Calendar'

import Repos from './Repos'

export default function Publications() {
  const { me } = useMe()

  const [anchor] = useState(getDayjs().startOf('day'))

  const options = {
    ssr: false,
    skip: !me,
    variables: {
      slug: process.env.NEXT_PUBLIC_CALENDAR_SLUG,
      from: anchor.toISOString(),
      to: anchor.add(7, 'days').toISOString(),
    },
  }

  const { data, loading } = useQuery(GET_SLOTS, options)

  if (loading) {
    return <>Lade…</>
  }

  const slots = data?.me?.calendar?.slots?.filter(createFilterSlotBooked(me))

  if (!slots?.length) {
    return <Interaction.P>Keine belegten Tage</Interaction.P>
  }

  return <Repos anchor={anchor} slots={slots} />
}
