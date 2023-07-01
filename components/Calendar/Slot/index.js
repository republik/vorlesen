import { css, merge } from 'glamor'
import { useColorContext, Interaction, Label } from '@project-r/styleguide'
import User from './User'
import Editor from './Editor'

export const styles = {
  slot: css({
    minWidth: '3rem',
    minHeight: '4.5rem',
  }),
  day: css({
    minWidth: '3rem',
  }),
  suggestion: css({
    borderRadius: '1rem',
    padding: '0 0.5rem',
  }),
  missingSlot: css({
    opacity: 0.5,
  }),
  weekday: css({
    minWidth: '3rem',
    minHeight: '2rem',
    textTransform: 'uppercase',
  }),
}

export function Placeholder({ date, slot }) {
  return (
    <div {...merge(styles.slot, !slot && styles.missingSlot)}>
      <Interaction.P>{date?.format('D')}</Interaction.P>
    </div>
  )
}

export function Weekday({ weekdayName }) {
  return (
    <Label>
      <div {...styles.weekday}>{weekdayName}</div>
    </Label>
  )
}

export default function Slot({ date, slot }) {
  const [colorScheme] = useColorContext()

  const isEditorMode = slot.isEditorMode
  const isImmutable = !slot.userCanBook && !slot.userCanCancel
  const isSuggested = !isImmutable && !slot.users.length

  const suggestionStyle = merge(
    styles.suggestion,
    isSuggested && colorScheme.set('color', 'default'),
    isSuggested && colorScheme.set('backgroundColor', 'accentColorOppinion'),
  )

  return (
    <div {...styles.slot}>
      {/* Day */}
      <div {...styles.day}>
        <Interaction.P>
          <span {...suggestionStyle}>{date.format('D')}</span>
        </Interaction.P>
      </div>

      {!isEditorMode && <User date={date} slot={slot} />}
      {isEditorMode && <Editor date={date} slot={slot} />}
    </div>
  )
}
