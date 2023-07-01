import { css } from 'glamor'
import { Checkbox } from '@project-r/styleguide'
import { useMe } from '../../lib/contexts/me'

export const styles = {
  container: css({
    padding: '0.5rem 0',
  }),
}

export default function EditorModeToggle() {
  const { isEditor, isEditorMode, setEditorMode } = useMe()

  const handleEditorMode = () => {
    setEditorMode(!isEditorMode)
  }

  if (!isEditor) {
    return null
  }

  return (
    <div {...styles.container}>
      <Checkbox onChange={handleEditorMode} checked={isEditorMode}>
        Editor-Modus
      </Checkbox>
    </div>
  )
}
