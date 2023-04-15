import { css } from 'glamor'

import { Interaction } from '@project-r/styleguide'

import { useMe } from '../../lib/contexts/me'

const styles = {
  container: css({
    height: 48,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    margin: '1rem 0',
  }),
  portrait: css({
    width: 32,
    height: 32,
    backgroundSize: 'cover',
  }),
}

export default function User() {
  const { me } = useMe()

  return (
    <div {...styles.container}>
      {me?.portrait && (
        <div
          {...styles.portrait}
          style={{ backgroundImage: `url(${me?.portrait})` }}
        ></div>
      )}
      <div>{me?.name}</div>
    </div>
  )
}
