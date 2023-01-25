import { Interaction, A } from '@project-r/styleguide'

import { useMe } from './enhancers'

export default function Me() {
  const { me, loading } = useMe()

  return (
    <Interaction.P>
      {!loading && !me && (
        <>
          Du bist nicht angemeldet.
          {process.env.NEXT_PUBLIC_SIGNIN_URL && (
            <>
              {' '}
              Melde dich zuerst{' '}
              <A href={process.env.NEXT_PUBLIC_SIGNIN_URL}>hier an</A>.
            </>
          )}
        </>
      )}
      {me && <>Angemeldet als: {me.name || me.email}</>}
      {loading && <>Lade ...</>}
    </Interaction.P>
  )
}
