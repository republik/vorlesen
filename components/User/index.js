import { css } from 'glamor'

import { useMe } from '../../lib/contexts/me'
import { Checkbox } from '@project-r/styleguide'

const styles = {
  container: css({
    height: 48,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    margin: '1rem 0 0 0',
  }),
  portrait: css({
    width: 32,
    height: 32,
    backgroundSize: 'cover',
  }),
}

export default function User() {
  const { me, isEditor, isEditorMode, setEditorMode } = useMe()

  const handleEditorMode = () => {
    setEditorMode(!isEditorMode)
  }

  return (
    <div {...styles.container}>
      {me?.portrait && (
        <div
          {...styles.portrait}
          style={{ backgroundImage: `url(${me?.portrait})` }}
        ></div>
      )}
      <div>{me?.name}</div>
      {isEditor && (
        <div style={{ marginTop: '.4rem' }}>
          <Checkbox onChange={handleEditorMode} checked={isEditorMode}>
            Editor-Modus
          </Checkbox>
        </div>
      )}
    </div>
  )
}
