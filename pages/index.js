import { A, HR, Interaction } from '@project-r/styleguide'

import Link from 'next/link'
import { useMe } from '../lib/contexts/me'

export default function Index() {
  const { me, loading } = useMe()

  if (loading) {
    return <div>Lade...</div>
  }

  if (!me) {
    return (
      <Interaction.P>
        Noch bist du nicht angemeldet.
        {process.env.NEXT_PUBLIC_SIGNIN_URL && (
          <>
            {' '}
            Melde dich{' '}
            <Link href={process.env.NEXT_PUBLIC_SIGNIN_URL} passHref>
              <A>hier an</A>
            </Link>
            .
          </>
        )}
      </Interaction.P>
    )
  }

  return (
    <>
      <Interaction.P>
        Du bist als <strong>{me.name || me.email}</strong> angemeldet. Schön,
        bist du da.
      </Interaction.P>
      <HR />
      <Interaction.P>
        Du kannst in dieser Mini-App im{' '}
        <Link href='/calendar' passHref>
          <A>Kalender</A>
        </Link>{' '}
        Tage bei der Republik belegen oder{' '}
        <Link href='/publications' passHref>
          <A>Beiträge</A>
        </Link>{' '}
        an von dir belegten Tagen sehen, sobald sie eingesprochen werden können.
      </Interaction.P>
      <HR />
      <Interaction.P>
        Im «republikanischen»{' '}
        <Link
          href='https://republikmagazin.notion.site/Sprechbuch-bd9160ff6ad9414f9675802f7df46c9f'
          passHref
        >
          <A target='_blank'>Sprechbuch</A>
        </Link>{' '}
        findest du alle nötigen Informationen fürs Vorlesen.
      </Interaction.P>
    </>
  )
}
