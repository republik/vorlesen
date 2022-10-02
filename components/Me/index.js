import { css } from 'glamor'
import { gql, useQuery } from '@apollo/client'
import { Interaction, A } from '@project-r/styleguide'

const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      email
    }
  }
`

const styles = {
  slot: css({
    minWidth: '2rem',
    minHeight: '4rem',
  }),
  missingSlot: css({
    opacity: 0.5,
  }),
  weekday: css({
    minWidth: '2rem',
    minHeight: '2rem',
    textTransform: 'uppercase',
    fontSize: '0.8rem',
  }),
  hint: css({
    padding: '1rem',
  }),
}

export default function Me() {
  const options = {
    ssr: false,
  }
  const { data, loading: isLoading } = useQuery(GET_ME, options)

  const { me } = data || {}

  return (
    <Interaction.P>
      {isLoading && <>Verbinde ...</>}
      {!isLoading && !me && (
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
    </Interaction.P>
  )
}
