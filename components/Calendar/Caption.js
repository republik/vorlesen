import { css, merge } from 'glamor'
import dayjs from 'dayjs'

import {
  useColorContext,
  Checkbox,
  CheckIcon,
  IconButton,
  Label,
} from '@project-r/styleguide'

import { styles as slotStyles } from './Slot'

const styles = {
  label: css({
    padding: '1rem 0',
    textTransform: 'uppercase',
  }),
  item: css({
    display: 'flex',
    alignItems: 'flex-start',
    paddingBottom: '1rem',
  }),
  element: css({
    minWidth: '3rem',
  }),
}

export default function Caption() {
  const [colorScheme] = useColorContext()

  const suggestionStyle = merge(
    slotStyles.suggestion,
    colorScheme.set('color', 'default'),
    colorScheme.set('backgroundColor', 'accentColorOppinion'),
  )

  return (
    <>
      <div {...styles.label}>
        <Label>Legende</Label>
      </div>
      <div {...styles.item}>
        <div {...styles.element}>
          <span {...suggestionStyle}>{dayjs().format('D')}</span>
        </div>
        <div>Tag, den die Republik für eine Belegung favorisiert</div>
      </div>
      <div {...styles.item}>
        <div {...styles.element}>
          <Checkbox onChange={() => {}} />
        </div>
        <div>Tag, den du belegen kannst. Klick belegt den Tag</div>
      </div>
      <div {...styles.item}>
        <div {...styles.element}>
          <Checkbox checked onChange={() => {}} />
        </div>
        <div>Tag, den du belegt hast. Klick gibt Tag wieder frei</div>
      </div>
      <div {...styles.item}>
        <div {...styles.element}>
          <IconButton Icon={CheckIcon} size={'1.2rem'} />
        </div>
        <div>Tag, den du in der Vergangenheit belegt hattest</div>
      </div>
    </>
  )
}
