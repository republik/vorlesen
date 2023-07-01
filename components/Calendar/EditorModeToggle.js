import { css } from 'glamor'
import { Checkbox } from '@project-r/styleguide'

export const styles = {
  container: css({
    padding: '0.5rem 0',
  }),
}

export default function EditorModeToggle({ isEditorMode, handleEditorMode }) {
  return (
    <div {...styles.container}>
      <Checkbox onChange={handleEditorMode} checked={isEditorMode}>
        Editor-Modus
      </Checkbox>
    </div>
  )
}
